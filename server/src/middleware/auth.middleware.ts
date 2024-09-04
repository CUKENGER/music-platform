import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ApiError } from 'exceptions/api.error';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from 'models/token/token.service';

export interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      console.log('authorizationHeader', authorizationHeader);
      if (!authorizationHeader) {
        return next(ApiError.UnauthorizedError());
      }

      const accessToken = authorizationHeader.split(' ')[1];
      console.log(`accessToken`, accessToken);
      if (!accessToken) {
        return next(ApiError.UnauthorizedError());
      }

      const tokenData = this.tokenService.validateAccessToken(accessToken);
      console.log('tokenData', tokenData);
      if (!tokenData) {
        return next(ApiError.UnauthorizedError());
      }

      req.user = tokenData;
      next();
    } catch (e) {
      console.log(`catch(e) ${e}`)
      return next(ApiError.UnauthorizedError());
    }
  }
}
