import { UserStatusEnum } from './user-status.enum';

export enum ValidStatusesForUserUpdate {
  ACTIVE = UserStatusEnum.ACTIVE,
  DEACTIVATED = UserStatusEnum.DEACTIVATED,
}
