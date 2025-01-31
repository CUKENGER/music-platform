import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ApiError } from 'exceptions/api.error';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PasswordService {
  constructor(
    private readonly logger: Logger
  ) { }

  private async generateSalt(): Promise<string> {
    this.logger.log(`PasswordService generateSalt`);
    return await bcrypt.genSalt(10);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    this.logger.log(`PasswordService hashPassword`);
    return await bcrypt.hash(password, salt);
  }

  private validatePasswordComplexity(password: string): void {
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    console.log(/\d/.test('Bakin2004')); // Должно быть true
    console.log(/\d/.test('BakinABCD')); // Должно быть false
    this.logger.log(`PasswordService validatePasswordComplexity, pass:${password}`, {
      hasNumber: hasNumber,
      minLength: minLength,
    });
    if (password.length < minLength || !hasNumber) {
      throw ApiError.BadRequest('Password must be at least 8 characters long, contain a number');
    }
  }

  async validatePassword(password: string, storedPassword: string): Promise<void> {
    this.logger.log(`PasswordService validatePassword`);
    const isEquals = await bcrypt.compare(password, storedPassword);
    if (!isEquals) {
      throw ApiError.BadRequest('The provided password is incorrect');
    }
  }

  async generatePassword(password: string): Promise<string> {
    this.validatePasswordComplexity(password);
    const salt = await this.generateSalt();
    const hashedPassword = await this.hashPassword(password, salt);
    return hashedPassword;
  }
}
