import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as uuid from 'uuid';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name, { timestamp: true });

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.rambler.ru',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: parseInt(process.env.SMTP_PORT || '587', 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Error connecting to email server:', error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }

  generateActivationLinkAndExpires(): { activationLink: string; activationExpiresAt: Date } {
    const activationLink = uuid.v4();
    const activationExpiresAt = new Date();
    activationExpiresAt.setHours(activationExpiresAt.getHours() + 24);
    return {
      activationLink,
      activationExpiresAt,
    };
  }

  async sendActivationMail(to: string, link: string): Promise<void> {
    this.logger.log(`sendActivationMail:`, { service: 'MailService', mailTo: to });
    await this.transporter.sendMail({
      from: `"Note Vomit" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Активация аккаунта, Don`t reply',
      text: 'Please activate your account by clicking the link below.',
      html: `
        <div>
          <h1>To activate your account, click the link below:</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }

  async sendResetMail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Note Vomit" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Восстановление пароля на сайте MusicPlatform, Don`t reply',
      text: 'Please reset your password by clicking the link below.',
      html: `
        <div>
          <h1>To reset your password go to:</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
