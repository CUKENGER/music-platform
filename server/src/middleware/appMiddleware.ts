import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[${new Date().toISOString()}] Request URL: ${req.originalUrl}`);
    let responseData: any; // переменная для хранения данных ответа

    // Перехватываем функцию res.json()
    const originalJson = res.json;
    res.json = function (body) {
      responseData = body; // сохраняем данные ответа
      return originalJson.apply(this, arguments); // вызываем оригинальную функцию res.json()
    };

    // Логируем данные ответа после отправки ответа клиенту
    res.on('finish', () => {
      this.logger.log(`Response status: ${res.statusCode}`);
      this.logger.log(`Response data: ${JSON.stringify(responseData, null, 2)}`);
    });

    next();
  }
}