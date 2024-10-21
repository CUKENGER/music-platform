import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: RoleDto) {
    try {
      const role = await this.prisma.role.create({
        data: {
          value: dto.value,
          description: dto.description,
        },
      });
      return role;
    } catch (error) {
      throw new InternalServerErrorException('Error creating role');
    }
  }

  async getAll() {
    try {
      const roles = await this.prisma.role.findMany({
        include: { userRoles: true },
      });
      return roles;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving roles');
    }
  }

  async getByValue(value: string) {
    const role = await this.prisma.role.findUnique({
      where: { value },
      include: {
        userRoles: true,
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
