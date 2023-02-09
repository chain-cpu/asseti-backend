import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UnsupportedMediaTypeException,
  UsePipes,
} from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AssetFilter } from './asset.filter';
import { AssetService } from './asset.service';
import { AssetSort } from './asset.sort';
import { MAX_FILE_UPLOAD_SIZE_BYTES } from './constants/file-upload.constant';
import { ApiFile } from './decorators/api-file.decorator';
import { CreateTags } from './decorators/create-tags.decorator';
import { AssignAssetDto } from './dto/assign-asset.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { GetAssetDto } from './dto/get-asset.dto';
import { GetAssetsDto } from './dto/get-assets.dto';
import { AssetStateEnum } from './enums/asset-state.enum';
import { FileDirectoryEnum } from './enums/file-directory.enum';
import { FileTagEnum } from './enums/file-tag.enum';
import { FileTypeEnum } from './enums/file-type.enum';
import { fileMimetypeFilter } from './filters/mime-type.filter';
import { ApiFilterQuery } from '../../decorators/api-filter-query.decorator';
import { GetAuth0User } from '../../decorators/auth0-user.decorator';
import { PaginationLimitPipe } from '../../pipes/pagination-limit.pipe';
import { PaginationOffsetPipe } from '../../pipes/pagination-offset.pipe';
import { QueryFilterPipe } from '../../pipes/query-filter.pipe';
import { Auth0UserType } from '../../types/auth0-user.type';
import { escapeFileName } from '../../utils/sanitizer';
import { UserService } from '../users/user.service';

@ApiTags('Assets Management API')
@Controller('asset')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add asset' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetAssetDto,
    description: 'Asset has been uploaded',
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
    status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    description: 'Invalid asset type',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access Forbidden',
  })
  @ApiFile('file', {
    limits: {
      fileSize: MAX_FILE_UPLOAD_SIZE_BYTES,
    },
    fileFilter: fileMimetypeFilter(
      ...[FileTypeEnum.DOCUMENT, FileTypeEnum.IMAGE],
    ),
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: FileUploadDto,
    @CreateTags() tags,
  ) {
    if (!file) throw new BadRequestException('No file for upload');
    const type = file.mimetype.split('/');
    if (!type) throw new UnsupportedMediaTypeException('Undefined file type');
    let directory;
    if (type[0] === FileTypeEnum.IMAGE) {
      directory = FileDirectoryEnum.IMAGES;
    }
    if (type[0] === FileTypeEnum.DOCUMENT) {
      directory = FileDirectoryEnum.DOCUMENTS;
    }
    const s3Tags = [...tags];
    s3Tags.push({
      Key: FileTagEnum.FILE_NAME,
      Value: escapeFileName(file.originalname),
    });
    s3Tags.push({
      Key: FileTagEnum.FILE_SIZE,
      Value: file.size.toString(),
    });
    s3Tags.push({
      Key: FileTagEnum.FILE_MIMETYPE,
      Value: file.mimetype.toString(),
    });

    const fileUpload = await this.assetService.uploadFile(
      directory,
      file.buffer,
      file.mimetype,
      s3Tags,
    );
    const { name, description } = payload;
    const { location, ...meta } = fileUpload;
    return await this.assetService.registerAsset({
      name,
      description,
      location,
      meta,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove asset by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No content',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access Forbidden',
  })
  @ApiParam({
    name: 'id',
    description: 'Asset Id',
    required: true,
    format: 'uuid',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async removeAsset(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    const asset = await this.assetService.getAsset(id);
    await this.assetService.deleteFile(asset.location);
    await this.assetService.unregisterAsset(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAssetDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access Forbidden',
  })
  @ApiParam({
    name: 'id',
    description: 'Asset Id',
    required: true,
    format: 'uuid',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async getAsset(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetAssetDto> {
    return await this.assetService.getAsset(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get assets list' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAssetsDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access Forbidden',
  })
  @ApiFilterQuery('filter', AssetFilter)
  @ApiFilterQuery('sort', AssetSort)
  @UsePipes(QueryFilterPipe)
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async getAssetsList(
    @Query('filter') filter?: AssetFilter,
    @Query('sort') sort?: AssetSort,
    @Query('offset') offset?: PaginationOffsetPipe,
    @Query('limit') limit?: PaginationLimitPipe,
  ): Promise<GetAssetsDto> {
    return await this.assetService.getAssetsList(filter, sort, offset, limit);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign/Reassign asset' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: GetAssetDto,
    description: 'Asset has been assigned to user: {id}',
  })
  @ApiParam({
    name: 'id',
    description: 'Asset Id',
    required: true,
    format: 'uuid',
  })
  @ApiBody({ type: AssignAssetDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input body',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with ${userId} was not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access Forbidden',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async assignAsset(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: AssignAssetDto,
  ) {
    const usersIds = !Array.isArray(payload.userId)
      ? [payload.userId]
      : payload.userId;
    const users = await this.userService.getUsersById(usersIds);
    if (users.length < 1)
      throw new NotFoundException(
        `Users with ${usersIds.join(',')} was not found`,
      );
    const asset = await this.assetService.getAsset(id);
    return await this.assetService.assignToUsers(asset, users);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update asset state by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Asset state has been updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access Forbidden',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Asset not found or undefined user has been passed',
  })
  @ApiParam({
    name: 'id',
    description: 'Asset Id',
    required: true,
    format: 'uuid',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async updateAssignedAsset(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetAuth0User() authUser: Auth0UserType,
  ) {
    const user = await this.userService.getUserByAuth0Sub(authUser.sub);
    const asset = await this.assetService.getAssignedAsset(id, user);
    if (!user || !asset)
      throw new NotFoundException(
        'Asset not found or undefined user has been passed',
      );
    let status;
    switch (asset.status) {
      case AssetStateEnum.NOT_ACCEPTED:
        status = AssetStateEnum.ACCEPTED;
        break;
      case AssetStateEnum.ACCEPTED:
        status = AssetStateEnum.ACCEPTED_UPDATED_VERSION;
        break;
      default:
        status = AssetStateEnum.ACCEPTED_UPDATED_VERSION;
    }
    await this.assetService.changeAssetState(asset.id, status);
    return this.userService.findOne(user.id);
  }
}
