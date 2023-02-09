import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SurveyDto } from '../../../core/models/survey.dto';
import { CompanyDto } from '../../company/dto/company.dto';
import { AccountKycStatusEnum } from '../enums/account-kyc-status.enum';
import { AccountLenderTypeEnum } from '../enums/account-lender-type.enum';
import { AccountPartnerTypeEnum } from '../enums/account-partner-type.enum';
import { AccountStatusEnum } from '../enums/account-status.enum';
import { AccountTypeEnum } from '../enums/account-type.enum';

export class GetAccountDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({
    uniqueItems: true,
    example: 'uniq@email.com',
  })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({
    enum: AccountTypeEnum,
    isArray: false,
    example: AccountTypeEnum.BORROWER,
  })
  type: AccountTypeEnum;

  @ApiProperty({
    enum: AccountLenderTypeEnum,
    example: AccountLenderTypeEnum.INSTITUTIONAL,
    required: false,
  })
  lenderType?: AccountLenderTypeEnum;

  @ApiProperty({
    enum: AccountPartnerTypeEnum,
    example: AccountPartnerTypeEnum.VENTURE_CAPITALIST,
    required: false,
  })
  partnerType?: AccountPartnerTypeEnum;

  @ApiProperty({
    description: 'Survey data',
  })
  @Type(() => SurveyDto)
  survey: SurveyDto;

  @ApiProperty({
    description: 'Company data',
    required: false,
  })
  @Type(() => CompanyDto)
  company?: CompanyDto;

  @ApiProperty({
    example: 1.01,
  })
  amount: number;

  @ApiProperty({
    enum: AccountStatusEnum,
    example: AccountStatusEnum.ACTIVE,
  })
  status: AccountStatusEnum;

  @ApiProperty({
    enum: AccountKycStatusEnum,
    example: AccountKycStatusEnum.VERIFIED,
  })
  kyc: AccountKycStatusEnum;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ type: Number, default: new Date().toISOString() })
  updatedAt: Date;
}
