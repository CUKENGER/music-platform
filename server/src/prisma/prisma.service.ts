import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('PrismaService: Подключение к базе данных успешно');
      console.log('PrismaService: Доступные модели:', Object.keys(this));
    } catch (e) {
      console.error('PrismaService: Ошибка подключения к базе данных:', e);
      throw e;
    }
  }
}
