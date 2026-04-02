import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMAGE_STORAGE_REPOSITORY } from '../../../domain/repositories/image-storage.repository.js';
import { R2ImageStorageService } from './r2-image-storage.service.js';
import { R2_S3_CLIENT } from './r2.constants.js';
import { createR2S3Client } from './r2-s3.factory.js';

@Global()
@Module({
  providers: [
    {
      provide: R2_S3_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createR2S3Client(config),
    },
    {
      provide: IMAGE_STORAGE_REPOSITORY,
      useClass: R2ImageStorageService,
    },
  ],
  exports: [IMAGE_STORAGE_REPOSITORY],
})
export class R2StorageModule {}
