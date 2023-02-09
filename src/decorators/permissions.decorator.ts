import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RequiredPermission } from '../core/models/casl-types';

export const PERMISSION_KEY = 'permission_checker_params_key';
export const CheckPermissions = (
  ...params: RequiredPermission[]
): CustomDecorator<string> => SetMetadata(PERMISSION_KEY, params);
