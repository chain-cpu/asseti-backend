import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PermissionAction, ObjectName } from '../../../core/models/casl-enums';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'description of the action property',
    enum: PermissionAction,
  })
  @IsNotEmpty()
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @ApiProperty({
    description: 'description of the object property',
    enum: ObjectName,
  })
  @IsNotEmpty()
  @IsEnum(ObjectName)
  object: ObjectName;

  @IsNumber()
  role: number;
}
