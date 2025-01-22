import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, JwtService, PrismaService],
  imports: [],
  exports: [RoleService],
})
export class RoleModule {}
