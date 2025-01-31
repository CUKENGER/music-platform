import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RolePublicService } from './rolePublic.service';
import { RoleRepository } from './role.repository';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RolePublicService, RoleRepository],
  imports: [],
  exports: [RolePublicService],
})
export class RoleModule {}
