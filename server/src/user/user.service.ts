import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
// import { UserDto } from './dto/user.dto';
import { RoleService } from 'src/role/role.service';
import { AddRoleDto } from 'src/auth/dto/addRole.dto';
import { BanUserDto } from 'src/auth/dto/banUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService
  ) {}


  // async create(dto: UserDto) {
  //   const user = await this.userRepository.create(dto)
  //   const role = await this.roleService.getByValue("USER")
  //   user.roles = [role]
  //   await this.userRepository.save(user)
  //   return user
  // }

  async registration(email: string, password: string, activationLink: string, username: string) {
    const user = await this.userRepository.create({email: email, password: password, activationLink: activationLink, username: username})
    const role = await this.roleService.getByValue("USER")
    user.roles = [role]
    await this.userRepository.save(user)
    return user
  }

  async getAll() {
    const users =  await this.userRepository.find({relations: ['roles']})
    return users
  }

  async search(username) {
    const user = await this.userRepository.find({where: {username: username}, relations: ['roles']})
    return user
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({where: {email}, relations: ['roles']})
    return user 
  }

  async getByUsername(username: string) {
    const user = await this.userRepository.findOne({where: {username}, relations: ['roles']})
    return user 
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findOne({where: {id: dto.userId}, relations: ['roles']})
    const role = await this.roleService.getByValue(dto.value)
    if(role && user) {
      user.roles.push(role);
      await this.userRepository.save(user);
      return dto;
    }
    throw new  HttpException('User or role not found', HttpStatus.NOT_FOUND)
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    
    await this.userRepository.save(user);
    return user;
  }

  async checkUsername (username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return !user;
  }


}
