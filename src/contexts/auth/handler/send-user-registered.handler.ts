import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { AUTH_USER_REGISTERED_EVENT } from "../events/user-registered.event";
import { MailerService } from "src/core/mailer/mailer.service";
@Injectable()
export class SendUserRegisteredEventHandler {
    constructor(
        private readonly mailerService: MailerService
    ){}

    @OnEvent(AUTH_USER_REGISTERED_EVENT)
    async handle(payload: any){
        const registeredUser = payload?.payload ?? payload;
        const recipient = process.env.MAIL_USER ?? process.env.MAIL_FROM;

        if (!recipient) {
            throw new Error('MAIL_USER or MAIL_FROM must be set in .env to send registration notifications.');
        }

        await this.mailerService.send(
            recipient,
            'New user registration',
            `A new user was created.\nUsername: ${registeredUser?.username ?? 'unknown'}\nEmail: ${registeredUser?.email ?? 'unknown'}\nUser ID: ${registeredUser?.userId ?? 'unknown'}`
        );
    }
}