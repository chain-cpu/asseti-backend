import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ValidRolesForUserUpdate } from '../enums/valid-user-update-role.enum';
import { ValidStatusesForUserUpdate } from '../enums/valid-user-update-status.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: ValidRolesForUserUpdate,
    required: false,
    example: ValidRolesForUserUpdate.USER_ROLE,
  })
  @IsNotEmpty()
  @IsEnum(ValidRolesForUserUpdate)
  roleName: ValidRolesForUserUpdate;
}

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'User status',
    enum: ValidStatusesForUserUpdate,
    required: false,
    example: ValidStatusesForUserUpdate.ACTIVE,
  })
  @IsNotEmpty()
  @IsEnum(ValidStatusesForUserUpdate)
  status: ValidStatusesForUserUpdate;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User role',
    enum: ValidRolesForUserUpdate,
    required: false,
    example: ValidRolesForUserUpdate.USER_ROLE,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ValidRolesForUserUpdate)
  roleName?: ValidRolesForUserUpdate;

  @ApiProperty({
    description: 'User status',
    enum: ValidStatusesForUserUpdate,
    required: false,
    example: ValidStatusesForUserUpdate.ACTIVE,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ValidStatusesForUserUpdate)
  status?: ValidStatusesForUserUpdate;
}
