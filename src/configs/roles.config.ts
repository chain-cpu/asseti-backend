import { ObjectName, PermissionAction } from '../core/models/casl-enums';

export const ADMIN_ROLE_NAME = 'Admin';
export const USER_ROLE_NAME = 'User';
export const SUPERUSER_ROLE_NAME = 'SuperUser';
export const OWNER_ROLE_NAME = 'Owner';

export const rolesConfig = [
  {
    name: SUPERUSER_ROLE_NAME,
    permissions: [
      {
        action: PermissionAction.Manage,
        object: ObjectName.account,
      },
      {
        action: PermissionAction.Manage,
        object: ObjectName.company,
      },
      {
        action: PermissionAction.Manage,
        object: ObjectName.user,
      },
    ],
  },
  {
    name: USER_ROLE_NAME,
    permissions: [],
  },
  {
    name: ADMIN_ROLE_NAME,
    permissions: [
      {
        action: PermissionAction.Manage,
        object: ObjectName.all,
      },
    ],
  },
  {
    name: OWNER_ROLE_NAME,
    permissions: [
      {
        action: PermissionAction.Manage,
        object: ObjectName.account,
      },
      {
        action: PermissionAction.Manage,
        object: ObjectName.company,
      },
      {
        action: PermissionAction.Manage,
        object: ObjectName.user,
      },
    ],
  },
];
