import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ApiError } from 'exceptions/api.error';
import { AddRoleDto } from 'models/auth/dto/addRole.dto';
import { BanUserDto } from 'models/auth/dto/banUser.dto';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'prisma/prisma.service';
import { UserRepository } from './user.repository';
import { RolePublicService } from 'models/role/rolePublic.service';
import { UserRolePublicService } from 'models/userRole/userRolePublic.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolePublicService: RolePublicService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly userRolePublicService: UserRolePublicService,
  ) {}

  async getAll() {
    try {
      return await this.userRepository.findMany();
    } catch (e) {
      this.logger.error(`Error getAll users: ${e}`);
      throw ApiError.InternalServerError('Error getAll users', e);
    }
  }

  async search(username: string) {
    try {
      return await this.userRepository.search(username);
    } catch (e) {
      this.logger.error(`Error search users: ${e}`);
      throw ApiError.InternalServerError('Error search users', e);
    }
  }

  async getOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new HttpException(`User with id:${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getByToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
      });
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Ошибка при поиске пользователя: ${error.message} error.name ${error.name}`,
      );
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw ApiError.UnauthorizedError();
      }
      throw ApiError.InternalServerError('Ошибка при поиске пользователя', error);
    }
  }

  async getByUsername(username: string) {
    try {
      return await this.userRepository.getByUsername(username);
    } catch (e) {
      this.logger.log(`Error: user with this username:${username} not found`, e.message);
      throw ApiError.InternalServerError(`Error: user with this username:${username} not found`, e);
    }
  }

  async addRole(dto: AddRoleDto) {
    const [user, role] = await Promise.all([
      await this.userRepository.findById(dto.userId),
      await this.rolePublicService.findByValue(dto.value, this.prisma),
    ]);
    if (!user || !role) {
      throw new NotFoundException('User or role not found');
    }
    return await this.userRolePublicService.create(user.id, role.id);
  }

  async ban(dto: BanUserDto) {
    try {
      const user = await this.userRepository.findById(dto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.userRepository.ban(user.id, dto.banReason, this.prisma);
    } catch (error) {
      this.logger.error(`Ошибка при блокировке пользователя: ${error.message}`);
      throw ApiError.InternalServerError('Ошибка при блокировке пользователя', error);
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    this.logger.log(`UserService: Checking username availability for "${username}"`);
    try {
      const user = await this.userRepository.getByUsername(username);
      return !user;
    } catch (error) {
      this.logger.error(
        `UserService: Error checking username availability - ${error.message}`,
        error.stack,
      );
      throw ApiError.InternalServerError('Ошибка при проверке доступности никнейма', error);
    }
  }
}
