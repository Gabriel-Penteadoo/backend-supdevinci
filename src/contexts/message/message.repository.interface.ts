import { MessageEntity } from "./entities/message.entities"

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');

export type UploadedImageMetadata = {
    imagePath: string;
    imageUrl: string;
    mimeType: string;
    size: number;
};

export interface IMessageRepository {
    createMessage(): Promise<MessageEntity>;
    saveMessage(entity: MessageEntity): Promise<MessageEntity>;
    findMessagesByConversationId(conversationId: string): Promise<MessageEntity[]>;
    uploadMessageImage(input: {
        buffer: Buffer;
        mimeType: string;
        conversationId: string;
        senderId: string;
        originalName?: string;
    }): Promise<UploadedImageMetadata>;
}