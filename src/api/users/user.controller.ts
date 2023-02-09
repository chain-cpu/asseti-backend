import {
  Controller,
  Delete,
  Get,
  Request,
  Param,
  ParseUUIDPipe,
  Patch,
  Body,
  Headers,
  Put,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpStatus,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import { DeleteResult } from 'typeorm';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserFilter } from './user.filter';
import { UserService } from './user.service';
import { UserSort } from './user.sort';
import { ADMIN_ROLE_NAME } from '../../configs/roles.config';
import { avatarFileFilter } from '../../core/services/file-helper.service';
import { ApiFilterQuery } from '../../decorators/api-filter-query.decorator';
import { GetAuth0User } from '../../decorators/auth0-user.decorator';
import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { CreateValidationPipe } from '../../pipes/create-validate.pipe';
import { PaginationLimitPipe } from '../../pipes/pagination-limit.pipe';
import { PaginationOffsetPipe } from '../../pipes/pagination-offset.pipe';
import { QueryFilterPipe } from '../../pipes/query-filter.pipe';
import { Auth0UserType } from '../../types/auth0-user.type';

@ApiTags('User')
@Controller('user')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(ADMIN_ROLE_NAME)
  @ApiOperation({ summary: 'Get users', description: 'Get users' })
  @ApiResponse({ status: HttpStatus.OK, type: GetUsersDto })
  @ApiFilterQuery('filter', UserFilter)
  @ApiFilterQuery('sort', UserSort)
  @UsePipes(QueryFilterPipe)
  async getAll(
    @Query('filter') filter?: UserFilter,
    @Query('sort') sort?: UserSort,
    @Query('offset') offset?: PaginationOffsetPipe,
    @Query('limit') limit?: PaginationLimitPipe,
  ) {
    return this.userService.list(filter, sort, offset, limit);
  }

  @Get('info')
  @ApiOperation({ summary: 'Get info from user token' })
  @ApiResponse({ status: 200 })
  getUserInfo(@Request() req) {
    return this.userService.getUserInfo(req);
  }

  @Get('id')
  @Public()
  @ApiOperation({ summary: 'Get user id from user token' })
  @ApiResponse({ status: 200 })
  getUserId(@Request() req) {
    return this.userService.getUserId(req);
  }

  @Get('audit-logs')
  //@CheckPermissions([PermissionAction.Read, ObjectName.user])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user auth0 audit logs',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  getAuditLogs(@Headers('Authorization') token: any) {
    return this.userService.getAuditLogs(token);
  }

  @Get('/:id')
  @Roles(ADMIN_ROLE_NAME)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: User })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Delete('/:id')
  @Roles(ADMIN_ROLE_NAME)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: DeleteResult })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.delete(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({ status: 200, type: User })
  async updateInfo(
    @Body(new CreateValidationPipe()) updateUserInfoDto: UpdateUserInfoDto,
    @GetAuth0User() authUser: Auth0UserType,
  ) {
    return this.userService.updateInfo(updateUserInfoDto, authUser);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update user status and role for admin' })
  @ApiResponse({ status: 200, type: User })
  @Roles(ADMIN_ROLE_NAME)
  async update(
    @Body(new CreateValidationPipe()) updateUserDto: UpdateUserDto,
    @GetAuth0User() authUser: Auth0UserType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.userService.updateFromAdmin(updateUserDto, authUser, id);
  }

  @Put('/avatar')
  @ApiOperation({ summary: 'Upload and update user avatar' })
  @ApiResponse({ status: 200, type: User })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: avatarFileFilter,
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async uploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') token: any,
  ): Promise<User> {
    return await this.userService.uploadAvatar(file, token);
  }
}
