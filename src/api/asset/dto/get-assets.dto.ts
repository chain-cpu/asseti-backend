import { ApiProperty } from '@nestjs/swagger';
import { GetAssetDto } from './get-asset.dto';

export class GetAssetsDto {
  @ApiProperty({ type: Number, example: 150 })
  total: number;
  @ApiProperty({ type: () => [GetAssetDto] })
  data: GetAssetDto[];
}
