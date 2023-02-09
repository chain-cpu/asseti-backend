import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin/admin.controller';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CoreModule } from '../../core/core.module';
import { Account } from '../accounts/account.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UserController, AdminController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Account]),
    AuthModule,
    CoreModule,
    RolesModule,
  ],
  exports: [UserService],
})
export class UserModule {}
