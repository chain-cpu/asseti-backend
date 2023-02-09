import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Permission } from '../../api/roles/permission.entity';
import { RolesService } from '../../api/roles/roles.service';
import { User } from '../../api/users/user.entity';
import { PermissionAction } from '../models/casl-enums';
import { AppAbility, PermissionObjectType } from '../models/casl-types';

interface CaslPermission {
  action: PermissionAction;
  subject: string;
}

@Injectable()
export class CaslService {
  constructor(private rolesService: RolesService) {}

  async createForUser(user: User): Promise<AppAbility> {
    const dbPermissions: Permission[] =
      await this.rolesService.getRolePermissions(user.role.id);
    const caslPermissions: CaslPermission[] = dbPermissions.map(
      (permission) => ({
        action: permission.action,
        subject: permission.object,
      }),
    );
    return new Ability<[PermissionAction, PermissionObjectType]>(
      caslPermissions,
    );
  }
}
