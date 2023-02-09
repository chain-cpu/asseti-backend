import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../api/auth/auth.service';
import { UserService } from '../api/users/user.service';
import { CaslService } from '../core/services/casl.service';
import { IS_NOT_REGISTERED_KEY } from '../decorators/not-registered.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslService: CaslService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isNotRegistered = this.reflector.getAllAndOverride<boolean>(
      IS_NOT_REGISTERED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic || isNotRegistered) return true;

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    if (!requiredRoles.length) return true;

    const token = context.switchToHttp().getRequest().headers.authorization;
    const auth0User = await this.authService.getProfile(token);
    const user = await this.userService.getUserByAuth0Sub(auth0User.sub);
    return requiredRoles.includes(user.role.name);
  }
}
