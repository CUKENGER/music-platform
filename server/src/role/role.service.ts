import { Injectable } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { Role } from './role.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role) 
    private roleRepository: Repository<Role> 
  ) {}

  async create(dto: RoleDto) {
    const role = await this.roleRepository.create(dto)
    return role
  }

  async getAll() {
    const roles = await this.roleRepository.find({relations: ['users']})
    return roles
  }

  async getByValue(value: string) {
    const role = await this.roleRepository.findOne({where: {value: value}, relations: ['users']})
    return role
  }

}
