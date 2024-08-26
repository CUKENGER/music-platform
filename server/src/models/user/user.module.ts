import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from 'models/auth/auth.module';
import { RoleService } from 'models/role/role.service';
import { RoleModule } from 'models/role/role.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController, ],
  providers: [UserService, PrismaService, RoleService],
  imports: [
    RoleModule,
    JwtModule,
    forwardRef(() => AuthModule),
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
