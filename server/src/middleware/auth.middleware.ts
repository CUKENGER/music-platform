import { Injectable, NestMiddleware } from '@nestjs/common';
import { ApiError } from 'exceptions/api.error';
import { Request } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { TokenPublicService } from 'models/token/tokenPublic.service';
import { Logger } from 'nestjs-pino';

export interface RequestWithUser extends Request {
  user?: unknown;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: Logger,
    private readonly tokenPublicService: TokenPublicService,
  ) {}

  use(req: RequestWithUser, _res: Response, next: NextFunction) {
    this.logger.log(`Request to: ${req.method} ${req.path}`);

    const authorizationHeader = req.headers.authorization;

    this.logger.log(`AuthMiddleware authorizationHeader: ${authorizationHeader}`);
    if (!authorizationHeader) {
      this.logger.error(`Authorization header missing`);
      throw ApiError.UnauthorizedError('Authorization header missing');
    }

    const accessToken = authorizationHeader.split(' ')[1];

    this.logger.log(`AuthMiddleware accessToken: ${accessToken}`);
    if (!accessToken) {
      this.logger.error(`Access token missing`);
      throw ApiError.UnauthorizedError('Access token missing');
    }

    const tokenData = this.tokenPublicService.validateAccessToken(accessToken);
    this.logger.log(`AuthMiddleware tokenData:`, { tokenData: tokenData });
    if (!tokenData) {
     this.logger.error(`Invalid access token`);
      throw ApiError.UnauthorizedError('Invalid access token');
    }

    req.user = tokenData;

    next();
  }
}
