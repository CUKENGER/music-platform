import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRoleRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: number, roleId: number) {
    return await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }
}
