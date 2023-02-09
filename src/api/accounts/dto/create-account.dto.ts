import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { SurveyDto } from '../../../core/models/survey.dto';
import { AccountLenderTypeEnum } from '../enums/account-lender-type.enum';
import { AccountPartnerTypeEnum } from '../enums/account-partner-type.enum';
import { AccountTypeEnum } from '../enums/account-type.enum';

export class CreateAccountDto {
  @ApiProperty({
    minLength: 3,
    maxLength: 120,
    required: true,
    description: 'Account name',
    example: 'MyName',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 120)
  @Transform(({ value }) => value.trim())
  readonly name: string;

  @ApiProperty({
    enum: AccountTypeEnum,
    required: true,
    example: AccountTypeEnum.BORROWER,
  })
  @IsNotEmpty()
  @IsEnum(AccountTypeEnum)
  readonly type: AccountTypeEnum;

  @ApiProperty({
    enum: AccountLenderTypeEnum,
    required: false,
    example: AccountLenderTypeEnum.INDIVIDUAL,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(AccountLenderTypeEnum)
  readonly lenderType?: AccountLenderTypeEnum;

  @ApiProperty({
    enum: AccountPartnerTypeEnum,
    required: false,
    example: AccountPartnerTypeEnum.VENTURE_CAPITALIST,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(AccountPartnerTypeEnum)
  readonly partnerType?: AccountPartnerTypeEnum;

  @ApiProperty()
  readonly survey: SurveyDto;
}
