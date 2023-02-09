import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account, (account) => account.company)
  account: Account;

  @Column({
    nullable: true,
  })
  logo: string;

  @Column({
    nullable: true,
  })
  legalEntityName: string;

  @Column({
    nullable: true,
  })
  legalEntityType: string;

  @Column({
    nullable: true,
  })
  companyName: string;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  secondaryAddress: string;

  @Column({
    nullable: true,
  })
  companyNumber: number;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  website: string;

  @Column({
    nullable: true,
  })
  companyAge: number;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    nullable: true,
  })
  industryGroups: string;

  @Column({
    nullable: true,
  })
  peopleQuantity: number;

  @Column({
    nullable: true,
  })
  mrr: number;

  @Column({
    nullable: true,
  })
  debtRatio: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
