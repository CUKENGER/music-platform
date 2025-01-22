import { Module } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [TokenService, JwtService, PrismaService],
  controllers: [],
  imports: [JwtModule],
  exports: [TokenService],
})
export class TokenModule {}
