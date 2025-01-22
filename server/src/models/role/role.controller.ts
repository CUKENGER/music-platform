import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'models/auth/rolesAuth.decorator';
import { RolesGuard } from 'models/auth/roles.guard';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'Создание роли для пользователя' })
  // @Roles("ADMIN")
  // @UseGuards(RolesGuard)
  @Post()
  async create(@Body() dto: RoleDto) {
    return this.roleService.create(dto);
  }

  @ApiOperation({ summary: 'Получение всех ролей' })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  async getAll() {
    return this.roleService.getAll();
  }

  @ApiOperation({ summary: 'Получение роли по значению' })
  // @Roles("ADMIN")
  // @UseGuards(RolesGuard)
  @Get('/:value')
  async getByValue(@Param('value') value: string) {
    return this.roleService.getByValue(value);
  }
}
