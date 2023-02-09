import { ApiProperty } from '@nestjs/swagger';
import { BankAccountCurrencyEnum } from '../../../core/models/bank-account-currency.enum';

export class GetBankAccountDto {
  @ApiProperty({ format: 'uuid', example: 'Bank account Id' })
  id: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Bank account title',
    example: 'My personal bank',
  })
  title: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Bank name',
    example: 'Citibank, N.A.',
  })
  name: string;

  @ApiProperty({
    minLength: 1,
    maxLength: 256,
    required: true,
    description: 'Bank address',
    example: '23 Custom str., Auckland, New Zealand 1010',
  })
  address: string;

  @ApiProperty({
    minLength: 5,
    maxLength: 34,
    required: false,
    description: 'Bank Account number (IBAN)',
    example: 'AL35202111090000000001234567',
  })
  iban: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 11,
    required: true,
    description: 'Swift code',
    example: 'BOFAUS3N',
  })
  swiftCode: string;

  @ApiProperty({
    enum: BankAccountCurrencyEnum,
    required: true,
    description: 'Payment currency',
    example: BankAccountCurrencyEnum.EUR,
  })
  currency: BankAccountCurrencyEnum;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  updatedAt: Date;
}
