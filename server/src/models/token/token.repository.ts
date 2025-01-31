import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: number) {
    return await this.prisma.token.findFirst({ where: { userId } });
  }

  async update(tokenId: number, refreshToken: string, accessToken: string) {
    return await this.prisma.token.update({
      where: { id: tokenId },
      data: { refreshToken, accessToken },
    });
  }

  async create(userId: number, refreshToken: string, accessToken: string) {
    return await this.prisma.token.create({
      data: { userId, refreshToken, accessToken },
    });
  }

  async findByRefresh(refreshToken: string) {
    return await this.prisma.token.findUnique({ where: { refreshToken } });
  }

  async delete(tokenId: number) {
    return await this.prisma.token.delete({ where: { id: tokenId } });
  }

  async findByAccess(accessToken: string) {
    return await this.prisma.token.findFirst({ where: { accessToken } });
  }
}
