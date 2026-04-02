export const IMAGE_STORAGE_REPOSITORY = 'IImageStorageRepository';

export type PutImageInput = {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
};

export interface ImageStorageRepository {
  putObject(data: PutImageInput): Promise<void>;
  deleteObject(key: string): Promise<void>;
  /** Returns null when `R2_PUBLIC_BASE_URL` is not configured. */
  getPublicUrl(key: string): string | null;
}
