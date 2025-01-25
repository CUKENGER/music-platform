import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name, { timestamp: true })

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }

  generateActivationLinkAndExpires(): {activationLink: string, activationExpiresAt: Date} {
    const activationLink = uuid.v4();
    const activationExpiresAt = new Date();
    activationExpiresAt.setHours(activationExpiresAt.getHours() + 24);
    return {
      activationLink,
      activationExpiresAt
    }
  }

  async sendActivationMail(to: string, link: string): Promise<void> {
    this.logger.log(`sendActivationMail:`, { service: "MailService", mailTo: to })
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта, Don`t reply',
      text: '',
      html: `
        <div>
          <h1>To activate go to link</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }

  async sendResetMail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Восстановление пароля на сайте MusicPlatform, Don`t reply',
      text: '',
      html: `
        <div>
          <h1>To reset your password go to</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
