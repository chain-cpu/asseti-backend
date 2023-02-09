import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GetAuth0User } from '../../../decorators/auth0-user.decorator';
import { NotRegistered } from '../../../decorators/not-registered.decorator';
import { NotVerifiedEmail } from '../../../decorators/not-verified-email.decorator';
import { Auth0UserType } from '../../../types/auth0-user.type';
import { User } from '../user.entity';
import { UserService } from '../user.service';

@ApiTags('Admin')
@Controller('admin')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Create & get admin profile' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  async getAdminProfile(@GetAuth0User() authUser: Auth0UserType) {
    return this.userService.getAdminProfile(authUser);
  }

  @Get('create')
  @NotVerifiedEmail()
  @NotRegistered()
  @ApiOperation({ summary: 'Create & get admin profile' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  async createAdminProfile(@GetAuth0User() authUser: Auth0UserType) {
    return this.userService.createAdminProfile(authUser);
  }
}
