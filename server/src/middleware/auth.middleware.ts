import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
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

      if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException('Access token missing');
      }

      const tokenData = this.tokenService.validateAccessToken(accessToken);
      if (!tokenData) {
        throw new UnauthorizedException('Invalid access token');
      }

      req.user = tokenData;

      next();
    } catch (error) {
      console.error(`Error in AuthMiddleware: ${error.message}`);

      next(new UnauthorizedException('User is not authorized'));
    }
  }
}
