import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CoreModule } from '../../core/core.module';
import { AuthModule } from '../auth/auth.module';
import { Company } from '../company/company.entity';
import { CompanyModule } from '../company/company.module';
import { Invite } from '../invites/invite.entity';
import { RolesModule } from '../roles/roles.module';
import { User } from '../users/user.entity';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    TypeOrmModule.forFeature([Account, User, Company, Invite]),
    AuthModule,
    UserModule,
    CompanyModule,
    CoreModule,
    RolesModule,
  ],
  exports: [AccountService],
})
export class AccountModule {}
