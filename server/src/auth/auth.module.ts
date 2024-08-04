import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/token/token.model';
import { User } from 'src/user/user.model';

@Module({
  providers: [AuthService, TokenService, MailService],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: "24h"
      }
    })
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
