import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export function createR2S3Client(config: ConfigService): S3Client {
  const accountId = config.getOrThrow<string>('R2_ACCOUNT_ID');
  const accessKeyId = config.getOrThrow<string>('R2_ACCESS_KEY_ID');
  const secretAccessKey = config.getOrThrow<string>('R2_SECRET_ACCESS_KEY');

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}
