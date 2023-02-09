import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { Auth0ManagementService } from '../../core/services/auth0-management.service';
import { EmailService } from '../../core/services/email.service';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [InvitesController],
  providers: [
    InvitesService,
    EmailService,
    ConfigService,
    Auth0ManagementService,
  ],
  imports: [
    TypeOrmModule.forFeature([Invite]),
    UserModule,
    AuthModule,
    RolesModule,
  ],
  exports: [InvitesService],
})
export class InvitesModule {}
