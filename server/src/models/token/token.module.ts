import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';
import { TokenPublicService } from './tokenPublic.service';

@Module({
  providers: [
    JwtService, 
    TokenRepository,
    TokenPublicService,
  ],
  controllers: [],
  imports: [
    JwtModule
  ],
  exports: [
    TokenPublicService
  ],
})
export class TokenModule {}
