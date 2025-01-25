import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@prisma/client';
import { ApiError } from 'exceptions/api.error';
import { RegUserDto } from 'models/user/dto/regUser.dto';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'prisma/prisma.service';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  payload: RegUserDto;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) { }

  generateTokens(payload: RegUserDto): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET_KEY,
    });
    this.logger.log('accessToken env', { process: process.env.JWT_ACCESS_SECRET_KEY });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
    });
    this.logger.log('refreshToken env', { process: process.env.JWT_REFRESH_SECRET_KEY });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): TokenData | null {
    try {
      const tokenData = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
      });
      return tokenData;
    } catch (e) {
      this.logger.warn(`TokenService validateAccessToken: invalid token`, { error: e });
      return null;
    }
  }

  validateRefreshToken(token: string): TokenData | null {
    const tokenData = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET_KEY });
    if (!tokenData) {
      throw ApiError.UnauthorizedError();
    }
    return null;
  }

  async saveToken(userId: number, refreshToken: string, accessToken: string): Promise<Token> {
    try {
      const tokenData = await this.prisma.token.findFirst({ where: { userId } });

      this.logger.log(`tokenService.saveToken: tokenData = `, tokenData);

      if (tokenData) {
        this.logger.log(`tokenService.saveToken: tokenData already exist, updating...`);
        return await this.prisma.token.update({
          where: { id: tokenData.id },
          data: { refreshToken, accessToken },
        });
      } else {
        this.logger.log(`tokenService.saveToken: tokenData not exist, creating...`);
        const newTokenData = await this.prisma.token.create({
          data: { userId, refreshToken, accessToken },
        });
        this.logger.log(`tokenService saveToken newTokendData`, { newTokenData: newTokenData });
        return newTokenData;
      }
    } catch (e) {
      this.logger.error(`Error saving token: ${e.message} `);
      throw ApiError.InternalServerError('Error saving token', [e]);
    }
  }

  async removeToken(refreshToken: string): Promise<Token | null> {
    try {
      const token = await this.prisma.token.findUnique({
        where: { refreshToken },
      });

      if (!token) {
        this.logger.warn('Token not found, nothing to delete');
        return null;
      }

      return await this.prisma.token.delete({
        where: { refreshToken },
      });
    } catch (error) {
      this.logger.error('Error removing token:', error);
      throw new Error('Failed to remove token');
    }
  }

  async findToken(refreshToken: string): Promise<Token | null> {
    try {
      return await this.prisma.token.findUnique({ where: { refreshToken } });
    } catch (e) {
      this.logger.error(`Error finding token: ${e.message} `);
      throw new InternalServerErrorException('Error finding token');
    }
  }

  async findResetToken(accessToken: string): Promise<Token | null> {
    try {
      return await this.prisma.token.findFirst({ where: { accessToken } });
    } catch (e) {
      this.logger.error(`Error finding token: ${e.message} `);
      throw new InternalServerErrorException('Error finding token');
    }
  }
}
