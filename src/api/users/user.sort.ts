import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import { SortEnum } from '../../enums/sort.enum';

export class UserSort {
  @ApiProperty({
    description: 'Sort by update date',
    required: false,
  })
  @IsOptional()
  @Matches(
    `^${Object.values(SortEnum)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  public updatedAt?: SortEnum;

  @ApiProperty({
    description: 'Sort by create date',
    required: false,
  })
  @IsOptional()
  @Matches(
    `^${Object.values(SortEnum)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  public createdAt?: SortEnum;

  @ApiProperty({
    description: 'Sort by user name',
    required: false,
  })
  @IsOptional()
  @Matches(
    `^${Object.values(SortEnum)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  public name?: SortEnum;

  @ApiProperty({
    description: 'Sort by user email',
    required: false,
  })
  @IsOptional()
  @Matches(
    `^${Object.values(SortEnum)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  public email?: SortEnum;
}
