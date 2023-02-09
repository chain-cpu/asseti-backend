import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Express } from 'express';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { ObjectName, PermissionAction } from '../../core/models/casl-enums';
import { avatarFileFilter } from '../../core/services/file-helper.service';
import { CheckPermissions } from '../../decorators/permissions.decorator';
import { CreateValidationPipe } from '../../pipes/create-validate.pipe';
import { Account } from '../accounts/account.entity';

@ApiTags('Company')
@Controller('company')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get('/:id')
  @CheckPermissions([PermissionAction.Read, ObjectName.company])
  @ApiOperation({ summary: 'Get company' })
  @ApiResponse({ status: 200, type: Account })
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.companyService.findOne(id);
  }

  @Patch('/:id')
  @CheckPermissions([PermissionAction.Update, ObjectName.company])
  @ApiOperation({ summary: 'Update Company Info' })
  @ApiResponse({ status: 200, type: Company })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new CreateValidationPipe()) companyDto: CompanyDto,
    @Headers('Authorization') token: any,
  ) {
    return this.companyService.update(companyDto, token, id);
  }

  @Put('/:id/avatar')
  @CheckPermissions([PermissionAction.Update, ObjectName.company])
  @ApiOperation({ summary: 'Update Company Avatar' })
  @ApiResponse({ status: 200, type: Company })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: avatarFileFilter,
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async uploadAvatar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Company> {
    return await this.companyService.uploadAvatar(file, id);
  }

  @Delete('/:id/avatar')
  @CheckPermissions([PermissionAction.Update, ObjectName.company])
  @ApiOperation({ summary: 'Delete Company Avatar' })
  @ApiResponse({ status: 200, type: Company })
  async deleteAvatar(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Company> {
    return await this.companyService.deleteAvatar(id);
  }
}
