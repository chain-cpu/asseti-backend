/**
 * Relationships that are used for substitution in JOIN queries
 */
export const ACCOUNT_DETAILS_RELATIONS: string[] = ['company'];
export const ACCOUNT_MEMBERS_LIST_RELATIONS: string[] = ['role'];

/**
 * Columns that are used for selection in
 */
export const ACCOUNT_MEMBERS_LIST_COLUMNS: string[] = [
  'id',
  'name',
  'lastName',
  'email',
  'status',
  'kycStatus',
  'role',
  'companyRole',
  'linkedin',
  'phone',
  'createdAt',
  'updatedAt',
];
