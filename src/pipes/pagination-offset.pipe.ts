import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationOffsetPipe {
  @ApiProperty({
    description: 'Records offset',
    required: false,
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  public offset?: number;
}
