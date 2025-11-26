import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { StorageProvider } from './storage.interface';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = join(process.cwd(), 'uploads');
    this.baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const filePath = join(this.uploadDir, key);

    // Ensure directory exists
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, file.buffer);

    // Return public URL
    return `${this.baseUrl}/uploads/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = join(this.uploadDir, key);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist, ignore
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async getSignedUrl(key: string): Promise<string> {
    // For local storage, just return the public URL
    return `${this.baseUrl}/uploads/${key}`;
  }
}
