import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ApiError } from 'exceptions/api.error';
import { LoginUserDto } from 'models/user/dto/loginUser.dto';
import { RegUserDto } from 'models/user/dto/regUser.dto';
import { UserDto } from 'models/user/dto/user.dto';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'prisma/prisma.service';
import { ResetPasswordDto, SendEmailDto } from './dto/resetPassword.dto';
import { MailService } from './mail.service';
import { PasswordService } from './password.service';
import { UserPublicService } from 'models/user/userPublic.service';
import { TokenPublicService } from 'models/token/tokenPublic.service';

interface UserResponseWithTokens {
  user: RegUserDto;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userPublicService: UserPublicService,
    private mailService: MailService,
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private readonly logger: Logger,
    private readonly tokenPublicService: TokenPublicService,
  ) {}

  async login(dto: LoginUserDto): Promise<UserResponseWithTokens> {
    this.logger.log('AuthService login', { dto: dto });
    const user = await this.userPublicService.getByEmail(dto.email);
    await this.passwordService.validatePassword(dto.password, user.password);

    const userDto = new RegUserDto(user);
    const tokens = await this.generateAndSaveTokens(userDto);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async registration(
    dto: UserDto,
  ): Promise<{ statusCode: number; message: string; user: { username: string; email: string } }> {
    this.logger.log(`UserService registration`, { dto: dto });
    return await this.prisma.$transaction(async (prisma: PrismaService) => {
      await this.checkUserExists(dto.email, dto.username);
      const hashedPassword = await this.passwordService.generatePassword(dto.password);
      const { activationExpiresAt, activationLink } =
        this.mailService.generateActivationLinkAndExpires();
      if (dto.username === 'admin') {
        await this.userPublicService.createUserWithRole(
          prisma,
          dto,
          'ADMIN',
          'admin role',
          hashedPassword,
          activationLink,
          activationExpiresAt,
        );
      } else {
        await this.userPublicService.createUserWithRole(
          prisma,
          dto,
          'USER',
          'user role',
          hashedPassword,
          activationLink,
          activationExpiresAt,
        );
      }
      await this.mailService.sendActivationMail(
        dto.email,
        `${process.env.API_URL}/auth/activate/${activationLink}`,
      );

      this.logger.log(`User created.`, {
        service: 'AuthService',
        method: 'registration',
        username: dto.username,
        email: dto.email,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created. Please check your email to activate your account',
        user: {
          username: dto.username,
          email: dto.email,
        },
      };
    });
  }

  async logout(refreshToken: string) {
    try {
      this.logger.log(`AuthService logout`);
      await this.tokenPublicService.removeToken(refreshToken);
      this.logger.log(`AuthService: logout successful for token ${refreshToken}`);
    } catch (e) {
      this.logger.error(`AuthService: logout failed for token ${refreshToken}`, {
        error: e.message,
        stack: e.stack,
      });
      throw e;
    }
  }

  async activate(activationLink: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userPublicService.findByActivationLink(activationLink);
    if (!user) {
      throw ApiError.BadRequest('Invalid activation link');
    }
    await this.userPublicService.activate(user.id)
    const userDto = {
      id: user.id,
      isActivated: true,
      email: user.email,
    };
    const tokens = await this.generateAndSaveTokens(userDto);
    return {
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<UserResponseWithTokens> {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const tokenData = this.tokenPublicService.validateRefreshToken(refreshToken);
    this.logger.log(`TokenData refresh`, { tokenData: tokenData });
    const tokenFromDb = await this.tokenPublicService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await this.userPublicService.getById(tokenData.payload.id);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }
    const userDto = new RegUserDto(user);
    const tokens = await this.generateAndSaveTokens(userDto);
    return {
      ...tokens,
      user: userDto,
    };
  }

  async sendEmail(dto: SendEmailDto) {
    const user = await this.userPublicService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    const userDto = new RegUserDto(user);
    try {
      const tokens = await this.generateAndSaveTokens(userDto);
      await this.mailService.sendResetMail(
        dto.email,
        `${process.env.CLIENT_URL}/reset_password/${tokens.accessToken}`,
      );

      return { message: 'Reset email sent successfully' };
    } catch (e) {
      this.logger.error({ service: 'AuthService', error: e }, `Error resetPassword ${e}`);
      throw ApiError.InternalServerError('Error resetPassword', e);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenData = this.tokenPublicService.validateAccessToken(dto.token);
    const tokenFromDb = await this.tokenPublicService.findResetToken(dto.token);

    if (!tokenData || !tokenFromDb) {
      throw new BadRequestException('User is not auth');
    }

    const user = await this.userPublicService.findByEmail(tokenData.payload.email);
    if (!user) {
      throw new BadRequestException('User is not auth');
    }

    try {
      const hashPassword = await bcrypt.hash(dto.newPassword, 10);

      await this.userPublicService.updatePassword(user.id, hashPassword);
      return { message: 'Reset password successfully' };
    } catch (e) {
      this.logger.error(
        { service: 'AuthService', method: 'resetPassword', error: e },
        `Error resetPasswordCheck`,
      );
      throw ApiError.InternalServerError('Error resetPasswordCheck', e);
    }
  }

  // Helper functions
  private async checkUserExists(email: string, username: string) {
    this.logger.log({ service: 'AuthService', method: 'chechUserExists', email, username });

    const [candidateEmail, candidateUsername] = await Promise.all([
      this.userPublicService.findByEmail(email),
      this.userPublicService.findByUsername(username),
    ]);

    if (candidateEmail) {
      this.logger.warn(
        { service: 'AuthService', method: 'checkUserExists' },
        `User with email ${email} already exists.`,
      );
      throw new ConflictException('User with this email already exists');
    }

    if (candidateUsername) {
      this.logger.warn(
        { service: 'AuthService', method: 'checkUserExists' },
        `User with username ${username} already exists.`,
      );
      throw new ConflictException('User with this username already exists');
    }

    this.logger.log(`No conflicts found for email and username, proceeding...`, {
      service: 'AuthService',
    });
  }

  private async generateAndSaveTokens(userDto: RegUserDto) {
    const tokens = this.tokenPublicService.generateTokens({ ...userDto });
    await this.tokenPublicService.saveToken(userDto.id, tokens.refreshToken, tokens.accessToken);
    return tokens;
  }
}
