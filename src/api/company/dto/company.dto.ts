import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CompanyDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legalEntityName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legalEntityType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  secondaryAddress?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  companyNumber?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  companyAge?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  industryGroups?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  peopleQuantity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  mrr?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  debtRatio?: number;
}
