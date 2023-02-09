import { SetMetadata } from '@nestjs/common';

export const API_KEY_SKIPPED = 'ApiKeySkipped';
export const ApiKeySkipped = () => SetMetadata(API_KEY_SKIPPED, true);
