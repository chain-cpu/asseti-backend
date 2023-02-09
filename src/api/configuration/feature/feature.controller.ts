import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
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
import { AddFeatureDto } from './dto/add-feature.dto';
import { EditFeatureDto } from './dto/edit-feature.dto';
import { GetFeatureDto } from './dto/get-feature.dto';
import { GetFeaturesDto } from './dto/get-features.dto';
import { FeatureService } from './feature.service';
import { GetAuth0User } from '../../../decorators/auth0-user.decorator';
import { CreateValidationPipe } from '../../../pipes/create-validate.pipe';
import { Auth0UserType } from '../../../types/auth0-user.type';

@ApiTags('Configuration API')
@Controller('configuration/feature')
@ApiSecurity('AUTH0-TOKEN')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add feature property',
  })
  @ApiBody({ type: AddFeatureDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AddFeatureDto,
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
    description: 'Feature has already being added',
  })
  // @CheckPermissions([PermissionAction.Create, ObjectName.all])
  async addFeatureProperty(
    @GetAuth0User() authUser: Auth0UserType,
    @Body(new CreateValidationPipe()) payload: AddFeatureDto,
  ) {
    return await this.featureService.add(payload);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get features properties',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFeaturesDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async getFeatureProperties() {
    return await this.featureService.list();
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Edit feature property',
  })
  @ApiParam({
    name: 'id',
    required: true,
    format: 'uuid',
  })
  @ApiBody({ type: EditFeatureDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetFeatureDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  // @CheckPermissions([PermissionAction.Read, ObjectName.account])
  async editFeatureProperty(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new CreateValidationPipe()) payload: EditFeatureDto,
  ) {
    await this.featureService.updateById(id, payload);
    return this.featureService.getById(id);
  }
}
