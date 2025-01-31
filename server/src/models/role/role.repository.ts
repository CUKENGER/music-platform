import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable() 
export class RoleRepository {
  constructor() {}

	async findByValue(value: string, prisma: Prisma.TransactionClient) {
		return await prisma.role.findUnique({ where: {value}})
	}

  async create(data: Prisma.RoleCreateInput, prisma: Prisma.TransactionClient) {
    return await prisma.role.create({ data })
  }
}














