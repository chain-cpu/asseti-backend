import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { BankAccountEntity } from './bank-account.entity';
import { AddBankAccountDto } from './dto/add-bank-account.dto';
import { EditBankAccountDto } from './dto/edit-bank-account.dto';
import { DbErrorsEnum } from '../../enums/db-errors.enum';
import { Account } from '../accounts/account.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountRepository: Repository<BankAccountEntity>,
  ) {}

  /**
   * Add bank account
   * @param {AddBankAccountDto} param
   * @param {Account} account
   */
  async add(
    param: AddBankAccountDto,
    account: Account,
  ): Promise<BankAccountEntity> {
    const entity = this.bankAccountRepository.create({
      ...param,
      account,
    });
    try {
      return await this.bankAccountRepository.save(entity);
    } catch (error) {
      if (error.driverError.code === DbErrorsEnum.UNIQUE_CONSTRAINT)
        throw new ConflictException('Bank account has already being added');
    }
  }

  /**
   * Edit bank account
   * @param {string} id
   * @param {Account} account
   * @param {AddBankAccountDto} param
   */
  async update(
    id: string,
    account: Account,
    param: EditBankAccountDto,
  ): Promise<BankAccountEntity> {
    const criteria = {
      id,
      account: {
        id: account.id,
      },
    };

    const entity = this.bankAccountRepository.create(param);
    const model = await this.bankAccountRepository.update(criteria, entity);
    if (model.affected === 0)
      throw new NotFoundException('Bank account not found');
    return await this.bankAccountRepository.findOne({ where: criteria });
  }

  /**
   * Find all bank accounts for account user
   * @param {Account} account
   */
  async findAllByAccount(account: Account): Promise<BankAccountEntity[]> {
    return await this.bankAccountRepository.find({
      where: {
        account: {
          id: account.id,
        },
      },
    });
  }

  /**
   * Find bank account by Id for account user
   * @param {string} id
   * @param {Account} account
   */
  async findByAccountAndId(
    id: string,
    account: Account,
  ): Promise<BankAccountEntity> {
    try {
      return await this.bankAccountRepository.findOneOrFail({
        where: {
          id,
          account: {
            id: account.id,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Bank account not found');
    }
  }

  /**
   * Delete bank account by Id for account user
   * @param {string} id
   * @param {Account} account
   */
  async delete(id: string, account: Account): Promise<DeleteResult> {
    return await this.bankAccountRepository.delete({
      id,
      account: {
        id: account.id,
      },
    });
  }
}
