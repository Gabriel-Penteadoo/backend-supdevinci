import { Inject, Injectable } from '@nestjs/common';
import { FIRESTORE_DB } from 'src/core/firestore/firestore.module';
import { Firestore, Timestamp } from 'firebase-admin/firestore';
import { MessageEntity } from './entities/message.entities';
import { IMessageRepository } from './message.repository.interface';
import { ConfigService } from '@nestjs/config';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreMessageRepository implements IMessageRepository {
  constructor(
    @Inject(FIRESTORE_DB)
    private readonly firestore: Firestore,
    private readonly configService: ConfigService,
  ) {}

  async createMessage(): Promise<MessageEntity> {
    return new MessageEntity();
  }

  async saveMessage(entity: MessageEntity): Promise<MessageEntity> {
    const messageId = entity.id ?? this.firestore.collection('messages').doc().id;
    const createdAt = entity.createdAt ?? new Date();

    await this.firestore.collection('messages').doc(messageId).set({
      content: entity.content,
      senderId: entity.senderId,
      conversationId: entity.conversationId,
      imagePath: (entity as any).imagePath ?? null,
      imageUrl: (entity as any).imageUrl ?? null,
      mimeType: (entity as any).mimeType ?? null,
      size: (entity as any).size ?? null,
      messageType: (entity as any).messageType ?? 'text',
      createdAt: Timestamp.fromDate(createdAt),
    });

    entity.id = messageId;
    entity.createdAt = createdAt;

    return entity;
  }

  async findMessagesByConversationId(conversationId: string): Promise<MessageEntity[]> {
    const snapshot = await this.firestore
      .collection('messages')
      .where('conversationId', '==', conversationId)
      .orderBy('createdAt', 'asc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const message = new MessageEntity();
      message.id = doc.id;
      message.content = data.content;
      message.senderId = data.senderId;
      message.conversationId = data.conversationId;
      message.createdAt = data.createdAt?.toDate?.() ?? new Date();
      (message as any).imagePath = data.imagePath ?? null;
      (message as any).imageUrl = data.imageUrl ?? null;
      (message as any).mimeType = data.mimeType ?? null;
      (message as any).size = data.size ?? null;
      (message as any).messageType = data.messageType ?? 'text';
      return message;
    });
  }

  async uploadMessageImage(input: {
    buffer: Buffer;
    mimeType: string;
    conversationId: string;
    senderId: string;
    originalName?: string;
  }): Promise<{ imagePath: string; imageUrl: string; mimeType: string; size: number }> {
    const appOptions = admin.app().options;
    const projectId = (appOptions.projectId as string | undefined) ?? this.configService.get<string>('FIREBASE_PROJECT_ID');
    const bucketName =
      this.configService.get<string>('FIREBASE_STORAGE_BUCKET') ??
      (appOptions.storageBucket as string | undefined) ??
      (projectId ? `${projectId}.appspot.com` : undefined);

    if (!bucketName) {
      throw new Error('Firebase Storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET in .env');
    }

    const bucket = getStorage().bucket(bucketName);

    const sanitizedName = (input.originalName ?? 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    const imagePath = `messages/${input.conversationId}/${Date.now()}_${sanitizedName}`;
    const file = bucket.file(imagePath);

    await file.save(input.buffer, {
      metadata: {
        contentType: input.mimeType,
      },
      resumable: false,
    });

    const [imageUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return {
      imagePath,
      imageUrl,
      mimeType: input.mimeType,
      size: input.buffer.length,
    };
  }
}
