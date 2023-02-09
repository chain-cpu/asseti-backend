import { SetMetadata } from '@nestjs/common';

export const IS_NOT_REGISTERED_KEY = 'isNotRegistered';
export const NotRegistered = () => SetMetadata(IS_NOT_REGISTERED_KEY, true);
