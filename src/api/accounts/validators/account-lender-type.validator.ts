import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AccountLenderTypeEnum } from '../enums/account-lender-type.enum';

@ValidatorConstraint({ name: 'lenderType', async: false })
export class IsAccountLenderTypeValid implements ValidatorConstraintInterface {
  /**
   * Check if account lender has valid type
   * @param {string} text
   */
  validate(text: string) {
    let value: any;
    if (text.includes(',')) {
      value = text.split(',');
    } else {
      value = [text];
    }

    const result = value.filter((element) =>
      Object.values(AccountLenderTypeEnum).includes(element),
    );

    return result.length === value.length;
  }
}
