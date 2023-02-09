import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { Public } from '../../decorators/public.decorator';

@Controller('roles')
@ApiTags('roles')
@ApiSecurity('API-KEY')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Roles',
  })
  async getRoles(): Promise<Role[]> {
    return await this.roleService.getRoles();
  }

  @Get(':id')
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get permissions of a Role',
  })
  async getRolePermissions(@Param('id') id: number) {
    return await this.roleService.getRolePermissions(id);
  }

  @Post()
  @Public()
  @ApiResponse({
    type: Role,
    status: HttpStatus.CREATED,
    description: 'Create a role',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleService.createRole(createRoleDto);
  }

  @Post(':id')
  @Public()
  @ApiResponse({
    type: Role,
    status: HttpStatus.CREATED,
    description: "Create role's permissions",
  })
  async createRolePermissions(
    @Param('id') id: number,
    @Body() createPermissionDto: CreatePermissionDto[], //todo need to add pipe
  ): Promise<Role> {
    return await this.roleService.createRolePermissions(
      createPermissionDto,
      id,
    );
  }
}
