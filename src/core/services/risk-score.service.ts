import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RiskScoreModel } from '../models/risk-score';
import { RiskScoreRequestDto } from '../models/risk-score-request.dto';

@Injectable()
export class RiskScoreService {
  private readonly apiURL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiURL = this.config.get('RISK_SCORE_API_URL');
  }

  async calculateRiskScore(
    data_parameters: RiskScoreRequestDto,
  ): Promise<RiskScoreModel> {
    const url = `${this.apiURL}risk/score/`;
    const method = 'POST';
    const data = {
      default_model: 'fixed', // Set
      data_source: 'parameterized',
      data_parameters,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const response = await this.httpService.axiosRef({
        url,
        method,
        data,
        headers,
      });

      return response.data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('risk score error', e);
      return null;
    }
  }
}
