export type PartialOmitEntityProps<T> = Partial<
  Omit<
    T,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'code'
    | 'hasId'
    | 'recover'
    | 'remove'
    | 'softRemove'
    | 'reload'
    | 'save'
  >
>;
