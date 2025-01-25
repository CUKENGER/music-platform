import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from './user.service';

@Injectable()
export class UserCleanupService {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(private readonly userService: UserService) {}

  @Cron('0 0 * * *') // Запускаем каждый день в 00:00
  async deleteInactiveUsers() {
    this.logger.log('Starting cleanup: deleting expired inactive users...');

    const deletedCount = await this.userService.deleteExpiredUsers();

    this.logger.log(`Deleted ${deletedCount} expired inactive users.`);
  }
}
