import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserPublicService } from './userPublic.service';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UserCleanupService {

  constructor(
    private readonly userPublicService: UserPublicService,
    private readonly logger: Logger,
  ) { }

  @Cron('0 0 * * *') // Запускаем каждый день в 00:00
  async deleteInactiveUsers() {
    this.logger.log('Starting cleanup: deleting expired inactive users...');

    const deletedCount = await this.userPublicService.deleteExpiredUsers();

    this.logger.log(`Deleted ${deletedCount} expired inactive users.`);
  }
}
