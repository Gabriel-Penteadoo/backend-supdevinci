import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MESSAGE_REPOSITORY } from "./message.repository.interface";
import { ConversationEntity } from "../conversation/entities/conversation.entities";
import { CONVERSATION_REPOSITORY } from "../conversation/conversation.repository.interface";
import { ConversationRepository } from "../conversation/conversation.repository";
import { FirestoreMessageRepository } from "./message.firestore.repository";
import { JWTService } from "../auth/jwt.service";
import { JwtAuthGuard } from "../conversation/guards/conversation.guard";
@Module({
    imports: [TypeOrmModule.forFeature([
        ConversationEntity,
    ])],
    controllers: [MessageController],
    providers: [MessageService, 
        {provide: MESSAGE_REPOSITORY, useClass: FirestoreMessageRepository},
        {provide: CONVERSATION_REPOSITORY, useClass: ConversationRepository},
        JWTService,
        JwtAuthGuard,
    ],
    exports: [MessageService],
})
export class MessageModule {}