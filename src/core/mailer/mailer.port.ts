export const MAILER_SERVICE = Symbol('MAILER_SERVICE')

export interface MailerPort {
    send(to: string, subject: string, content: string): Promise<void>;
}