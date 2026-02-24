import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './contexts/profile/profile.module';
import { AuthModule } from './contexts/auth/auth.module';
import { MessageModule } from './contexts/message/message.module';
import { ResourceModule } from './contexts/resource/resources.groupe.module';
import { ConversationModule } from './contexts/conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { eventModule } from './core/events/event.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from './core/mailer/mailer.module';
import { FirestoreModule } from './core/firestore/firestore.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: config.get<string>('DB_LOGGING') === 'true',

        autoLoadEntities: true,
        charset: 'utf8mb4',
        timezone: 'Z',

        migrations: [
          join(process.cwd(), 'dist/core/database/migrations/*.js'),
          join(process.cwd(), 'src/core/database/migrations/*.ts'),
        ],
      }),
    }),
    ProfileModule,
    AuthModule,
    MessageModule,
    ResourceModule,
    ConversationModule,
    eventModule, 
    EventEmitterModule.forRoot(),
    MailerModule,
    FirestoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}