import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiError } from 'exceptions/api.error';
import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
		private jwtService: JwtService,
		private logger: Logger
	) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw ApiError.UnauthorizedError();
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
			this.logger.error(e)
      throw ApiError.UnauthorizedError();
    }
  }
}
