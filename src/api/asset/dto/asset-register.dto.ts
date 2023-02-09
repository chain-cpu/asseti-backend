import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { AssetMetaType } from '../types/asset-meta.type';

export class AssetRegisterDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 64,
    required: true,
    description: 'Asset name',
    example: 'Agreements.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 64)
  name: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 512,
    required: true,
    description: 'Asset path',
    example: 'assets/documents/demo_document1.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 512)
  location: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Asset Description',
    example: 'lorem ipsum....lorem ipsum',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 1024)
  description?: string;

  @ApiProperty({
    description: 'Asset meta data (json)',
    required: true,
    example: {
      fileSize: 1234452,
      fileName: 'demo_document1.pdf',
      fileMimeType: 'attachment/document',
    },
  })
  meta: Omit<AssetMetaType, 'location'>;
}
