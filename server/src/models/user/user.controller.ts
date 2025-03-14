import { Body, Controller, Get, Param, Post, Headers,  UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { BanUserDto } from 'models/auth/dto/banUser.dto';
import { RolesGuard } from 'models/auth/roles.guard';
import { Roles } from 'models/auth/rolesAuth.decorator';
import { AddRoleDto } from 'models/auth/dto/addRole.dto';
import { AuthService } from 'models/auth/auth.service';
import { ApiHeader } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiBody({ type: UserDto })
  @Post()
  create(@Body() dto: UserDto) {
    console.log('dto', dto)
    return this.authService.registration(dto)
  }


  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @Get('/byToken')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer токен',
    required: true,
  })
  getByToken(@Headers('Authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.userService.getByToken(token)
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.userService.getAll()
  }

  @ApiOperation({ summary: 'Получение пользователя по id' })
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.userService.getOne(id)
  }

  @ApiOperation({ summary: 'Поиск пользователя по никнейму' })
  @Get('/search/:username')
  search(@Param() username: string) {
    return this.userService.search(username)
  }

  @ApiOperation({ summary: 'Выдать роль' })
  @ApiBody({ type: AddRoleDto })
  @ApiResponse({ status: 200 })
  // @Roles("ADMIN")
  // @UseGuards(RolesGuard)
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
  @Post('/check/:username')
  async checkUsername(@Param('username') username: string): Promise<{ available: boolean }> {
    const isAvailable = await this.userService.checkUsername(username);
    return { available: isAvailable };
  }

}
