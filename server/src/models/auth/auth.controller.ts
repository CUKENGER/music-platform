import { Body, Controller, Get, Next, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from 'models/user/dto/loginUser.dto';
import { UserDto } from 'models/user/dto/user.dto';
import { ResetPasswordDto, SendEmailDto } from './dto/resetPassword.dto';

class TokenResponse {
  @ApiProperty()
  token: string;
}

export interface ReqWithCookie extends Request {
  cookies: any;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Вход пользователя' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, type: TokenResponse })
  @Post('/login')
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const userData = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, userData.refreshToken);
    return res.json(userData);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, type: TokenResponse })
  @Post('/registration')
  async registration(@Body() dto: UserDto, @Res() res: Response, @Next() next) {
    try {
      const userData = await this.authService.registration(dto);
      this.setRefreshTokenCookie(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
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
      return res.redirect(`${process.env.CLIENT_URL}/`);
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
      this.setRefreshTokenCookie(res, tokenData.refreshToken);
      return res.json(tokenData);
    } catch (e) {
      next(e);
    }
  }

  @ApiOperation({ summary: 'Смена пароля' })
  @Post('/send_email')
  async resetPassword(@Body() dto: SendEmailDto) {
    return await this.authService.sendEmail(dto);
  }

  @ApiOperation({ summary: 'Активация пользователя' })
  @Post('/reset_password')
  async resetPasswordCheck(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'Password reset successful' };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
}
