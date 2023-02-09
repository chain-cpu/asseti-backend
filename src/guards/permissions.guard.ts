import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../api/auth/auth.service';
import { UserService } from '../api/users/user.service';
import { AppAbility, RequiredPermission } from '../core/models/casl-types';
import { CaslService } from '../core/services/casl.service';
import { IS_NOT_REGISTERED_KEY } from '../decorators/not-registered.decorator';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
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

    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_KEY,
        context.getHandler(),
      ) || [];

    if (!requiredPermissions.length) return true;

    const token = context.switchToHttp().getRequest().headers.authorization;
    const auth0User = await this.authService.getProfile(token);
    const user = await this.userService.getUserByAuth0Sub(auth0User.sub);
    const ability = await this.caslService.createForUser(user);

    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }

  private isAllowed(
    ability: AppAbility,
    permission: RequiredPermission,
  ): boolean {
    return ability.can(...permission);
  }
}
