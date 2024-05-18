import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request URL: ${req.originalUrl}`);
    let responseData: any; // переменная для хранения данных ответа

    // Перехватываем функцию res.json()
    const originalJson = res.json;
    res.json = function (body) {
      responseData = body; // сохраняем данные ответа
      return originalJson.apply(this, arguments); // вызываем оригинальную функцию res.json()
    };

    // Логируем данные ответа после отправки ответа клиенту
    res.on('finish', () => {
      console.log(`Response status: ${res.statusCode}`);
      console.log(`Response data: ${JSON.stringify(responseData)}`);
    });

    next();
  }
}