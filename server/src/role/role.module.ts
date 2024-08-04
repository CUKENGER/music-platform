import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './role.model';
import { User } from 'src/user/user.model';
import { UserRole } from './userRole.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RoleController],
  providers: [RoleService, JwtService],
  imports: [
    TypeOrmModule.forFeature([Role, User, UserRole]),
  ],
  exports: [
    RoleService
  ]
})
export class RoleModule {}
