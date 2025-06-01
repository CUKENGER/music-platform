import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ApiError } from 'exceptions/api.error';
import { ERROR_CODES } from 'constants/errorCodes';

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
      throw ApiError.InternalServerError('Error creating role', ERROR_CODES.INTERNAL_SERVER_ERROR, [
        error,
      ]);
    }
  }

  async getAll() {
    try {
      const roles = await this.prisma.role.findMany({
        include: { userRoles: true },
      });
      return roles;
    } catch (error) {
      throw ApiError.InternalServerError(
        'Error retrieving roles',
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        [error],
      );
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
