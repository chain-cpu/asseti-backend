import { Ability } from '@casl/ability';
import { PermissionAction } from './casl-enums';

export type PermissionObjectType = any;

export type AppAbility = Ability<[PermissionAction, PermissionObjectType]>;

export type RequiredPermission = [PermissionAction, PermissionObjectType];
