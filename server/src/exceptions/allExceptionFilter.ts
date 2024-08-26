import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError } from './api.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof ApiError) {
      return response.status(exception.status).json({
        statusCode: exception.status,
        message: exception.message,
        errors: exception.errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
