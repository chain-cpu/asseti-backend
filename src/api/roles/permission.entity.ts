import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectName, PermissionAction } from '../../core/models/casl-enums';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PermissionAction })
  action: PermissionAction;

  @Column({ type: 'enum', enum: ObjectName })
  object: ObjectName;
}
