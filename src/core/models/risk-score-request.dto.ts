import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class RiskScoreRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  mrr_value: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  mrr_growth_rate: number;

  @ApiProperty()
  @IsInt()
  burn_rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  customer_total: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  customer_growth_rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  customer_paying_rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  customers_churn_rate: number;

  @ApiProperty()
  @IsInt()
  cac_rate: number;
}
