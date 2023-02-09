import { ApiProperty } from '@nestjs/swagger';

export class GetFeatureDto {
  @ApiProperty({ format: 'uuid', example: 'Feature Id' })
  id: string;

  @ApiProperty({
    description: 'Feature name',
    example: 'Dashboard',
  })
  public name: string;

  @ApiProperty({
    description: 'Feature description',
    example: 'Dashboard for account',
  })
  public description: string;

  @ApiProperty({
    description: 'Feature active state',
  })
  public isActive: boolean;
}
