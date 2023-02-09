import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountKycStatusEnum } from './enums/account-kyc-status.enum';
import { AccountLenderTypeEnum } from './enums/account-lender-type.enum';
import { AccountPartnerTypeEnum } from './enums/account-partner-type.enum';
import { AccountStatusEnum } from './enums/account-status.enum';
import { AccountTypeEnum } from './enums/account-type.enum';
import { BankAccountEntity } from '../bank-accounts/bank-account.entity';
import { Company } from '../company/company.entity';
import { User } from '../users/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120, unique: true, default: '' })
  public email: string;

  @Column({ type: 'varchar', length: 120 })
  public name: string;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    nullable: false,
  })
  type: AccountTypeEnum;

  @Column({
    nullable: true,
    type: 'enum',
    default: null,
    enum: AccountPartnerTypeEnum,
  })
  public partnerType?: AccountPartnerTypeEnum;

  @Column({
    type: 'enum',
    enum: AccountLenderTypeEnum,
    default: null,
    nullable: true,
  })
  public lenderType?: AccountLenderTypeEnum;

  @Column({ nullable: false, type: 'varchar', default: '' })
  public survey: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  public amount: string;

  @OneToMany(() => User, (user) => user.id)
  users: User[];

  @OneToMany(() => BankAccountEntity, (bankAccount) => bankAccount.id)
  @JoinTable()
  bankAccounts: BankAccountEntity[];

  @OneToOne(() => Company, (company) => company.account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  public company: Company;

  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.NEW,
    nullable: false,
  })
  public status?: AccountStatusEnum;

  @Column({
    type: 'enum',
    enum: AccountKycStatusEnum,
    default: AccountKycStatusEnum.PENDING,
    nullable: false,
  })
  public kyc?: AccountKycStatusEnum;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
