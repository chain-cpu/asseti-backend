import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import apiConfig from '../configs/api.config';
import { API_KEY_SKIPPED } from '../decorators/skip-api-key.decorator';
import { HashTransformer } from '../transformers/hash.transformer';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(apiConfig.KEY)
    private config: ConfigType<typeof apiConfig>,
    private reflector: Reflector,
  ) {}

  /**
   * @param {ExecutionContext} context
   */
  canActivate(context: ExecutionContext): boolean {
    /**
     * check @ApiKeySkipped() decorator
     */
    const isApiKeySkipped = this.reflector.getAllAndOverride<boolean>(
      API_KEY_SKIPPED,
      [context.getHandler(), context.getClass],
    );
    if (isApiKeySkipped) return true;

    const request: Request = context.switchToHttp().getRequest();
    const key = request.header('X-Api-Key');
    if (!key) throw new BadRequestException(`API Key required`);
    if (!HashTransformer.compare(key, this.config.getApiKeyHash()))
      throw new ForbiddenException(`API Key is invalid`);
    return true;
  }
}
