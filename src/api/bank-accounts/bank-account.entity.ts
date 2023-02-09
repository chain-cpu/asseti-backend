import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccountCurrencyEnum } from '../../core/models/bank-account-currency.enum';
import { Account } from '../accounts/account.entity';

@Entity({ name: 'bank_accounts' })
@Unique('uni_bank_account', ['iban', 'account'])
export class BankAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 256, default: null })
  public title: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  public address: string;

  @Column({ type: 'varchar', length: 34, nullable: false })
  public iban: string;

  @Column({ type: 'varchar', length: 11, nullable: false })
  public swiftCode: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: BankAccountCurrencyEnum,
    default: BankAccountCurrencyEnum.USD,
  })
  public currency: BankAccountCurrencyEnum;

  @ManyToOne(() => Account, (account) => account.bankAccounts)
  @JoinColumn()
  account: Account;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
