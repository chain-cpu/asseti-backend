import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ToBoolean } from '../../../../transformers/boolean.transformer';

export class EditFeatureDto {
  @ApiProperty({
    description: 'Feature name',
    example: 'Dashboard',
    maxLength: 64,
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  public name?: string;

  @ApiProperty({
    description: 'Feature description',
    example: 'Dashboard for account',
    maxLength: 128,
    minLength: 3,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  public description?: string;

  @ApiProperty({
    description: 'Feature active state',
    required: false,
  })
  @IsOptional()
  @ToBoolean()
  public isActive?: boolean;
}
