import { Module } from "@nestjs/common";
import { UserRolePublicService } from "./userRolePublic.service";
import { UserRoleRepository } from "./userRole.repository";
 
@Module({
  controllers: [
  ],
  providers: [
    UserRolePublicService,
    UserRoleRepository,
  ],
  imports: [
  ],
  exports: [
    UserRolePublicService
  ],
})
export class UserRoleModule {}
