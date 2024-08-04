import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ApiError } from 'src/exceptions/api.error';
import { TokenService } from 'src/token/token.service';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.UnauthorizedError());
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        return next(ApiError.UnauthorizedError());
      }

      const tokenData = this.tokenService.validateAccessToken(accessToken);
      if (!tokenData) {
        return next(ApiError.UnauthorizedError());
      }

      req.user = tokenData;
      next();
    } catch (e) {
      return next(ApiError.UnauthorizedError());
    }
  }
}
