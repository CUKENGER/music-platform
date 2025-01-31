import { Injectable } from "@nestjs/common";
import { RoleRepository } from "./role.repository";
import { Prisma } from "@prisma/client";

@Injectable()
export class RolePublicService {
  constructor(
		private readonly roleRepository: RoleRepository,
	) {}

	async findByValue(value: string, prisma: Prisma.TransactionClient) {
		return await this.roleRepository.findByValue(value, prisma)
	}

  async create(data: Prisma.RoleCreateInput, prisma: Prisma.TransactionClient) {
    return await this.roleRepository.create(data, prisma);
  }
}











































