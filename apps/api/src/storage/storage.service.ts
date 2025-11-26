import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider, StorageType } from './storage.interface';
import { LocalStorageProvider } from './local-storage.provider';
import { S3StorageProvider } from './s3-storage.provider';

@Injectable()
export class StorageService {
  private readonly provider: StorageProvider;

  constructor(
    private configService: ConfigService,
    private localStorageProvider: LocalStorageProvider,
    private s3StorageProvider: S3StorageProvider,
  ) {
    const storageType = this.configService.get('STORAGE_TYPE') || StorageType.LOCAL;

    this.provider =
      storageType === StorageType.S3
        ? this.s3StorageProvider
        : this.localStorageProvider;
  }

  /**
   * Upload card image (front or back)
   */
  async uploadCardImage(
    file: Express.Multer.File,
    cardId: string,
    side: 'front' | 'back',
  ): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const key = `cards/${side}/${cardId}-${side}.${ext}`;

    return this.provider.uploadFile(file, key);
  }

  /**
   * Delete card images
   */
  async deleteCardImages(cardId: string): Promise<void> {
    // Try to delete both front and back (ignore errors if they don't exist)
    await Promise.allSettled([
      this.provider.deleteFile(`cards/front/${cardId}-front.jpg`),
      this.provider.deleteFile(`cards/front/${cardId}-front.png`),
      this.provider.deleteFile(`cards/back/${cardId}-back.jpg`),
      this.provider.deleteFile(`cards/back/${cardId}-back.png`),
    ]);
  }

  /**
   * Get signed URL for private access
   */
  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    return this.provider.getSignedUrl(key, expiresIn);
  }
}
