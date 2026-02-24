import { Injectable, Inject } from '@nestjs/common';
import { CONVERSATION_REPOSITORY, IConversationRepository } from './conversation.repository.interface';
import { UpdateConversationDTO } from './types/conversation.dto';
import { ConversationEntity } from './entities/conversation.entities';
import { ConversationNotFoundError, ConversationUnauthorizedError } from './errors/conversation.errors';

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: IConversationRepository
  ) {}

  async createConversation(title: string, userId: string): Promise<ConversationEntity> {
    const entity = await this.conversationRepository.createConversation();
    entity.name = title;
    entity.userId = userId;
    return this.conversationRepository.saveConversation(entity);
  }

  async getConversations(userId: string): Promise<ConversationEntity[]> {
    return this.conversationRepository.findConversationsByUserId(userId);
  }

  async findConversationById(id: string): Promise<any> {
    const entity = await this.conversationRepository.findConversationById(id);
    if(!entity) throw new ConversationNotFoundError({
        fields: {
            id: [id]
        }
    });
    return entity;
  }

  async updateConversation(body: UpdateConversationDTO, userId: string): Promise<any> {

    const entity = await this.conversationRepository.findConversationById(body.id)
    if(!entity) throw new ConversationNotFoundError({
        fields: {
            id: [body.id]
        }
    });
    entity.name = body.title
    if(entity.userId !== userId) throw new ConversationUnauthorizedError({
        fields: {
            id: [body.id]
        }
    });
    return this.conversationRepository.updateConversation(entity);
  }

  async deleteConversation(entity: any, userId: string): Promise<boolean> {
    const foundEntity = await this.conversationRepository.findConversationById(entity.id);
    if(!foundEntity) throw new ConversationNotFoundError({
        fields: {
            id: [entity.id]
        }
    });
    if(foundEntity.userId !== userId) throw new ConversationUnauthorizedError({
        fields: {
            id: [entity.id]
        }
    });
    await this.conversationRepository.deleteConversation(foundEntity);
    return true;
  }
}