import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "prisma/prisma.service";
import { ROLES_KEY } from "./rolesAuth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        throw new ForbiddenException('Authorization header is missing');
      }
      
      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new ForbiddenException('Token is missing or invalid');
      }

      console.log('token', token)

      const user = await this.prisma.user.findFirst({
        where: {
          tokens: {
            some: {
              accessToken: token
            }
          }
        },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });

      console.log('user', user)

      if (!user || !user.roles) {
        throw new ForbiddenException('You do not have the required permissions');
      }

      return user.roles.some(userRole => 
        requiredRoles.includes(userRole.role.value)
      );

    } catch (e) {
      console.error(`Error in roles guard: ${e.message}`);
      throw new ForbiddenException("No access");
    }
  }
}
