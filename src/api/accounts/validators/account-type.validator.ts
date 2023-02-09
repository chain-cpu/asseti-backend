import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AccountTypeEnum } from '../enums/account-type.enum';

@ValidatorConstraint({ name: 'type', async: false })
export class IsAccountTypeValid implements ValidatorConstraintInterface {
  /**
   * Check if account has valid type
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
      Object.values(AccountTypeEnum).includes(element),
    );

    return result.length === value.length;
  }
}
