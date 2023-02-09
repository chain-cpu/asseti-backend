import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import apiConfig from '../configs/api.config';

@Injectable()
export class RequestRefererMiddleware implements NestMiddleware {
  /**
   * Declare logger for request
   * @param {Request} request
   * @param {Response} response
   * @param {NextFunction} next
   */
  use(request: Request, response: Response, next: NextFunction): void {
    if (apiConfig().isProduction()) {
      const referer = request.get('Referer') || '';
      const defaultHttpRefererPolicy =
        apiConfig().getDefaultHttpRefererPolicy();
      if (defaultHttpRefererPolicy.length) {
        if (defaultHttpRefererPolicy.toString() === '*') return next();
        const isAllowed = apiConfig()
          .getDefaultHttpRefererPolicy()
          .map((policy) => referer.includes(policy))
          .find((element) => element === true);
        if (!isAllowed) {
          throw new ForbiddenException(`Request is not allowed`);
        }
      }
    }

    return next();
  }
}
