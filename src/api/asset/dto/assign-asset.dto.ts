import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignAssetDto {
  @ApiProperty({
    format: 'array',
    type: Array,
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsUUID('all', { each: true })
  userId: string | string[];
}
