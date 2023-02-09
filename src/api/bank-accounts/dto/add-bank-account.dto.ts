import { ApiProperty } from '@nestjs/swagger';
import {
  IsBIC,
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BankAccountCurrencyEnum } from '../../../core/models/bank-account-currency.enum';

export class AddBankAccountDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Bank account title',
    example: 'My personal bank',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  title: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Bank name',
    example: 'Citibank, N.A.',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  name: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Bank address',
    example: '23 Custom str., Auckland, New Zealand 1010',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  address: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 34,
    required: true,
    description: 'Bank Account number (IBAN)',
    example: 'AL35202111090000000001234567',
  })
  @IsIBAN()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(34)
  iban: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 11,
    required: true,
    description: 'Swift code',
    example: 'BOFAUS3N',
  })
  @IsNotEmpty()
  @IsBIC()
  swiftCode: string;

  @ApiProperty({
    enum: BankAccountCurrencyEnum,
    required: true,
    description: 'Payment currency',
    example: BankAccountCurrencyEnum.EUR,
  })
  @IsNotEmpty()
  @IsEnum(BankAccountCurrencyEnum)
  currency: BankAccountCurrencyEnum;
}
