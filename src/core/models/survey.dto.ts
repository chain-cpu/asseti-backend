import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RiskScoreRequestDto } from './risk-score-request.dto';

export class SurveyDto extends RiskScoreRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  company_name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  country?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  url?: string;
}
