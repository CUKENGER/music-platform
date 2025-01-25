// import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { ApiError } from './api.error';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     if (exception instanceof ApiError) {
//       return response.status(exception.status).json({
//         statusCode: exception.status,
//         message: exception.message,
//         errors: exception.errors,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }

//     const status = exception instanceof HttpException ? exception.getStatus() : 500;

//     response.status(status).json({
//       statusCode: status,
//       message: exception.message || 'Internal Server Error',
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }

// import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
// import { Logger } from 'nestjs-pino';
// import { ApiError } from './api.error';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   constructor(private readonly logger: Logger) { }

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const response = exception.getResponse();

//       message = typeof response === 'string' ? response : JSON.stringify(response);
//     }

//     if (exception instanceof ApiError) {
//       status = exception.status;
//       message = exception.message;

//       return response.status(status).json({
//         statusCode: status,
//         message: message,
//         errors: exception.errors,
//       });
//     }

//     this.logger.error({
//       message: 'Unhandled Exception',
//       error: message,
//       method: request.method,
//       url: request.url,
//       body: request.body,
//     });

//     response.status(status).json({ statusCode: status, message });
//   }
// }

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ApiError } from './api.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) { }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      message = typeof response === 'string' ? response : JSON.stringify(response);
    }

    if (exception instanceof ApiError) {
      status = exception.status;
      message = exception.message;
      errors = exception.errors;
    }

    this.logger.error({
      message: 'Unhandled Exception',
      error: message,
      stack: exception instanceof Error ? exception.stack : null, // Логируем стек вызовов
      method: request.method,
      url: request.url,
      body: this.sanitizeRequestBody(request.body), // Санкционируем тело запроса
    });

    const responseBody = {
      statusCode: status,
      message,
      ...(errors && { errors }), // Добавляем errors, если они есть
    };

    response.status(status).json(responseBody);
  }

  private sanitizeRequestBody(body: Record<string, unknown>): Record<string, unknown> {
    // Скрываем чувствительные данные
    const sensitiveFields = ['password', 'creditCardNumber'];
    const sanitizedBody = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '***REDACTED***';
      }
    });

    return sanitizedBody;
  }
}