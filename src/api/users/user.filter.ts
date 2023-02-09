import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, Validate } from 'class-validator';
import { UserStatusEnum } from './enums/user-status.enum';
import { IsUserStatusValid } from './validators/user-status.validator';
import { QUERY_FILTER_MIN_TYPE } from '../../constants/query-filter.constant';

export class UserFilter {
  @ApiProperty({
    description: 'User name',
    example: '%john%',
    minLength: QUERY_FILTER_MIN_TYPE,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(QUERY_FILTER_MIN_TYPE)
  public name?: string;

  @ApiProperty({
    description: 'User email',
    example: '%john%',
    minLength: QUERY_FILTER_MIN_TYPE,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(QUERY_FILTER_MIN_TYPE)
  public email?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatusEnum,
    isArray: false,
    required: false,
  })
  @IsOptional()
  @Validate(IsUserStatusValid, {
    message: `Invalid user status passed. Use ${Object.values(UserStatusEnum)}`,
  })
  public status?: UserStatusEnum | UserStatusEnum[];
}
