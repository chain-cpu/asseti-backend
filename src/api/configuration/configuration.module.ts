import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationController } from './configuration.controller';
import { FeatureController } from './feature/feature.controller';
import { FeatureEntity } from './feature/feature.entity';
import { FeatureService } from './feature/feature.service';
import { Auth0ManagementService } from '../../core/services/auth0-management.service';
import { AuthService } from '../auth/auth.service';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [FeatureController, ConfigurationController],
  providers: [
    FeatureService,
    Auth0ManagementService,
    AuthService,
    ConfigService,
  ],
  imports: [TypeOrmModule.forFeature([FeatureEntity]), UserModule],
  exports: [FeatureService],
})
export class ConfigurationModule {}
