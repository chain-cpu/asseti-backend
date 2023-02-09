import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RiskScoreRequestDto } from '../../core/models/risk-score-request.dto';
import { RiskScoreService } from '../../core/services/risk-score.service';
import { CreateValidationPipe } from '../../pipes/create-validate.pipe';

@ApiTags('Risk Score API')
@ApiSecurity('AUTH0-TOKEN')
@ApiSecurity('API-KEY')
@Controller('risk-score')
export class RiskScoreController {
  constructor(private readonly riskScoreService: RiskScoreService) {}

  @Post('')
  @ApiOperation({ summary: 'Generate risk score' })
  @ApiResponse({ status: 200 })
  getRiskScore(
    @Body(new CreateValidationPipe()) riskScoreRequest: RiskScoreRequestDto,
  ) {
    return this.riskScoreService.calculateRiskScore(riskScoreRequest);
  }
}
