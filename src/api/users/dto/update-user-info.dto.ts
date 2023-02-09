import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiPropertyOptional({ example: 'name' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'lastname' })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @ApiPropertyOptional({ example: 'example@email.com' })
  @IsString()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ example: 'CTO' })
  @IsString()
  @IsOptional()
  readonly companyRole?: string;

  @ApiPropertyOptional({ example: 'linkedin.com/in/name-lastname' })
  @IsString()
  @IsOptional()
  readonly linkedin?: string;

  @ApiPropertyOptional({ example: '+380123456789' })
  @IsString()
  @IsOptional()
  readonly phone?: string;
}
