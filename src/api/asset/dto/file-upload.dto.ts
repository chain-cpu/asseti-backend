import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { AssetMetaType } from '../types/asset-meta.type';

export class FileUploadDto {
  @ApiProperty({
    description: 'Asset file',
    required: true,
    type: 'string',
    format: 'binary',
  })
  file: AssetMetaType;

  @ApiProperty({
    minLength: 1,
    maxLength: 64,
    required: true,
    description: 'Asset name',
    example: 'Agreements',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  name: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: false,
    description: 'Asset Description',
    example: 'lorem ipsum....lorem ipsum',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 1024)
  description?: string;
}
