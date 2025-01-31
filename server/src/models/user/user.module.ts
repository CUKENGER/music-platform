import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'models/auth/auth.module';
import { RoleModule } from 'models/role/role.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserPublicService } from './userPublic.service';
import { UserRoleModule } from 'models/userRole/userRole.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService, 
    UserPublicService, 
    UserRepository
  ],
  imports: [
    RoleModule, 
    JwtModule, 
    forwardRef(() => AuthModule),
    UserRoleModule,
  ],
  exports: [UserPublicService],
})
export class UserModule {}
