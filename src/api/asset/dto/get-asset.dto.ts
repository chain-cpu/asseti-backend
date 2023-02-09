import { ApiProperty } from '@nestjs/swagger';
import { AssetStateEntity } from '../entities/asset-state.entity';
import { AssetMetaType } from '../types/asset-meta.type';

export class GetAssetDto {
  @ApiProperty({
    description: 'Asset Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Asset name',
    example: 'Agreements.pdf',
  })
  name: string;

  @ApiProperty({
    description: 'Asset path',
    example: 'assets/documents/demo_document1.pdf',
  })
  location: string;

  @ApiProperty({
    required: false,
    description: 'Asset Description',
    example: 'lorem ipsum....lorem ipsum',
  })
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

  @ApiProperty({
    description: 'Asset assign users',
    required: true,
    type: () => AssetStateEntity,
  })
  assigned: AssetStateEntity[];

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  updatedAt: Date;
}
