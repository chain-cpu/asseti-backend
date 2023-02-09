import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { InviteUserDto } from './dto/invite-user.dto';
import { Invite } from './invite.entity';
import { InvitesService } from './invites.service';
import { ObjectName, PermissionAction } from '../../core/models/casl-enums';
import { NotRegistered } from '../../decorators/not-registered.decorator';
import { NotVerifiedEmail } from '../../decorators/not-verified-email.decorator';
import { CheckPermissions } from '../../decorators/permissions.decorator';

@ApiTags('Invite')
@Controller('invite')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get()
  @CheckPermissions([PermissionAction.Read, ObjectName.user])
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200 })
  getAll() {
    return this.invitesService.findAll();
  }

  @Get('/:id')
  @CheckPermissions([PermissionAction.Read, ObjectName.user])
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200 })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.invitesService.findOne(id);
  }

  @Post()
  @CheckPermissions([PermissionAction.Create, ObjectName.user])
  @ApiOperation({ summary: 'Invite team member' })
  @ApiResponse({ status: 201 })
  invite(
    @Body() inviteUserDto: InviteUserDto, //todo need to add pipe
    @Headers('Authorization') token: any,
  ): Promise<Invite> {
    return this.invitesService.invite(inviteUserDto, token);
  }

  @Post('activate')
  @NotVerifiedEmail()
  @NotRegistered()
  @ApiOperation({ summary: 'Activate team member' })
  @ApiResponse({ status: 201 })
  activate(@Headers('Authorization') token: any) {
    return this.invitesService.activate(token);
  }

  @Delete('/:id')
  @CheckPermissions([PermissionAction.Delete, ObjectName.user])
  @ApiOperation({ summary: 'Delete invite' })
  @ApiResponse({ status: 200, type: DeleteResult })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.invitesService.delete(id);
  }
}
