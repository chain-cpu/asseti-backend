import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AccountStatusEnum } from '../enums/account-status.enum';

@ValidatorConstraint({ name: 'status', async: false })
export class IsAccountStatusValid implements ValidatorConstraintInterface {
  /**
   * Check if account has valid status
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
      Object.values(AccountStatusEnum).includes(element),
    );

    return result.length === value.length;
  }
}
