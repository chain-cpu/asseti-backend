import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as ExceptionFilterInterface,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request, Response } from 'express';

import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';

import apiConfig from '../../configs/api.config';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from '../interfaces/exception-response.interface';

@Catch()
export class ExceptionFilter<T = any> implements ExceptionFilterInterface<T> {
  constructor(
    @Inject(apiConfig.KEY)
    private config: ConfigType<typeof apiConfig>,
  ) {}

  /**
   * Exception filter
   * @param {any} exception
   * @param {ArgumentsHost} host
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let code = !('code' in exception) ? 'HttpException' : exception.code;
    let status: number;
    let message = exception?.message;
    const stack: string = exception?.stack;
    const logger = new Logger(code);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        (errorResponse as HttpExceptionResponse).message || exception.message;
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as QueryFailedError).message;
      code = (exception as any).code;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as EntityNotFoundError).message;
      code = (exception as any).code;
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as CannotCreateEntityIdMapError).message;
      code = (exception as any).code;
    } else {
      status = exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    }
    const errorResponse = this.getErrorResponse(
      status,
      message,
      code,
      stack,
      request,
    );
    logger.error(errorResponse);
    response.status(status).json(errorResponse);
  }

  /**
   * Generate error response
   * @param {HttpStatus} status
   * @param {string} message
   * @param {string} code
   * @param {string} stack
   * @param {Request} request
   */
  private getErrorResponse = (
    status: HttpStatus,
    message: string,
    code: string,
    stack: string,
    request: Request,
  ): CustomHttpExceptionResponse => {
    return this.config.isProduction()
      ? {
          status,
          message,
        }
      : {
          status,
          message,
          code,
          stack,
          path: request.url,
          method: request.method,
          headers: request.headers,
          timestamp: new Date(),
        };
  };
}
