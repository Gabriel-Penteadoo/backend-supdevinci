import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerService } from './core/mailer/mailer.service';
import { AuthService } from './contexts/auth/auth.service';
import { ConversationService } from './contexts/conversation/conversation.service';
import { MessageService } from './contexts/message/message.service';

describe('AppController', () => {
  let appController: AppController;
  let mailerService: { send: jest.Mock };

  beforeEach(async () => {
    mailerService = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: MailerService,
          useValue: mailerService,
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: ConversationService,
          useValue: {},
        },
        {
          provide: MessageService,
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Builder API is running!"', () => {
      expect(appController.getHello()).toBe('Builder API is running!');
    });
  });

  describe('mail test', () => {
    it('should send a test email to provided recipient', async () => {
      const result = await appController.sendTestMail({
        to: 'me@example.com',
        subject: 'Subject',
        content: 'Content',
      });

      expect(mailerService.send).toHaveBeenCalledWith('me@example.com', 'Subject', 'Content');
      expect(result).toEqual({ success: true, to: 'me@example.com' });
    });
  });
});
