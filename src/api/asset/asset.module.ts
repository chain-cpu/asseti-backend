import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { AssetStateEntity } from './entities/asset-state.entity';
import { AssetEntity } from './entities/asset.entity';
import { apiConfig, awsConfig } from '../../configs';
import { UserModule } from '../users/user.module';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
  imports: [
    ConfigModule.forRoot({
      load: [apiConfig, awsConfig],
    }),
    UserModule,
    TypeOrmModule.forFeature([AssetEntity, AssetStateEntity]),
  ],
  exports: [AssetService],
})
export class AssetModule {}
