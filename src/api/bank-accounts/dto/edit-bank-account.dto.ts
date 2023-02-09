import { ApiProperty } from '@nestjs/swagger';
import {
  IsBIC,
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BankAccountCurrencyEnum } from '../../../core/models/bank-account-currency.enum';

export class EditBankAccountDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: false,
    description: 'Bank account title',
    example: 'My personal bank',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 256)
  title?: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: false,
    description: 'Bank name',
    example: 'Citibank, N.A.',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 256)
  name?: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: false,
    description: 'Bank address',
    example: '23 Custom str., Auckland, New Zealand 1010',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 256)
  address?: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 34,
    required: false,
    description: 'Bank Account number (IBAN)',
    example: 'AL35202111090000000001234567',
  })
  @IsIBAN()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(5)
  @MaxLength(34)
  iban?: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 11,
    required: false,
    description: 'Swift code',
    example: 'BOFAUS3N',
  })
  @IsBIC()
  @IsNotEmpty()
  @IsOptional()
  swiftCode?: string;

  @ApiProperty({
    enum: BankAccountCurrencyEnum,
    required: false,
    description: 'Payment currency',
    example: BankAccountCurrencyEnum.EUR,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(BankAccountCurrencyEnum)
  currency?: BankAccountCurrencyEnum;
}
