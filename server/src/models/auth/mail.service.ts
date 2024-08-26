import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  // constructor() {
  //   this.transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     host: process.env.SMTP_HOST,
  //     port: parseInt(process.env.SMTP_PORT, 10),
  //     secure: false,
  //     logger: true,
  //     debug: true,
  //     secureConnection: false,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_APP_PASS,
  //     },
  //     tls: {
  //       rejectUnauthorized: true,
  //     },
  //   });
  // }

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

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на твоем сайте',
      text: '',
      html: `
        <div>
          <h1>To activate go to link</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}
