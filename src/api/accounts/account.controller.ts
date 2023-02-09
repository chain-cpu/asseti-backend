import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { Account } from './account.entity';
import { AccountFilter } from './account.filter';
import { AccountService } from './account.service';
import { AccountSort } from './account.sort';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetAccountDto } from './dto/get-account.dto';
import { ADMIN_ROLE_NAME } from '../../configs/roles.config';
import { ObjectName, PermissionAction } from '../../core/models/casl-enums';
import { ApiFilterQuery } from '../../decorators/api-filter-query.decorator';
import { GetAuth0User } from '../../decorators/auth0-user.decorator';
import { NotRegistered } from '../../decorators/not-registered.decorator';
import { NotVerifiedEmail } from '../../decorators/not-verified-email.decorator';
import { CheckPermissions } from '../../decorators/permissions.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { CreateValidationPipe } from '../../pipes/create-validate.pipe';
import { PaginationLimitPipe } from '../../pipes/pagination-limit.pipe';
import { PaginationOffsetPipe } from '../../pipes/pagination-offset.pipe';
import { QueryFilterPipe } from '../../pipes/query-filter.pipe';
import { Auth0UserType } from '../../types/auth0-user.type';
import { GetFeaturesDto } from '../configuration/feature/dto/get-features.dto';
import { GetUsersDto } from '../users/dto/get-users.dto';
import {
  UpdateUserRoleDto,
  UpdateUserStatusDto,
} from '../users/dto/update-user.dto';
import { User } from '../users/user.entity';
import { UserFilter } from '../users/user.filter';
import { UserService } from '../users/user.service';
import { UserSort } from '../users/user.sort';

@ApiTags('Account API')
@Controller('account')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(ADMIN_ROLE_NAME)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all accounts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFeaturesDto,
  })
  @ApiFilterQuery('filter', AccountFilter)
  @ApiFilterQuery('sort', AccountSort)
  @UsePipes(QueryFilterPipe)
  async getAll(
    @Query('filter') filter?: AccountFilter,
    @Query('sort') sort?: AccountSort,
    @Query('offset') offset?: PaginationOffsetPipe,
    @Query('limit') limit?: PaginationLimitPipe,
  ) {
    return await this.accountService.list(filter, sort, offset, limit);
  }

  @Get('/member')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all account's members",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUsersDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @ApiFilterQuery('filter', UserFilter)
  @ApiFilterQuery('sort', UserSort)
  @UsePipes(QueryFilterPipe)
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async getMembers(
    @GetAuth0User() authUser: Auth0UserType,
    @Query('filter') filter?: UserFilter,
    @Query('sort') sort?: UserSort,
    @Query('offset') offset?: PaginationOffsetPipe,
    @Query('limit') limit?: PaginationLimitPipe,
  ) {
    const { account } = await this.userService.getUserByAuth0Sub(authUser.sub);
    return await this.accountService.memberList(
      account.id,
      filter,
      sort,
      offset,
      limit,
    );
  }

  /**
   * Update account member role
   * valid roles in ValidRolesForUserUpdate enum
   * permission => user/update
   * @param {string} id
   * @param {Auth0UserType} authUser
   * @param {UpdateUserRoleDto} params
   */
  @Put('/member/role/:id')
  @CheckPermissions([PermissionAction.Update, ObjectName.user])
  @ApiOperation({
    summary: "Update account's member role",
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ description: 'role must be a valid enum value' })
  @ApiBadRequestResponse({ description: `owner can't be update` })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async editMemberRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetAuth0User() authUser: Auth0UserType,
    @Body() params: UpdateUserRoleDto,
  ) {
    return await this.userService.updateMember(id, authUser, {
      roleName: params.roleName,
    });
  }

  /**
   * Update account member status
   * valid statuses in ValidStatusesForUserUpdate enum
   * permission => user/update
   * @param {string} id
   * @param {Auth0UserType} authUser
   * @param {UpdateUserStatusDto} params
   */
  @Put('/member/status/:id')
  @CheckPermissions([PermissionAction.Update, ObjectName.user])
  @ApiOperation({
    summary: "Update account's member status",
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({ description: 'status must be a valid enum value' })
  @ApiBadRequestResponse({ description: `owner can't be update` })
  @ApiNotFoundResponse({ description: 'User was not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async editMemberStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetAuth0User() authUser: Auth0UserType,
    @Body() params: UpdateUserStatusDto,
  ) {
    return await this.userService.updateMember(id, authUser, {
      status: params.status,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get account by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAccountDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @CheckPermissions([PermissionAction.Read, ObjectName.account])
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.accountService.findOne(id);
  }

  @Post()
  @NotVerifiedEmail()
  @NotRegistered()
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({ status: 200, type: Account })
  create(
    @Body(new CreateValidationPipe()) createAccountDto: CreateAccountDto,
    @Headers('Authorization') token: any,
  ) {
    return this.accountService.create(createAccountDto, token);
  }

  @Delete('/:id')
  @CheckPermissions([PermissionAction.Delete, ObjectName.account])
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 200, type: DeleteResult })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.accountService.delete(id);
  }
}
