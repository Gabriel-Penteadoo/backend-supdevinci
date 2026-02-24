import { ConversationEntity } from "./entities/conversation.entities"

export const CONVERSATION_REPOSITORY = Symbol('CONVERSATION_REPOSITORY');

export interface IConversationRepository {
    createConversation(): Promise<ConversationEntity>;
    saveConversation(entity: ConversationEntity): Promise<ConversationEntity>;
    findConversationById(id: string): Promise<ConversationEntity | null>;
    findConversationsByUserId(userId: string): Promise<ConversationEntity[]>;
    updateConversation(entity: ConversationEntity): Promise<ConversationEntity>;
    deleteConversation(entity: ConversationEntity): Promise<void>;
}