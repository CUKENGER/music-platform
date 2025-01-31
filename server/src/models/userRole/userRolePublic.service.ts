import { Injectable } from "@nestjs/common";
import { UserRoleRepository } from "./userRole.repository";


@Injectable()
export class UserRolePublicService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async create(userId: number, roleId: number) {
    return await this.userRoleRepository.create(userId, roleId);
  }
}
