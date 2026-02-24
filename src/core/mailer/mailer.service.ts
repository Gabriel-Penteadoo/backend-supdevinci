import { Injectable } from "@nestjs/common";
import { MailerPort } from "./mailer.port";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService implements MailerPort {
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor() {
    const host = process.env.MAIL_HOST ?? 'smtp.gmail.com';
    const port = Number(process.env.MAIL_PORT ?? 465);
    const secure = (process.env.MAIL_SECURE ?? 'true') === 'true';
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASSWORD?.replace(/\s+/g, '');

    if (!user || !pass) {
      throw new Error('MAIL_USER and MAIL_PASSWORD must be set in .env');
    }

    this.fromAddress = process.env.MAIL_FROM ?? user;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });
  }

  async send(to: string, subject: string, content: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject,
      text: content
    });
  }
}