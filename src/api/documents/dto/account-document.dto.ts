import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum fileTypes {
  'csv',
  'xlsx',
}

export class AccountDocumentDto {
  @IsNotEmpty()
  @ApiProperty({ format: 'uuid' })
  accountId: string;
  @ApiPropertyOptional({ type: 'number', enum: fileTypes })
  fileType?: fileTypes;
}
