import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../api/roles/role.entity';
import { Permission } from '../api/roles/permission.entity';
import { rolesConfig as config } from '../configs/roles.config';

export class InitRolesAndPermissions1663226638094
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepository = queryRunner.connection.getRepository(Role);
    const permissionRepository =
      queryRunner.connection.getRepository(Permission);

    for (let roleId = 0; roleId < config.length; roleId += 1) {
      const roleData = config[roleId];
      const role = new Role();
      role.name = roleData.name;
      role.permissions = [];

      await Promise.all(
        roleData.permissions.map(async (permissionData) => {
          let permission = await permissionRepository.findOne({
            where: {
              action: permissionData.action,
              object: permissionData.object,
            },
          });
          if (!permission) {
            permission = await new Permission();
            permission.action = permissionData.action;
            permission.object = permissionData.object;
            permission = await permissionRepository.save(permission);
          }

          if (!role.permissions.includes(permission))
            role.permissions.push(permission);
        }),
      );
      await roleRepository.save(role);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('revert');
  }
}
