import { SetMetadata } from '@nestjs/common';

export const IS_NOT_EMAIL_VERIFIED_KEY = 'isNotVerifiedEmail';
export const NotVerifiedEmail = () =>
  SetMetadata(IS_NOT_EMAIL_VERIFIED_KEY, true);
