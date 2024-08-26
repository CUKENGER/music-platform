import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Token } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class TokenService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  generateTokens (payload) {
    const accessToken = this.jwtService.sign(payload, {secret: process.env.JWT_ACCESS_SECRET_KEY})
    const refreshToken = this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET_KEY})
    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token) {
    try {
      const tokenData = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET_KEY})
      return tokenData
    } catch(e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const tokenData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET_KEY})
      return tokenData  
    } catch(e) {
      return null
    }
  }

  async saveToken(
    userId: string, 
    refreshToken: string, 
    accessToken: string, 
    prisma: PrismaService
  ): Promise<Token> {
    // Начинаем транзакцию
    return await prisma.$transaction(async (tx) => {
      // Ищем существующий токен по userId
      const tokenData = await tx.token.findFirst({ where: { userId } });
      
      if (tokenData) {
        // Обновляем существующий токен
        return await tx.token.update({
          where: { id: tokenData.id }, // Используем id для обновления
          data: {
            refreshToken,
            accessToken,
          },
        });
      } else {
        // Создаем новый токен
        return await tx.token.create({
          data: {
            userId,
            refreshToken,
            accessToken,
          },
        });
      }
    });
  }

  async removeToken(refreshToken) {
    try {
      const tokenData = await this.prisma.token.delete({ where: { refreshToken } });
      return tokenData
    } catch(e) {
      console.log('Error with removeToken', e)
    }
  }

  async findToken(refreshToken) {
    try {
      const tokenData = await this.prisma.token.findUnique({where: {refreshToken}})
      console.log('findToken tokenData', tokenData);
      return tokenData
    } catch(e) {
      console.log('Error with findToken', e)
    }
  }
}