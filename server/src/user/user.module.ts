import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { UserRole } from 'src/role/userRole.model';
import { Role } from 'src/role/role.model';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    RoleModule,
    forwardRef(() => AuthModule),
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
