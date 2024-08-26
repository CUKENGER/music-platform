import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddRoleDto } from 'models/auth/dto/addRole.dto';
import { BanUserDto } from 'models/auth/dto/banUser.dto';
import { RoleService } from 'models/role/role.service';
// import { UserDto } from './dto/user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
    private roleService: RoleService
  ) {}


  // async create(dto: UserDto) {
  //   const user = await this.userRepository.create(dto)
  //   const role = await this.roleService.getByValue("USER")
  //   user.roles = [role]
  //   await this.userRepository.save(user)
  //   return user
  // }

  async registration(
    email: string,
    password: string,
    activationLink: string,
    username: string,
) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password,
          activationLink,
          username,
        },
      });

      const role = await this.roleService.getByValue('USER');
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      return user;
    } catch (e) {
      console.error('Error in registration userService', e);
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll() {
    return this.prisma.user.findMany({
      include: {
        roles: true,
      },
    });
  }

  async search(username: string) {
    return this.prisma.user.findMany({
      where: {
        username,
      },
      include: {
        roles: true,
      },
    });
  }

  async getByEmail(email: string){
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });
  }

  async getByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        roles: true,
      },
    });
  }

  async addRole(dto: AddRoleDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      },
    });

    const role = await this.roleService.getByValue(dto.value);

    if (user && role) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    } else {
      throw new HttpException('User or role not found', HttpStatus.NOT_FOUND);
    }
  }

  async ban(dto: BanUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        banned: true,
        banReason: dto.banReason,
      },
    });
  }

  async checkUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return !user;
  }
}

