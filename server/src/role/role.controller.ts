import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './role.model';
import { Roles } from 'src/auth/rolesAuth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Roles')
@Controller('role')
export class RoleController {

  constructor (private roleService: RoleService) {}

  @ApiOperation({summary: "Создание роли для пользователя"})
  @ApiResponse({status: 200, type: Role})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() dto: RoleDto) {
    return this.roleService.create(dto)
  }

  @ApiOperation({summary: "Получение всех ролей"})
  @ApiResponse({status: 200, type: [Role]})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    return this.roleService.getAll()
  }

  @ApiOperation({summary: "Получение роли по значению"})
  @ApiResponse({status: 200, type: Role})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get('/:value')
  async getByValue(@Param('value') value: string) {
    return this.roleService.getByValue(value)
  }

}
