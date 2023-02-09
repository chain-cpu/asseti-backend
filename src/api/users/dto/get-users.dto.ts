import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from './get-user.dto';

export class GetUsersDto {
  @ApiProperty({ type: Number, example: 150 })
  total: number;
  @ApiProperty({ type: () => [GetUserDto] })
  data: GetUserDto[];
}
