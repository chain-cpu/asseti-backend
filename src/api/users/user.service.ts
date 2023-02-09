import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Express } from 'express';
import { DeleteResult, In, Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserFilter } from './user.filter';
import { UserSort } from './user.sort';
import { ADMIN_ROLE_NAME, OWNER_ROLE_NAME } from '../../configs/roles.config';
import { Auth0Role } from '../../core/models/auth0-role';
import { Auth0UserModel } from '../../core/models/auth0-user';
import { Auth0ManagementService } from '../../core/services/auth0-management.service';
import { S3Service } from '../../core/services/s3.service';
import { PaginationLimitPipe } from '../../pipes/pagination-limit.pipe';
import { PaginationOffsetPipe } from '../../pipes/pagination-offset.pipe';
import { Auth0UserType } from '../../types/auth0-user.type';
import { Account } from '../accounts/account.entity';
import { AuthService } from '../auth/auth.service';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,

    private authService: AuthService,
    private roleService: RolesService,
    private readonly s3Service: S3Service,
    private readonly managementService: Auth0ManagementService,
  ) {}

  /**
   * Get list of accounts
   * @param {UserFilter} filter
   * @param {UserSort} sort
   * @param {PaginationOffsetPipe} offset
   * @param {PaginationLimitPipe} limit
   */
  async list(
    filter?: UserFilter,
    sort?: UserSort,
    offset?: PaginationOffsetPipe,
    limit?: PaginationLimitPipe,
  ): Promise<{ data: User[]; total: number }> {
    const data = await this.userRepository.find({
      where: filter as any,
      order: sort as any,
      skip: offset as number,
      take: limit as number,
      relations: { role: true, assets: true },
    });

    const total = await this.userRepository.count({ where: filter as any });
    return {
      total,
      data,
    };
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: true, assets: true },
    });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async createUser(
    authSub: string,
    email: string,
    name: string,
    role: Role,
    account: Account,
  ): Promise<User> {
    const user = this.createUserWithNotSaving(
      authSub,
      email,
      name,
      role,
      account,
    );

    return this.userRepository.save(user);
  }

  createUserWithNotSaving(
    authSub: string,
    email: string,
    name: string,
    role: Role,
    account: Account,
  ): User {
    const user = new User();
    user.authSub = authSub;
    user.email = email;
    user.name = name;
    user.role = role;
    user.account = account;

    return user;
  }

  async getUserInfo(req): Promise<User> {
    const profile = await this.authService.getProfile(
      req.headers.authorization,
    );
    return await this.getUserByAuth0Sub(profile.sub);
  }

  async getUserId(req): Promise<string> {
    const profile = await this.authService.getProfile(
      req.headers.authorization,
    );
    const user: User = await this.getUserByAuth0Sub(profile.sub);
    return user ? user.id : null;
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async getUserByAuth0Sub(sub: string, withRelations = true): Promise<User> {
    const options = {
      where: { authSub: sub },
      relations: { role: true, account: { company: true } },
    };

    if (!withRelations) delete options.relations;

    const user = await this.userRepository.findOne(options);
    if (!user) throw new NotFoundException(`User was not found`);
    return user;
  }

  async updateFromAdmin(
    userUpdates: UpdateUserDto,
    authUser: Auth0UserType,
    id: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User was not found`);
    }
    return this.updateUser(user, userUpdates);
  }

  /**
   * Update information by the user at himself
   * @param {UpdateUserInfoDto} updateUserInfoDto
   * @param {Auth0UserType} authUser
   */
  async updateInfo(
    updateUserInfoDto: UpdateUserInfoDto,
    authUser: Auth0UserType,
  ): Promise<User> {
    const user = await this.getUserByAuth0Sub(authUser.sub, false);
    const updatedUser = { ...user, ...updateUserInfoDto };

    if (user.email !== updatedUser.email) {
      try {
        await this.managementService.updateUser(authUser.sub, {
          email: updatedUser.email,
        });
        await this.managementService.sendEmailVerification(authUser.sub);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('auth0ManagementService error: ', err.message);
        throw new ForbiddenException('Auth0 management error');
      }

      const { account, role } = await this.getUserByAuth0Sub(authUser.sub);
      if (role.name === OWNER_ROLE_NAME) {
        account.email = updateUserInfoDto.email;
        await this.accountRepository.save(account);
      }
    }

    return this.userRepository.save(updatedUser);
  }

  /**
   * Update user from company
   * @param {string} id
   * @param {Auth0UserType} authUser
   * @param {PartialOmitEntityProps<User>} param
   */
  async updateMember(
    id: string,
    authUser: Auth0UserType,
    param: UpdateUserDto,
  ): Promise<User> {
    const { account } = await this.getUserByAuth0Sub(authUser.sub);
    const user = await this.userRepository.findOne({
      where: { id, account: { id: account.id } },
      relations: { role: true },
    });
    if (!user) throw new NotFoundException(`User was not found`);
    return this.updateUser(user, param);
  }

  /**
   * Private function for update user with checking valid roles and status,
   * blocking operations with owner role
   * @param {User} user
   * @param {UpdateUserDto<User>} param
   * @private
   */
  private async updateUser(user: User, param: UpdateUserDto): Promise<User> {
    if (user.role.name === OWNER_ROLE_NAME)
      throw new BadRequestException(`owner can't be update`);
    if (param.roleName) {
      const role = await this.roleService.getRoleByName(param.roleName);
      delete param.roleName;
      user.role = role;
    }
    const updatedUser = Object.assign(user, param);
    await this.userRepository.save(updatedUser);
    return updatedUser;
  }

  async uploadAvatar(file: Express.Multer.File, token: string): Promise<User> {
    const profile = await this.authService.getProfile(token);
    const user = await this.userRepository.findOne({
      where: { authSub: profile.sub },
    });
    if (!user) {
      throw new NotFoundException(`User was not found`);
    }

    if (user.avatar) {
      await this.s3Service.removeObject(user.avatar);
    }

    const fileData: S3.ManagedUpload.SendData =
      await this.s3Service.uploadObject(file);

    const updatedData = Object.assign(user, { avatar: fileData.Location });
    // eslint-disable-next-line no-console
    console.log('******** updatedData', updatedData);
    await this.userRepository.save(updatedData);
    return updatedData;
  }

  async getAuditLogs(token: string) {
    const profile = await this.authService.getProfile(token);
    return this.managementService.getAuditLogs(profile.sub);
  }

  async getAdminProfile(profile: Auth0UserType): Promise<any> {
    try {
      const user = await this.getUserByAuth0Sub(profile.sub);
      if (user.role.name === ADMIN_ROLE_NAME) {
        return user;
      } else {
        throw new NotFoundException('Admin user was not found');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('getAdminProfile error', e);
    }
  }

  async createAdminProfile(profile: Auth0UserType): Promise<any> {
    //check user in database
    const user = await this.getAdminProfile(profile);
    if (user) {
      throw new NotFoundException('Admin user already exist');
    }

    //get user from Auth0
    const userFromAuth0: Auth0UserModel = await this.managementService.getUser(
      profile.sub,
    );
    if (!userFromAuth0) {
      throw new NotFoundException('The current user does not exist');
    }

    //check Auth0 user roles
    const roles = await this.managementService.getUserRoles(profile.sub);
    const isAdmin = !!roles.find(
      (item: Auth0Role) => item.name === ADMIN_ROLE_NAME,
    );
    if (!isAdmin) {
      throw new NotFoundException(
        'The current user does not have an administrator role',
      );
    }

    //get admin role from database
    const adminRole = await this.roleService.getRoleByName(ADMIN_ROLE_NAME);
    if (!adminRole) {
      throw new NotFoundException('Admin role does not exist');
    }

    //create admin user
    const adminUser = await this.createUser(
      profile.sub,
      userFromAuth0.email,
      userFromAuth0.name,
      adminRole,
      null,
    );

    try {
      await this.managementService.updateUser(profile.sub, {
        email_verified: true,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('auth0ManagementService error: ', err);
    }

    return adminUser;
  }

  /**
   * Get users by Id
   * @param {string[]} id
   */
  async getUsersById(id: string[]) {
    return await this.userRepository.find({
      select: ['id'],
      where: {
        id: In(id),
      },
    });
  }
}
