import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { QUERY_FILTER_MIN_TYPE } from '../../constants/query-filter.constant';

export class AssetFilter {
  @ApiProperty({
    description: 'Asset name',
    example: '%john%',
    minLength: QUERY_FILTER_MIN_TYPE,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(QUERY_FILTER_MIN_TYPE)
  public name?: string;
}
