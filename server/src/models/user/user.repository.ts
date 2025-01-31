import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
  }

  async create(
    dto: UserDto,
    password: string,
    activationLink: string,
    activationExpiresAt: Date,
    roleId: number,
    prisma: Prisma.TransactionClient,
  ) {
    return await prisma.user.create({
      data: {
        ...dto,
        password,
        activationLink,
        activationExpiresAt,
        isActivated: false,
        roles: {
          create: {
            role: {
              connect: { id: roleId },
            },
          },
        },
      },
    });
  }

  async findMany() {
    return await this.prisma.user.findMany({
      include: {
        roles: true,
        likedAlbums: true,
        likedArtists: true,
        likedTracks: true,
        listenedTracks: true,
      },
    });
  }

  async search(username: string) {
    await this.prisma.user.findMany({
      where: {
        username,
      },
      include: {
        roles: true,
      },
    });
  }

  async getByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: true,
        likedAlbums: true,
        likedArtists: true,
        likedTracks: true,
        listenedTracks: true,
      },
    });
  }

  async ban(userId: number, banReason: string, prisma: Prisma.TransactionClient) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        banReason,
      },
    });
  }

  async deleteExpired() {
    return await this.prisma.user.deleteMany({
      where: {
        isActivated: false,
        activationExpiresAt: { lt: new Date() },
      },
    });
  }

  async updatePassword(userId: number, password: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async findByActivationLink(activationLink: string) {
    return await this.prisma.user.findFirst({
      where: { activationLink },
    });
  }

  async activate(userId: number) {
    return await this.prisma.user.update({
      where: {id: userId},
      data: {isActivated: true},
    })
  }

  async findByAccessToken(accessToken: string) {
    return await this.prisma.user.findFirst({
      where: {
        tokens: {
          some: {
            accessToken
          }
        }
      }
    })
  }
}
