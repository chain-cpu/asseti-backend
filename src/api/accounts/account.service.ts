import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountFilter } from './account.filter';
import { AccountSort } from './account.sort';
import {
  ACCOUNT_DETAILS_RELATIONS,
  ACCOUNT_MEMBERS_LIST_COLUMNS,
  ACCOUNT_MEMBERS_LIST_RELATIONS,
} from './constants/account-entity.constant';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountTypeEnum } from './enums/account-type.enum';
import { OWNER_ROLE_NAME } from '../../configs/roles.config';
import { PipeDriveService } from '../../core/services/pipedrive.service';
import { PaginationLimitPipe } from '../../pipes/pagination-limit.pipe';
import { PaginationOffsetPipe } from '../../pipes/pagination-offset.pipe';
import { AuthService } from '../auth/auth.service';
import { Company } from '../company/company.entity';
import { CompanyService } from '../company/company.service';
import { Invite } from '../invites/invite.entity';
import { RolesService } from '../roles/roles.service';
import { User } from '../users/user.entity';
import { UserFilter } from '../users/user.filter';
import { UserService } from '../users/user.service';
import { UserSort } from '../users/user.sort';

@Injectable()
export class AccountService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private pipeDriveService: PipeDriveService,
    private companyService: CompanyService,
    private rolesService: RolesService,
    private dataSource: DataSource,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  /**
   * Get list of accounts
   * @param {AccountFilter} filter
   * @param {AccountSort} sort
   * @param {PaginationOffsetPipe} offset
   * @param {PaginationLimitPipe} limit
   */
  async list(
    filter?: AccountFilter,
    sort?: AccountSort,
    offset?: PaginationOffsetPipe,
    limit?: PaginationLimitPipe,
  ): Promise<{ data: Account[]; total: number }> {
    const data = await this.accountRepository.find({
      where: filter as any,
      order: sort,
      skip: offset as number,
      take: limit as number,
      relations: {
        company: true,
        // users: true,
      },
    });

    const total = await this.accountRepository.count({ where: filter as any });
    return {
      total,
      data,
    };
  }

  /**
   * Get list of account's members
   * @param {string} id
   * @param {UserFilter} filter
   * @param {UserSort} sort
   * @param {PaginationOffsetPipe} offset
   * @param {PaginationLimitPipe} limit
   */
  async memberList(
    id: string,
    filter?: UserFilter,
    sort?: UserSort,
    offset?: PaginationOffsetPipe,
    limit?: PaginationLimitPipe,
  ): Promise<{ data: User[]; total: number }> {
    const pagOffset = offset as number;
    const pagLimit = limit as number;

    const users = await this.userRepository.find({
      select: ACCOUNT_MEMBERS_LIST_COLUMNS as any,
      where: {
        account: { id },
        ...(filter as any),
      },
      relations: ACCOUNT_MEMBERS_LIST_RELATIONS,
      order: sort,
      // skip: offset as number,
      // take: limit as number,
    });

    if (filter.name || filter.status)
      return {
        total: users.length,
        data: users.slice(pagOffset, pagOffset + pagLimit),
      };

    const invites = await this.inviteRepository.find({
      where: {
        account: { id },
        ...(filter as any),
      },
    });

    const inviteUsers = invites.map((invite) => {
      return this.userRepository.create({
        id: invite.id,
        email: invite.email,
        createdAt: invite.createdAt,
        updatedAt: invite.updatedAt,
      });
    });

    const data = [...users, ...inviteUsers];

    const sortKey = Object.keys(sort)[0];
    const sortUp = sort[sortKey] === 'ASC';

    // eslint-disable-next-line no-console
    console.log(sortKey, sortUp);

    data.sort((a, b) => {
      return sortUp
        ? a[sortKey] && a[sortKey].toString().localeCompare(b[sortKey])
        : b[sortKey] && b[sortKey].toString().localeCompare(a[sortKey]);
    });

    return {
      total: users.length + invites.length,
      data: data.slice(pagOffset, pagOffset + pagLimit),
    };
  }

  findOne(id: string): Promise<Account> {
    return this.accountRepository.findOne({
      where: { id },
      relations: ACCOUNT_DETAILS_RELATIONS,
    });
  }

  async create(
    createAccountDto: CreateAccountDto,
    token: string,
  ): Promise<Account> {
    let profile;
    let user;
    let account;
    try {
      profile = await this.authService.getProfile(token);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('---error', e.message);
    }

    if (!profile) {
      throw new BadRequestException('Unable to create profile');
    }

    user = await this.userService.getUserByEmail(profile.email);
    if (user)
      throw new BadRequestException('User with token email address exists');

    account = await this.accountRepository.findOneBy({
      email: profile.email,
    });
    if (account)
      throw new BadRequestException(
        'An account with this email address already exist',
      );

    const owner = await this.rolesService.getRoleByName(OWNER_ROLE_NAME);
    if (!owner) throw new BadRequestException('Owner role do not exist');

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // todo perhaps a company should not be formed for an individual lender
      const company = await this.companyService.createWithNotSaving(
        createAccountDto.survey,
      );
      // eslint-disable-next-line no-console
      console.log('company', company);

      account = await this.createAccountWithNotSaving(
        profile.email,
        createAccountDto,
        company,
      );
      // eslint-disable-next-line no-console
      console.log('account', account);

      user = await this.userService.createUserWithNotSaving(
        profile.sub,
        profile.email,
        createAccountDto.survey.user_name,
        owner,
        account,
      );
      // eslint-disable-next-line no-console
      console.log('user', user);

      account.users.push(user);

      try {
        await this.pipeDriveService.addPersonAsALead(
          account.name,
          account.email,
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('pipedrive creation lead error', e);
      }

      await this.companyRepository.save(company);
      await this.accountRepository.save(account);
      await this.userRepository.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('---error', e.message);

      await queryRunner.rollbackTransaction();

      throw new BadRequestException('Unable to create account');
    } finally {
      await queryRunner.release();
    }

    return await this.accountRepository.findOne({ where: { id: account.id } });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.accountRepository.delete(id);
  }

  private createAccountWithNotSaving(
    email: string,
    createAccountDto: CreateAccountDto,
    company: Company,
  ): Account {
    const account = new Account();
    account.email = email;
    account.name = createAccountDto.name;
    account.type = createAccountDto.type;
    account.survey = JSON.stringify(createAccountDto.survey);
    account.company = company;
    account.users = [];
    if (
      createAccountDto.lenderType &&
      createAccountDto.type === AccountTypeEnum.LENDER
    ) {
      account.lenderType = createAccountDto.lenderType;
    }
    if (
      createAccountDto.partnerType &&
      createAccountDto.type === AccountTypeEnum.PARTNER
    ) {
      account.partnerType = createAccountDto.partnerType;
    }
    return account;
  }
}
