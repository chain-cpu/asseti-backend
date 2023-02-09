import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserKYCStatusEnum } from './enums/user-kyc-status.enum';
import { UserStatusEnum } from './enums/user-status.enum';
import { Account } from '../accounts/account.entity';
import { AssetStateEntity } from '../asset/entities/asset-state.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  authSub: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  lastName: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn()
  role: Role;

  @ManyToOne(() => Account, (account) => account.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  companyRole: string;

  @Column({
    nullable: true,
  })
  dob: string;

  @Column({
    nullable: true,
  })
  age: string;

  @Column({
    nullable: true,
  })
  gender: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  linkedin: string;

  @Column({
    nullable: true,
  })
  isAuthority: string;

  @Column({
    nullable: true,
  })
  workingExperience: string;

  @Column({
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  @Column({
    default: UserKYCStatusEnum.INACTIVE,
  })
  kycStatus: UserKYCStatusEnum;

  @Column({
    nullable: true,
  })
  phone: string;

  @OneToMany(() => AssetStateEntity, (asset) => asset.user)
  assets: AssetStateEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
