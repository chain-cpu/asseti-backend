import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AccountKycStatusEnum } from '../enums/account-kyc-status.enum';

@ValidatorConstraint({ name: 'kyc', async: false })
export class IsAccountKycStatusValid implements ValidatorConstraintInterface {
  /**
   * Check if account kyc has valid status
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
      Object.values(AccountKycStatusEnum).includes(element),
    );

    return result.length === value.length;
  }
}
