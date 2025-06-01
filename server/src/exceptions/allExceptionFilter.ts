import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ApiError } from './api.error';
import { ERROR_CODES, ErrorCodeType } from 'constants/errorCodes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: ErrorCodeType = ERROR_CODES.INTERNAL_SERVER_ERROR;
    let errors: unknown = null;

    if (exception instanceof ApiError) {
      status = exception.status;
      message = exception.message;
      code = exception.code; // Используем code из ApiError
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string' ? exceptionResponse : (
          (exceptionResponse as any).message || message
        );
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error({
      message: 'Unhandled Exception',
      error: message,
      code,
      stack: exception instanceof Error ? exception.stack : null,
      method: request.method,
      url: request.url,
      body: this.sanitizeRequestBody(request.body),
    });

    const responseBody = {
      statusCode: status,
      message,
      code,
      ...(errors && typeof errors === 'object' ? { errors } : {}),
    };

    response.status(status).json(responseBody);
  }

  private sanitizeRequestBody(body: Record<string, unknown>): Record<string, unknown> {
    // Скрываем чувствительные данные
    const sensitiveFields = ['password', 'creditCardNumber'];
    const sanitizedBody = { ...body };

    sensitiveFields.forEach((field) => {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '***REDACTED***';
      }
    });

    return sanitizedBody;
  }
}
