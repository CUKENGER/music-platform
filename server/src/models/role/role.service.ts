import { Injectable } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: RoleDto) {
    const role = await this.prisma.role.create({
      data: {
        value: dto.value,
        description: dto.description,
      },
    });
    return role;
  }

  async getAll() {
    const roles = await this.prisma.role.findMany({
      include: { userRoles: true }, // Если у роли есть связь с пользователями
    });
    return roles;
  }

  async getByValue(value: string) {
    const role = await this.prisma.role.findUnique({
      where: { value: value },
      include: { userRoles: true }, // Если у роли есть связь с пользователями
    });
    return role;
  }
}
