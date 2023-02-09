import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Auth0UserType } from '../types/auth0-user.type';

/**
 * Get current auth0 user object
 */
export const GetAuth0User = createParamDecorator(
  (
    data: keyof Auth0UserType | undefined,
    context: ExecutionContext,
  ): Auth0UserType => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
