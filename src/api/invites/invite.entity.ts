import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creator: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Account, (account) => account.users)
  @JoinColumn()
  account: Account;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
