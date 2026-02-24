import { Global, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MAILER_SERVICE } from "./mailer.port";
import { MailerService } from "./mailer.service";


@Global()
@Module({
    providers: [MailerService], // Utilise la classe directement comme token
    exports: [MailerService]
})
export class MailerModule {}