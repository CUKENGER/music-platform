import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { TokenService } from '../token/token.service';
import { MailService } from './mail.service';
import { RegUserDto } from 'models/user/dto/regUser.dto';
import { UserService } from 'models/user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { LoginUserDto } from 'models/user/dto/loginUser.dto';
import { UserDto } from 'models/user/dto/user.dto';
import { ApiError } from 'exceptions/api.error';

export interface RegUserResponse {
  accessToken: string;
  refreshToken: string;
  user: RegUserDto;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailService: MailService,
    private prisma: PrismaService
  ) {}

  async login(dto: LoginUserDto): Promise<RegUserResponse> {
    const user = await this.getUserByEmail(dto.email);
    await this.verifyPassword(dto.password, user.password);

    const userDto = new RegUserDto(user);
    const tokens = await this.generateAndSaveTokens(userDto, this.prisma);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async registration(dto: UserDto): Promise<RegUserResponse> {
    try {
      return await this.prisma.$transaction(async (prisma: PrismaService) => {
        await this.checkUserExists(dto.email, dto.username);
  
        const hashPassword = await bcrypt.hash(dto.password, 10);
        const activationLink = uuid.v4();
  
        let user;
        if (dto.username === 'admin') {
          user = await this.createAdmin(prisma, dto, hashPassword, activationLink);
        } else {
          user = await this.createUser(prisma, dto, hashPassword, activationLink);
        }
  
        await this.mailService.sendActivationMail(dto.email, `${process.env.API_URL}/auth/activate/${activationLink}`);
  
        const userDto = new RegUserDto(user);
        const tokens = await this.generateAndSaveTokens(userDto, prisma);
  
        return {
          ...tokens,
          user: userDto,
        };
      });
    } catch (error) {
      console.error('Error during registration:', error);
      throw new BadRequestException('Registration failed');
    }
  }
  

  async logout(refreshToken: string) {
    try {
      return await this.tokenService.removeToken(refreshToken);
    } catch(e) {
      throw new InternalServerErrorException(`Error logout: ${e}`)
    }
  }

  async activate(activationLink: string): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { activationLink } });
    if (!user) {
      throw new BadRequestException('Invalid activation link');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
  }

  async refresh(refreshToken: string): Promise<RegUserResponse> {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const tokenData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await this.prisma.user.findUnique({ where: { id: tokenData.id } });
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = new RegUserDto(user);
    const tokens = await this.generateAndSaveTokens(userDto, this.prisma);

    return {
      ...tokens,
      user: userDto,
    };
  }

  // Helper functions

  private async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User with this email not found');
    }
    return user;
  }

  private async verifyPassword(inputPassword: string, storedPassword: string) {
    const isPassEquals = await bcrypt.compare(inputPassword, storedPassword);
    if (!isPassEquals) {
      throw new BadRequestException('Incorrect password');
    }
  }

  private async checkUserExists(email: string, username: string) {
    const candidateEmail = await this.userService.getByEmail(email);
    if (candidateEmail) {
      throw new BadRequestException("User with this email already exists");
    }

    const candidateUsername = await this.userService.getByUsername(username);
    if (candidateUsername) {
      throw new BadRequestException("User with this username already exists");
    }
  }

  private async createUser(prisma: PrismaService, dto: UserDto, hashPassword: string, activationLink: string) {
    try {
      let role = await prisma.role.findUnique({ where: { value: "USER" } });
  
      if (!role) {
        role = await prisma.role.create({
          data: { value: "USER", description: "Default user role" },
        });
      }
  
      return await prisma.user.create({
        data: {
          email: dto.email,
          password: hashPassword,
          activationLink,
          username: dto.username,
          isActivated: false,
          roles: {
            create: {
              role: {
                connect: { id: role.id },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  private async createAdmin(prisma: PrismaService, dto: UserDto, hashPassword: string, activationLink: string) {
    try {
      let adminRole = await prisma.role.findUnique({ where: { value: "ADMIN" } });
  
      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: { value: "ADMIN", description: "Admin role" },
        });
      }
  
      return await prisma.user.create({
        data: {
          email: dto.email,
          password: hashPassword,
          activationLink,
          username: dto.username,
          isActivated: false,
          roles: {
            create: {
              role: {
                connect: { id: adminRole.id },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      throw new BadRequestException('Failed to create admin');
    }
  }

  private async generateAndSaveTokens(userDto: RegUserDto, prisma) {
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken, tokens.accessToken, prisma);
    return tokens;
  }
}
