import { ApiProperty } from '@nestjs/swagger';
import { GetFeatureDto } from './get-feature.dto';

export class GetFeaturesDto {
  @ApiProperty({ type: Number, example: 150 })
  total: number;
  @ApiProperty({ type: () => [GetFeatureDto] })
  data: GetFeatureDto[];
}
