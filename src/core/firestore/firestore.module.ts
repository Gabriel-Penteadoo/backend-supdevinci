import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const FIRESTORE_DB = Symbol('FIRESTORE_DB');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FIRESTORE_DB,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serviceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
        const configuredStorageBucket = configService.get<string>('FIREBASE_STORAGE_BUCKET');
        const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
        const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');
        const privateKey = configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n');

        if (!admin.apps.length) {
          if (serviceAccountPath) {
            const resolvedPath = resolve(serviceAccountPath);

            if (!existsSync(resolvedPath)) {
              throw new Error(`FIREBASE_SERVICE_ACCOUNT_PATH does not exist: ${resolvedPath}`);
            }

            const raw = readFileSync(resolvedPath, 'utf-8');
            const serviceAccount = JSON.parse(raw) as admin.ServiceAccount & { project_id?: string };
            const resolvedProjectId = serviceAccount.projectId ?? serviceAccount.project_id;
            const storageBucket = configuredStorageBucket ?? (resolvedProjectId ? `${resolvedProjectId}.appspot.com` : undefined);

            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              projectId: resolvedProjectId,
              storageBucket,
            });
          } else if (projectId && clientEmail && privateKey) {
            const storageBucket = configuredStorageBucket ?? `${projectId}.appspot.com`;
            admin.initializeApp({
              credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
              }),
              projectId,
              storageBucket,
            });
          } else {
            admin.initializeApp();
          }
        }

        return admin.firestore();
      },
    },
  ],
  exports: [FIRESTORE_DB],
})
export class FirestoreModule {}
