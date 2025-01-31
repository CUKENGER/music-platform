import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from './mail.service';
import { UserModule } from 'models/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from 'models/role/role.module';
import { PasswordService } from './password.service';
import { TokenModule } from 'models/token/token.module';

@Module({
  providers: [
    AuthService, 
    MailService, 
    PasswordService,
  ],
  controllers: [
    AuthController
  ],
  imports: [
    JwtModule, 
    RoleModule, 
    UserModule,
    TokenModule,
    // forwardRef(() => UserModule)
  ],
  exports: [
    AuthService
  ],
})
export class AuthModule {}
