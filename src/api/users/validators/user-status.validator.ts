import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserStatusEnum } from '../enums/user-status.enum';

@ValidatorConstraint({ name: 'status', async: false })
export class IsUserStatusValid implements ValidatorConstraintInterface {
  /**
   * Check if user has valid status
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
      Object.values(UserStatusEnum).includes(element),
    );

    return result.length === value.length;
  }
}
