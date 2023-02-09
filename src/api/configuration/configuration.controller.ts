import { Controller, Get, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { FeatureService } from './feature/feature.service';
import { ADMIN_ROLE_NAME } from '../../configs/roles.config';
import { Auth0Role } from '../../core/models/auth0-role';
import { Auth0ManagementService } from '../../core/services/auth0-management.service';
import { Public } from '../../decorators/public.decorator';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';

@ApiTags('Configuration API')
@Controller('configuration')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class ConfigurationController {
  constructor(
    private readonly featureService: FeatureService,
    private readonly auth0ManagementService: Auth0ManagementService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Application config',
  })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request',
  })
  @Public()
  // @CheckPermissions([PermissionAction.Read, ObjectName.account]) todo read config for all users roles except admin
  async getAppConfig(@Headers('Authorization') token: any) {
    const featureFlags = await this.featureService.getAll();

    if (token) {
      const profile = await this.authService.getProfile(token);
      const roles = await this.auth0ManagementService.getUserRoles(profile.sub);
      const isAdmin = !!roles.find(
        (item: Auth0Role) => item.name === ADMIN_ROLE_NAME,
      );
      let isRegistered: boolean;
      try {
        const user = await this.userService.getUserByAuth0Sub(profile.sub);
        isRegistered = !!user;
      } catch (_) {
        isRegistered = false;
      }
      return {
        featureFlags,
        isAdmin,
        isRegistered,
      };
    }
    return { featureFlags };
  }
}
