import { BadRequestException, Body, Controller, ForbiddenException, Get, Headers, HttpCode, HttpStatus, InternalServerErrorException, Post, UnauthorizedException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MailerService } from './core/mailer/mailer.service';
import { AuthService } from './contexts/auth/auth.service';
import { ConversationService } from './contexts/conversation/conversation.service';
import { MessageService } from './contexts/message/message.service';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';

const MAX_DEV_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_DEV_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('mail/test')
  async sendTestMail(
    @Body() body: { to?: string; subject?: string; content?: string },
  ): Promise<{ success: boolean; to: string }> {
    const to = body?.to ?? process.env.MAIL_USER;
    const subject = body?.subject ?? 'Test email from backend-supdevinci';
    const content = body?.content ?? 'This is a test email sent from your NestJS app.';

    if (!to) {
      throw new InternalServerErrorException('No recipient configured. Set MAIL_USER or provide "to" in request body.');
    }

    try {
      await this.mailerService.send(to, subject, content);
      return { success: true, to };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send test email. Check Gmail SMTP credentials in .env');
    }
  }

  @Post('dev/seed')
  async seedDevData(
    @Body()
    body: {
      users?: number;
      conversationsPerUser?: number;
      messagesPerConversation?: number;
    },
    @Headers('x-seed-key') seedKey?: string,
  ): Promise<{
    usersCreated: number;
    conversationsCreated: number;
    messagesCreated: number;
  }> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Seeding is disabled in production.');
    }

    const requiredSeedKey = process.env.SEED_KEY;
    if (requiredSeedKey && seedKey !== requiredSeedKey) {
      throw new UnauthorizedException('Invalid x-seed-key header.');
    }

    const users = this.clamp(body?.users ?? 3, 1, 20);
    const conversationsPerUser = this.clamp(body?.conversationsPerUser ?? 2, 1, 20);
    const messagesPerConversation = this.clamp(body?.messagesPerConversation ?? 5, 1, 50);

    const runId = Date.now();
    let usersCreated = 0;
    let conversationsCreated = 0;
    let messagesCreated = 0;

    for (let userIndex = 0; userIndex < users; userIndex++) {
      const email = `seed.${runId}.${userIndex}@example.com`;
      const password = `SeedPass!${userIndex}Aa9`;
      const username = `seed_user_${runId}_${userIndex}`;

      await this.authService.register({ email, password, username });
      const login = (await this.authService.login({ email, password })) as any;
      const accessToken = login?.acces_token;
      const payload = jwt.decode(accessToken) as any;
      const userId = payload?.userCredentials?.id;

      if (!userId) {
        throw new InternalServerErrorException('Cannot extract user id from seed login token.');
      }

      usersCreated++;

      for (let conversationIndex = 0; conversationIndex < conversationsPerUser; conversationIndex++) {
        const conversation = await this.conversationService.createConversation(
          `Seed conversation ${userIndex + 1}-${conversationIndex + 1}`,
          userId,
        );
        conversationsCreated++;

        for (let messageIndex = 0; messageIndex < messagesPerConversation; messageIndex++) {
          await this.messageService.sendMessage(
            {
              content: `Seed message ${messageIndex + 1} from user ${userIndex + 1}`,
              conversationId: conversation.id,
            },
            userId,
          );
          messagesCreated++;
        }
      }
    }

    return { usersCreated, conversationsCreated, messagesCreated };
  }

  @Post('dev/test-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: MAX_DEV_IMAGE_SIZE_BYTES },
      fileFilter: (req, file, callback) => {
        if (!ALLOWED_DEV_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          callback(new BadRequestException('Only jpeg, png, and webp images are allowed'), false);
          return;
        }

        callback(null, true);
      },
    }),
  )
  async uploadDevTestImage(
    @UploadedFile() file: any,
    @Body() body: { note?: string },
    @Headers('x-seed-key') seedKey?: string,
  ): Promise<{
    success: boolean;
    imagePath: string;
    imageUrl: string;
    mimeType: string;
    size: number;
    note: string | null;
  }> {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Dev image upload is disabled in production.');
    }

    const requiredSeedKey = process.env.SEED_KEY;
    if (requiredSeedKey && seedKey !== requiredSeedKey) {
      throw new UnauthorizedException('Invalid x-seed-key header.');
    }

    if (!file) {
      throw new BadRequestException('Image file is required (form-data field: image)');
    }

    const appOptions = admin.app().options;
    const projectId = (appOptions.projectId as string | undefined) ?? process.env.FIREBASE_PROJECT_ID;
    const bucketName =
      process.env.FIREBASE_STORAGE_BUCKET ??
      (appOptions.storageBucket as string | undefined) ??
      (projectId ? `${projectId}.appspot.com` : undefined);

    if (!bucketName) {
      throw new InternalServerErrorException('Firebase Storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET in .env');
    }

    const bucket = getStorage().bucket(bucketName);

    const safeName = (file.originalname ?? 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    const imagePath = `dev-test-images/${Date.now()}_${safeName}`;
    const storageFile = bucket.file(imagePath);

    await storageFile.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      resumable: false,
    });

    const [imageUrl] = await storageFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    await admin.firestore().collection('dev_test_images').add({
      imagePath,
      imageUrl,
      mimeType: file.mimetype,
      size: file.size,
      note: body?.note ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      imagePath,
      imageUrl,
      mimeType: file.mimetype,
      size: file.size,
      note: body?.note ?? null,
    };
  }

  private clamp(value: number, min: number, max: number): number {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  }
}
