import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConversationEntity } from "./entities/conversation.entities";
import { Repository } from "typeorm";

@Injectable()
export class ConversationRepository {
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationRepository: Repository<ConversationEntity>,
    ) { }

    async createConversation(): Promise<ConversationEntity> {
        const entity = new ConversationEntity();
        return entity;
    }
    async saveConversation(entity: ConversationEntity): Promise<ConversationEntity> {
        return this.conversationRepository.save(entity);
    }

    async findConversationById(id: string): Promise<ConversationEntity | null> {
        const entity = await this.conversationRepository.findOne({ where: { id } });
        return entity;
    }

    async findConversationsByUserId(userId: string): Promise<ConversationEntity[]> {
        return this.conversationRepository.find({
            where: { userId },
            order: { createdAt: "DESC" },
        });
    }

    async updateConversation(entity: ConversationEntity): Promise<ConversationEntity> {
        return this.conversationRepository.save(entity);
    }

    async deleteConversation(entity: ConversationEntity): Promise<void> {
        await this.conversationRepository.remove(entity);
    }
}