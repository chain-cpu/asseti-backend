import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth0ManagementService } from './services/auth0-management.service';
import { CaslService } from './services/casl.service';
import { EmailService } from './services/email.service';
import { PipeDriveService } from './services/pipedrive.service';
import { RiskScoreService } from './services/risk-score.service';
import { S3Service } from './services/s3.service';
import { SurveyService } from './services/survey.service';
import { RolesModule } from '../api/roles/roles.module';

@Module({
  imports: [HttpModule, RolesModule],
  providers: [
    ConfigService,
    EmailService,
    SurveyService,
    S3Service,
    PipeDriveService,
    CaslService,
    RiskScoreService,
    Auth0ManagementService,
  ],
  exports: [
    EmailService,
    SurveyService,
    S3Service,
    PipeDriveService,
    CaslService,
    RiskScoreService,
    Auth0ManagementService,
  ],
})
export class CoreModule {}
