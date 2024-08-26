import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from '../token/token.service';
import { MailService } from './mail.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserModule } from 'models/user/user.module';
import { UserService } from 'models/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'models/role/role.module';

@Module({
  providers: [
    AuthService, 
    TokenService, 
    MailService, 
    PrismaService,
    UserService,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule,
    RoleModule,
    forwardRef(() => UserModule)
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}
