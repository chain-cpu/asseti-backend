import { Controller, Get, HttpStatus, Inject, Header } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { register } from 'prom-client';
import apiConfig from './configs/api.config';
import { Public } from './decorators/public.decorator';
import { ApiKeySkipped } from './decorators/skip-api-key.decorator';

@ApiTags('Service API')
@Controller()
export class AppController {
  constructor(
    @Inject(apiConfig.KEY)
    private config: ConfigType<typeof apiConfig>,
  ) {}
  @Get('/')
  @Public()
  @ApiKeySkipped()
  @ApiOperation({ summary: 'Application health check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get application info',
  })
  getHealth(): object {
    return {
      application: this.config.getName(),
      version: this.config.getVersion(),
      environment: this.config.getEnvironment(),
      serverTime: new Date().toISOString(),
    };
  }

  @Get('/metrics')
  @Public()
  @ApiKeySkipped()
  @Header('Content-Type', register.contentType)
  @ApiOperation({ summary: 'Application metrics for external monitoring tool' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get application metrics',
  })
  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
