import { Module } from '@nestjs/common';
import { RiskScoreController } from './risk-score.controller';
import { CoreModule } from '../../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [RiskScoreController],
})
export class RiskScoreModule {}
