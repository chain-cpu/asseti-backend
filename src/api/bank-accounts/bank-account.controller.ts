import {
  Body,
  Controller,
  Param,
  Post,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { BankAccountService } from './bank-account.service';
import { AddBankAccountDto } from './dto/add-bank-account.dto';
import { EditBankAccountDto } from './dto/edit-bank-account.dto';
import { GetBankAccountDto } from './dto/get-bank-account.dto';
import { GetAuth0User } from '../../decorators/auth0-user.decorator';
import { CreateValidationPipe } from '../../pipes/create-validate.pipe';
import { Auth0UserType } from '../../types/auth0-user.type';
import { UserService } from '../users/user.service';

@ApiTags('Bank Account API')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
@Controller('account/bank')
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add bank account',
  })
  @ApiBody({ type: AddBankAccountDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AddBankAccountDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input body',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Bank account has already being added',
  })
  // @CheckPermissions([PermissionAction.Create, ObjectName.all])
  async addBankAccount(
    @GetAuth0User() authUser: Auth0UserType,
    @Body(new CreateValidationPipe()) payload: AddBankAccountDto,
  ) {
    const { account } = await this.userService.getUserByAuth0Sub(authUser.sub);
    if (account) {
      return await this.bankAccountService.add(payload, account);
    }
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Edit bank account by Id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiBody({ type: EditBankAccountDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBankAccountDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async editBankAccountById(
    @GetAuth0User() authUser: Auth0UserType,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new CreateValidationPipe()) payload: EditBankAccountDto,
  ) {
    const { account } = await this.userService.getUserByAuth0Sub(authUser.sub);
    if (account) {
      return await this.bankAccountService.update(id, account, payload);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all bank accounts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetBankAccountDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  // @CheckPermissions([PermissionAction.Create, ObjectName.all])
  async getBankAccounts(@GetAuth0User() authUser: Auth0UserType) {
    const { account } = await this.userService.getUserByAuth0Sub(authUser.sub);
    if (account) {
      return await this.bankAccountService.findAllByAccount(account);
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get bank account by Id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetBankAccountDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async getBankAccountById(
    @GetAuth0User() authUser: Auth0UserType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const { account } = await this.userService.getUserByAuth0Sub(authUser.sub);
    if (account) {
      return await this.bankAccountService.findByAccountAndId(id, account);
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete bank account by Id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async deleteBankAccountById(
    @GetAuth0User() authUser: Auth0UserType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const { account } = await this.userService.getUserByAuth0Sub(authUser.sub);
    if (account) {
      return await this.bankAccountService.delete(id, account);
    }
  }
}
