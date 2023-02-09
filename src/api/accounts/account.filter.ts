import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, Validate } from 'class-validator';
import { AccountKycStatusEnum } from './enums/account-kyc-status.enum';
import { AccountLenderTypeEnum } from './enums/account-lender-type.enum';
import { AccountStatusEnum } from './enums/account-status.enum';
import { AccountTypeEnum } from './enums/account-type.enum';
import { IsAccountKycStatusValid } from './validators/account-kyc-status.validator';
import { IsAccountLenderTypeValid } from './validators/account-lender-type.validator';
import { IsAccountStatusValid } from './validators/account-status.validator';
import { IsAccountTypeValid } from './validators/account-type.validator';
import { QUERY_FILTER_MIN_TYPE } from '../../constants/query-filter.constant';

export class AccountFilter {
  @ApiProperty({
    description: 'Account name',
    example: '%john%',
    minLength: QUERY_FILTER_MIN_TYPE,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(QUERY_FILTER_MIN_TYPE)
  public name?: string;

  @ApiProperty({
    description: 'Account type',
    enum: AccountTypeEnum,
    isArray: false,
    required: false,
  })
  @IsOptional()
  @Validate(IsAccountTypeValid, {
    message: `Invalid account type passed. Use ${Object.values(
      AccountTypeEnum,
    )}`,
  })
  public type?: AccountTypeEnum | AccountTypeEnum[];

  @ApiProperty({
    description: 'Account lender type',
    enum: AccountLenderTypeEnum,
    isArray: false,
    required: false,
  })
  @IsOptional()
  @Validate(IsAccountLenderTypeValid, {
    message: `Invalid account lender type passed. Use ${Object.values(
      AccountLenderTypeEnum,
    )}`,
  })
  public lenderType?: AccountLenderTypeEnum | AccountLenderTypeEnum[];

  @ApiProperty({
    description: 'Account survey',
    example: '%test%',
    minLength: QUERY_FILTER_MIN_TYPE,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(QUERY_FILTER_MIN_TYPE)
  public survey?: string;

  @ApiProperty({
    description: 'Account status',
    enum: AccountStatusEnum,
    isArray: false,
    required: false,
  })
  @IsOptional()
  @Validate(IsAccountStatusValid, {
    message: `Invalid account status passed. Use ${Object.values(
      AccountStatusEnum,
    )}`,
  })
  public status?: AccountStatusEnum | AccountStatusEnum[];

  @ApiProperty({
    description: 'Account kyc status',
    enum: AccountKycStatusEnum,
    isArray: false,
    required: false,
  })
  @IsOptional()
  @Validate(IsAccountKycStatusValid, {
    message: `Invalid account kyc status passed. Use ${Object.values(
      AccountKycStatusEnum,
    )}`,
  })
  public kyc?: AccountKycStatusEnum | AccountKycStatusEnum[];
}
