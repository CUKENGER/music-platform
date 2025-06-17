import { Body, Controller, Get, Next, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { LoginUserDto } from 'models/user/dto/loginUser.dto';
import { UserDto } from 'models/user/dto/user.dto';
import { ResetPasswordDto, SendEmailDto } from './dto/resetPassword.dto';
import { Logger } from 'nestjs-pino';
import { ERROR_CODES } from 'constants/errorCodes';

class TokenResponse {
  token: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Аутенфикация пользователя',
    description: 'Проверяет email и пароль, возвращает токены и данные пользователя.',
  })
  @ApiBody({
    description: 'Данные для аутенфикации',
    required: true,
    type: LoginUserDto,
    examples: {
      example1: {
        summary: 'Пример запроса',
        value: {
          email: 'email@gmail.com',
          password: 'Qwerty1234',
        },
      },
    },
  })
  @ApiResponse({
    description: 'Аутентификация прошла успешно',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ',
      user: {
        id: 1,
        email: 'email@gmail.com',
        isActivated: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные (например, пользователь не найден)',
    schema: {
      example: {
        statusCode: 400,
        message: 'Пользователь с таким email не найден',
        code: ERROR_CODES.USER_NOT_FOUND,
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный пароль',
    schema: {
      example: {
        statusCode: 401,
        message: 'Неверный пароль',
        code: ERROR_CODES.INVALID_PASSWORD,
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Аккаунт не активирован или заблокирован',
    schema: {
      example: {
        statusCode: 403,
        message: 'Аккаунт не активирован',
        code: ERROR_CODES.ACCOUNT_NOT_ACTIVATED,
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Слишком много попыток',
    schema: {
      example: {
        statusCode: 429,
        message: 'Слишком много попыток входа. Попробуйте позже.',
        code: ERROR_CODES.TOO_MANY_REQUESTS,
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
    schema: {
      example: {
        statusCode: 500,
        message: 'Ошибка при авторизации',
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        errors: [],
      },
    },
  })
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    const userData = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, userData.refreshToken);
    return res.json(userData);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, type: TokenResponse })
  @Post('/registration')
  async registration(@Body() dto: UserDto, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const userData = await this.authService.registration(dto);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  @ApiResponse({ status: 400, description: 'Неверный запрос' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`AuthController logout`);
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        this.logger.warn('AuthController: refreshToken is missing');
        return res.status(400).json({ message: 'Refresh token is missing' });
      }

      await this.authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (e) {
      this.logger.error(`AuthController: logout failed - ${e.message}`, e.stack);
      throw e;
    }
  }

  @ApiOperation({ summary: 'Активация пользователя' })
  @Get('/activate/:link')
  async activate(
    @Param('link') activationLink: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const tokens = await this.authService.activate(activationLink);
      this.logger.log(`AuthController activate`, { tokens: tokens });
      this.setRefreshTokenCookie(res, tokens.refreshToken);
      return res.redirect(`${process.env.CLIENT_URL}/`);
    } catch (e) {
      next(e);
    }
  }

  @ApiOperation({ summary: 'Обновление токена доступа' })
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
  }
}
