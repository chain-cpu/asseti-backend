import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: {
        permissions: true,
      },
    });
  }

  /**
   * Get user role by Id
   * @param {number} id
   */
  async getRole(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!role) {
      throw new NotFoundException(`Role was not found`);
    }
    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    return await this.roleRepository.findOne({
      where: { name },
      relations: { permissions: true },
    });
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create({
        ...createRoleDto,
        permissions: [],
      });
      return await this.roleRepository.save(role);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Unique key violation ' + error,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async getRolePermissions(id: number): Promise<Permission[]> {
    const role = await this.getRole(id);
    if (!role) throw new BadRequestException('Role not found');
    return role.permissions;
  }

  async createRolePermissions(
    permissionsDto: CreatePermissionDto[],
    id,
  ): Promise<Role> {
    const role = await this.getRole(id);
    if (!role) throw new BadRequestException('Role not found');

    permissionsDto.map(async (permissionDto) => {
      let permission = await this.permissionRepository.findOne({
        where: {
          action: permissionDto.action,
          object: permissionDto.object,
        },
      });

      if (!permission) {
        permission = await this.permissionRepository.create({
          ...permissionDto,
        });
        permission = await this.permissionRepository.save(permission);
      }
      role.permissions.push(permission);
    });

    return await this.roleRepository.save(role);
  }
}
