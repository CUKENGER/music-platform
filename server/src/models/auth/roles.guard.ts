import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiError } from 'exceptions/api.error';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'prisma/prisma.service';
import { ROLES_KEY } from './rolesAuth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log(`RolesGuard start check`)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.log(`RolesGuard requiredRoles`, { requiredRoles: requiredRoles })

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.UnauthorizedError();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.UnauthorizedError();
    }

    const user = await this.prisma.user.findFirst({
      where: {
        tokens: {
          some: {
            accessToken: token,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      this.logger.warn(`RolesGuard user not found`)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.roles || user.roles.length === 0) {
      this.logger.warn(`RolesGuard User does not have any roles`)
      throw new HttpException('User does not have any roles', HttpStatus.FORBIDDEN);
    }
    const userRoles = user.roles.map((userRole) => userRole.role.value);
    this.logger.log(`RolesGuard check end`)
    this.logger.log('User roles:', { userRoles: userRoles });
    return requiredRoles.some((role) =>
      userRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()),
    );
  }
}
