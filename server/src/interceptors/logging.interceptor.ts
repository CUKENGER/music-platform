import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();

    this.logger.log(`Incoming request: ${request.method} ${request.url}`);
    // this.logger.log(`Request headers: ${JSON.stringify(request.headers)}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(`Outgoing response: ${response.statusCode}`);
        // this.logger.log(`Response headers: ${JSON.stringify(response.getHeaders())}`);
        this.logger.log(`Request duration: ${duration}ms`);
      })
    );
  }
}
