import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { User } from './user.model';
import { Roles } from 'src/auth/rolesAuth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRoleDto } from 'src/auth/dto/addRole.dto';
import { BanUserDto } from 'src/auth/dto/banUser.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Users')
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, type: User })
  @Post()
  create(@Body() dto: UserDto) {
    return this.authService.registration(dto)
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.userService.getAll()
  }

  @ApiOperation({ summary: 'Поиск пользователя по никнейму' })
  @ApiResponse({ status: 200, type: User })
  @Get('/search/:username')
  search(@Param() username: string) {
    return this.userService.search(username)
  }

  @ApiOperation({ summary: 'Выдать роль' })
  @ApiBody({ type: AddRoleDto })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto)
  }

  @ApiOperation({ summary: 'Забанить пользователя'})
  @ApiBody({ type: BanUserDto })
  @ApiResponse({ status: 200 })
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post('/ban')
  ban(@Body() dto: BanUserDto,) {
    return this.userService.ban(dto)
  }

  @ApiOperation({ summary: 'Проверка никнейма' })
  @ApiResponse({ status: 200})
  @Get('/checkUsername')
  async checkUsername(@Query('username') username: string): Promise<{ available: boolean }> {
    const isAvailable = await this.userService.checkUsername(username);
    return { available: isAvailable };
  }

}
