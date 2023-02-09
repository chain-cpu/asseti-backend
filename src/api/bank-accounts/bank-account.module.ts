import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountController } from './bank-account.controller';
import { BankAccountEntity } from './bank-account.entity';
import { BankAccountService } from './bank-account.service';
import { CoreModule } from '../../core/core.module';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService],
  imports: [
    TypeOrmModule.forFeature([BankAccountEntity]),
    CoreModule,
    UserModule,
  ],
  exports: [BankAccountService],
})
export class BankAccountModule {}
