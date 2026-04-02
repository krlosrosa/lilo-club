import {
  DeleteObjectCommand,
  PutObjectCommand,
  type S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  ImageStorageRepository,
  PutImageInput,
} from '../../../domain/repositories/image-storage.repository.js';
import { R2_S3_CLIENT } from './r2.constants.js';

@Injectable()
export class R2ImageStorageService implements ImageStorageRepository {
  private readonly bucket: string;
  private readonly publicBaseUrl: string | undefined;

  constructor(
    @Inject(R2_S3_CLIENT) private readonly client: S3Client,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.getOrThrow<string>('R2_BUCKET');
    this.publicBaseUrl = this.config.get<string>('R2_PUBLIC_BASE_URL');
  }

  async putObject(data: PutImageInput): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: data.key,
        Body: data.body,
        ContentType: data.contentType,
      }),
    );
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  getPublicUrl(key: string): string | null {
    const base = this.publicBaseUrl?.replace(/\/+$/, '');
    if (!base) {
      return null;
    }
    const normalizedKey = key.replace(/^\/+/, '');
    return `${base}/${normalizedKey}`;
  }
}
