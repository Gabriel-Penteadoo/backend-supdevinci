import { Injectable, Inject } from '@nestjs/common';
import { MESSAGE_REPOSITORY, IMessageRepository, UploadedImageMetadata } from './message.repository.interface';
import { CONVERSATION_REPOSITORY, IConversationRepository } from '../conversation/conversation.repository.interface';
import { ConversationNotFoundError, ConversationUnauthorizedError } from '../conversation/errors/conversation.errors';
import { MessageDTO, MessageImageUploadDTO } from './types/message.dto';
import { MessageEntity } from './entities/message.entities';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private readonly messageRepository: IMessageRepository,
    @Inject(CONVERSATION_REPOSITORY) private readonly conversationRepository: IConversationRepository,
  ) {}

  async sendMessage(body: MessageDTO, userId: string): Promise<MessageEntity> {
    const conversation = await this.conversationRepository.findConversationById(body.conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError({
        fields: {
          conversationId: [body.conversationId],
        },
      });
    }

    if (conversation.userId !== userId) {
      throw new ConversationUnauthorizedError({
        fields: {
          conversationId: [body.conversationId],
        },
      });
    }

    const entity = await this.messageRepository.createMessage();
    entity.content = body.content;
    entity.conversationId = body.conversationId;
    entity.senderId = userId;

    return this.messageRepository.saveMessage(entity);
  }

  async getMessagesByConversation(conversationId: string, userId: string): Promise<MessageEntity[]> {
    const conversation = await this.conversationRepository.findConversationById(conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError({
        fields: {
          conversationId: [conversationId],
        },
      });
    }

    if (conversation.userId !== userId) {
      throw new ConversationUnauthorizedError({
        fields: {
          conversationId: [conversationId],
        },
      });
    }

    return this.messageRepository.findMessagesByConversationId(conversationId);
  }

  async uploadImageMessage(
    body: MessageImageUploadDTO,
    file: { buffer: Buffer; mimetype: string; originalname?: string; size: number },
    userId: string,
  ): Promise<MessageEntity & UploadedImageMetadata> {
    const conversation = await this.conversationRepository.findConversationById(body.conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError({
        fields: {
          conversationId: [body.conversationId],
        },
      });
    }

    if (conversation.userId !== userId) {
      throw new ConversationUnauthorizedError({
        fields: {
          conversationId: [body.conversationId],
        },
      });
    }

    const upload = await this.messageRepository.uploadMessageImage({
      buffer: file.buffer,
      mimeType: file.mimetype,
      conversationId: body.conversationId,
      senderId: userId,
      originalName: file.originalname,
    });

    const message = await this.messageRepository.createMessage();
    message.content = body.caption ?? '';
    message.conversationId = body.conversationId;
    message.senderId = userId;

    const enrichedMessage = message as MessageEntity & UploadedImageMetadata & { messageType: string };
    enrichedMessage.imagePath = upload.imagePath;
    enrichedMessage.imageUrl = upload.imageUrl;
    enrichedMessage.mimeType = upload.mimeType;
    enrichedMessage.size = file.size;
    enrichedMessage.messageType = 'image';

    await this.messageRepository.saveMessage(enrichedMessage);
    return enrichedMessage;
  }
}
