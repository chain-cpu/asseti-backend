import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Account } from '../accounts/account.entity';
import { AccountModule } from '../accounts/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), AccountModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
