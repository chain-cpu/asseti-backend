import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationLimitPipe {
  @ApiProperty({
    description: 'Records limit',
    required: false,
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  public limit?: number;
}
