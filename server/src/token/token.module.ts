import { Module } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.model';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TokenService, JwtService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([Token]),
    ConfigModule
  ],
  exports: [TokenService]
})
export class TokenModule {}
