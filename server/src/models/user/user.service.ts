import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiError } from 'exceptions/api.error';
import { AddRoleDto } from 'models/auth/dto/addRole.dto';
import { BanUserDto } from 'models/auth/dto/banUser.dto';
import { RoleService } from 'models/role/role.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService,
    private jwtService: JwtService,
  ) {}

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
      console.error(`Error getAll users: ${e}`);
      throw new InternalServerErrorException('Error getAll users');
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
      console.error(`Error search users: ${e}`);
      throw new InternalServerErrorException('Error search users');
    }
  }

  async getByEmail(email: string) {
    try {
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
      return user;
    } catch (e) {
      console.error(`Error getByEmail user: ${e}`);
      throw new InternalServerErrorException('Error getByEmail user');
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
      console.error(`Ошибка при поиске пользователя: ${error.message}`);

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
      console.error(`Ошибка при блокировке пользователя: ${error.message}`);
      throw new InternalServerErrorException('Ошибка при блокировке пользователя');
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return !user;
  }
}
