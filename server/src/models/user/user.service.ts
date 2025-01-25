import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiError } from 'exceptions/api.error';
import { AddRoleDto } from 'models/auth/dto/addRole.dto';
import { BanUserDto } from 'models/auth/dto/banUser.dto';
import { RoleService } from 'models/role/role.service';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) { }

  async getAll() {
    try {
      const users = this.prisma.user.findMany({
        include: {
          roles: true,
          likedAlbums: true,
          likedArtists: true,
          likedTracks: true,
          listenedTracks: true,
          tokens: true,
        },
      });
      return users;
    } catch (e) {
      this.logger.error(`Error getAll users: ${e}`);
      throw ApiError.InternalServerError('Error getAll users', [e]);
    }
  }

  async search(username: string) {
    try {
      const users = this.prisma.user.findMany({
        where: {
          username,
        },
        include: {
          roles: true,
        },
      });
      return users;
    } catch (e) {
      this.logger.error(`Error search users: ${e}`);
      throw ApiError.InternalServerError('Error search users', [e]);
    }
  }

  async getByEmail(email: string) {
    try {
      this.logger.log('UserService getByEmail', {
        service: 'UserService',
        method: 'getByEmail',
        email: email,
      });
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          roles: true,
          likedAlbums: true,
          likedArtists: true,
          likedTracks: true,
          listenedTracks: true,
          tokens: true,
        },
      });
      if (!user) {
        this.logger.error('UserService getByEmail User with this email not found', {
          email: email,
        });
        throw ApiError.BadRequest(`User with this email not found`);
      }
      return user;
    } catch (e) {
      this.logger.error(`UserService getByEmail error`, { e: e });
      if (e instanceof ApiError) {
        throw e;
      } else {
        throw new Error(`Unexpected error: ${e.message}`);
      }
    }
  }

  async getOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        roles: true,
        likedAlbums: true,
        likedArtists: true,
        likedTracks: true,
        listenedTracks: true,
        tokens: true,
      },
    });
  }

  async getByToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
      });
      const user = await this.prisma.user.findFirst({
        where: { id: payload.id },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          likedAlbums: true,
          likedArtists: true,
          likedTracks: true,
          listenedTracks: true,
          likedComments: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      return user;
    } catch (error) {
      this.logger.error(`Ошибка при поиске пользователя: ${error.message}`);

      if (error.name === 'TokenExpiredError') {
        throw ApiError.UnauthorizedError();
      }

      if (error.name === 'JsonWebTokenError') {
        throw ApiError.UnauthorizedError();
      }

      throw new InternalServerErrorException('Ошибка при поиске пользователя');
    }
  }

  async getByUsername(username: string) {
    try {
      return this.prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          roles: true,
          likedAlbums: true,
          likedArtists: true,
          likedTracks: true,
          listenedTracks: true,
          tokens: true,
        },
      });
    } catch (e) {
      this.logger.log(`Error: user with this username:${username} not found`, e.message);
    }
  }

  async addRole(dto: AddRoleDto): Promise<void> {
    const [user, role] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.userId } }),
      this.roleService.getByValue(dto.value),
    ]);

    if (!user || !role) {
      throw new NotFoundException('User or role not found');
    }

    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });
  }

  async ban(dto: BanUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.prisma.user.update({
        where: { id: user.id },
        data: { banned: true, banReason: dto.banReason },
      });
    } catch (error) {
      this.logger.error(`Ошибка при блокировке пользователя: ${error.message}`);
      throw new InternalServerErrorException('Ошибка при блокировке пользователя');
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    this.logger.log(`UserService: Checking username availability for "${username}"`);

    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      return !user;
    } catch (error) {
      this.logger.error(
        `UserService: Error checking username availability - ${error.message}`,
        error.stack,
      );
      throw error; 
    }
  }
  async deleteExpiredUsers(): Promise<number> {
    const result = await this.prisma.user.deleteMany({
      where: {
        isActivated: false,
        activationExpiresAt: { lt: new Date() },
      },
    });

    return result.count;
  }

  async createUserWithRole(
    prisma: PrismaService,
    dto: UserDto,
    roleValue: string,
    roleDescription: string,
    hashPassword: string,
    activationLink: string,
    activationExpiresAt: Date,
  ) {
    const DEFAULT_ROLE_DESCRIPTION = 'description not specified';
    let existingRole = await prisma.role.findUnique({ where: { value: roleValue } });

    this.logger.log(
      { service: 'UserService', method: 'createUser', roleValue: roleValue },
      `find role:`,
    );
    if (!existingRole) {
      this.logger.log(
        { service: 'UserService', method: 'createUser' },
        `role not found, create...`,
      );
      existingRole = await prisma.role.create({
        data: {
          value: roleValue,
          description: roleDescription.trim() === '' ? DEFAULT_ROLE_DESCRIPTION : roleDescription,
        },
      });
    }

    await prisma.user.create({
      data: {
        email: dto.email,
        password: hashPassword,
        activationLink,
        username: dto.username,
        isActivated: false,
        activationExpiresAt: activationExpiresAt,
        roles: {
          create: {
            role: {
              connect: { id: existingRole.id },
            },
          },
        },
      },
    });
  }
}
