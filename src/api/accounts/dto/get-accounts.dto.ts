import { ApiProperty } from '@nestjs/swagger';
import { GetAccountDto } from './get-account.dto';

export class GetAccountsDto {
  @ApiProperty({ type: Number, example: 150 })
  total: number;
  @ApiProperty({ type: () => [GetAccountDto] })
  data: GetAccountDto[];
}
