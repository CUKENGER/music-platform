import { Body, Controller, Get, Next, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from 'src/user/dto/loginUser.dto';

class TokenResponse {
  @ApiProperty()
  token: string;
}

export interface ReqWithCookie extends Request{
  cookies: any
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, type: TokenResponse})
  @Post('/login')
  async login(@Body() dto: LoginUserDto, @Res() res: Response, @Next() next) {
    try{
      const userData = await this.authService.login(dto)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch(e) {
      next(e);
    }
  }


  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, type: TokenResponse})
  @Post('/registration')
  async registration(@Body() dto: UserDto, @Res() res: Response, @Next() next) {
    try {
      const userData = await this.authService.registration(dto)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    } catch(e) {
      next(e);
    }
    
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @Post('/logout')
  async logout(@Req() req: ReqWithCookie, @Res() res: Response, @Next() next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await this.authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  @ApiOperation({ summary: 'Активация пользователя' })
  @Get('/activate/:link')
  async activate(@Param('link') activationLink: string, @Res() res: Response, @Next() next) {
    try {
      await this.authService.activate(activationLink);
      return res.redirect(`${process.env.CLIENT_URL}/activate/${activationLink}`);
    } catch (e) {
      next(e);
    }
  }

  @ApiOperation({ summary: 'Обновление токена доступа' })
  @Get('/refresh')
  async refresh(@Req() req: ReqWithCookie, @Res() res: Response, @Next() next) {
    try {
      const { refreshToken } = req.cookies;
      const tokenData = await this.authService.refresh(refreshToken);

      res.cookie('refreshToken', tokenData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(tokenData);
    } catch (e) {
      next(e);
    }
  }

}
