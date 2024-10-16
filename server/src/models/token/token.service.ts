import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Token } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TokenService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  generateTokens(payload: any): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET_KEY });
    const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET_KEY });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): any | null {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET_KEY });
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): any | null {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET_KEY });
    } catch (e) {
      return null;
    }
  }

  async saveToken(
    userId: number, 
    refreshToken: string, 
    accessToken: string, 
    prisma: PrismaService
  ): Promise<Token> {
    try {
      const tokenData = await prisma.token.findFirst({ where: { userId } });
  
      if (tokenData) {
        return await prisma.token.update({
          where: { id: tokenData.id },
          data: { refreshToken, accessToken },
        });
      } else {
        return await prisma.token.create({
          data: { userId, refreshToken, accessToken },
        });
      }
    } catch (e) {
      console.error(`Error saving token: ${e.message}`);
      throw new InternalServerErrorException('Error saving token');
    }
  }

  async removeToken(refreshToken: string): Promise<Token | null> {
    try {
      const token = await this.prisma.token.findUnique({
        where: { refreshToken },
      });
  
      if (!token) {
        console.warn('Token not found, nothing to delete');
        return null;
      }
  
      return await this.prisma.token.delete({
        where: { refreshToken },
      });
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove token');
    }
  }

  async findToken(refreshToken: string): Promise<Token | null> {
    try {
      return await this.prisma.token.findUnique({ where: { refreshToken } });
    } catch (e) {
      console.error(`Error finding token: ${e.message}`);
      throw new InternalServerErrorException('Error finding token');
    }
  }

  async findResetToken(accessToken: string): Promise<Token | null> {
    try {
      return await this.prisma.token.findFirst({ where: { accessToken } });
    } catch (e) {
      console.error(`Error finding token: ${e.message}`);
      throw new InternalServerErrorException('Error finding token');
    }
  }
}
