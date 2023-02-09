import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { AuthService } from '../api/auth/auth.service';
import { UserStatusEnum } from '../api/users/enums/user-status.enum';
import { UserService } from '../api/users/user.service';
import { IS_NOT_REGISTERED_KEY } from '../decorators/not-registered.decorator';
import { IS_NOT_EMAIL_VERIFIED_KEY } from '../decorators/not-verified-email.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    /**
     * check @Public() decorator
     */
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass,
    ]);
    if (isPublic) return true;

    /**
     * check valid JWT token
     */
    const validJwt = await super.canActivate(context);
    if (!validJwt) return false;

    /**
     * check @NotRegistered() decorator
     */
    const isNotRegistered = this.reflector.getAllAndOverride<boolean>(
      IS_NOT_REGISTERED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isNotRegistered) return true;

    /**
     * check @NotVerifiedEmail() decorator
     */
    const token = context.switchToHttp().getRequest().headers.authorization;
    const auth0User = await this.authService.getProfile(token);
    const isNotVerifiedEmail = this.reflector.getAllAndOverride<boolean>(
      IS_NOT_EMAIL_VERIFIED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!auth0User.email_verified && !isNotVerifiedEmail)
      throw new BadRequestException('Email not verified');

    /**
     * check user exist
     */
    const user = await this.userService.getUserByAuth0Sub(auth0User.sub);
    if (!user) throw new NotFoundException(`User was not found`);

    /**
     * check user status Deactivated
     */
    if (user?.status === UserStatusEnum.DEACTIVATED)
      throw new BadRequestException('User deactivated');

    return true;
  }
}
