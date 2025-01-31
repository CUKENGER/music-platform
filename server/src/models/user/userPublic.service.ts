import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiError } from 'exceptions/api.error';
import { Logger } from 'nestjs-pino';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { RolePublicService } from 'models/role/rolePublic.service';

@Injectable()
export class UserPublicService {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly rolePublicService: RolePublicService,
  ) {}

  async getByToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
      });
      this.logger.log('UserPublicService getByToken payload', payload);
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      return user;
    } catch (error) {
      this.logger.error('Ошибка при поиске пользователя', error);
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        throw ApiError.UnauthorizedError();
      }
      throw ApiError.InternalServerError(`Ошибка при поиске пользователя`, error);
    }
  }

  async getByEmail(email: string) {
    try {
      this.logger.log('UserService getByEmail', {
        service: 'UserService',
        method: 'getByEmail',
        email: email,
      });
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        this.logger.error('UserService getByEmail User with this email not found', {
          email: email,
        });
        throw ApiError.BadRequest(`User with this email not found`);
      }
      return user;
    } catch (e) {
      this.logger.error(`UserService getByEmail error`, { error: e });
      throw ApiError.InternalServerError(`UserService getByEmail error`, e);
    }
  }

  async createUserWithRole(
    prisma: Prisma.TransactionClient,
    dto: UserDto,
    roleValue: string,
    roleDescription: string,
    hashPassword: string,
    activationLink: string,
    activationExpiresAt: Date,
  ) {
    const DEFAULT_ROLE_DESCRIPTION = 'description not specified';
    let existingRole = await this.rolePublicService.findByValue(roleValue, prisma);
    this.logger.log(
      { service: 'UserService', method: 'createUser', roleValue: roleValue },
      `find role:`,
    );
    if (!existingRole) {
      this.logger.log(
        { service: 'UserService', method: 'createUser' },
        `role not found, create...`,
      );

      const description =
        roleDescription.trim() === '' ? DEFAULT_ROLE_DESCRIPTION : roleDescription;
      existingRole = await this.rolePublicService.create({ value: roleValue, description }, prisma);
    }

    await this.userRepository.create(
      dto,
      hashPassword,
      activationLink,
      activationExpiresAt,
      existingRole.id,
      prisma,
    );
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string) {
    return await this.userRepository.getByUsername(username);
  }

  async updatePassword(userId: number, password: string) {
    return await this.userRepository.updatePassword(userId, password);
  }

  async getById(userId: number) {
    return await this.userRepository.findById(userId);
  }

  async findByActivationLink(activationLink: string) {
    return await this.userRepository.findByActivationLink(activationLink);
  }

  async activate(userId: number) {
    return await this.userRepository.activate(userId);
  }

  async deleteExpiredUsers(): Promise<number> {
    const result = await this.userRepository.deleteExpired();
    return result.count;
  }
}
