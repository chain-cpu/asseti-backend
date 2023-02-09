import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Role } from '../../roles/role.entity';
import { UserStatusEnum } from '../enums/user-status.enum';

export class GetUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    uniqueItems: true,
    example: 'uniq@email.com',
  })
  email?: string;

  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @ApiProperty({
    description: 'User role',
  })
  @Type(() => Role)
  role?: Role;

  @ApiProperty({
    enum: UserStatusEnum,
    example: UserStatusEnum.ACTIVE,
    required: false,
  })
  status?: UserStatusEnum;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  updatedAt: Date;
}
