export interface StorageProvider {
  /**
   * Upload a file and return its URL
   */
  uploadFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<string>;

  /**
   * Delete a file by its key
   */
  deleteFile(key: string): Promise<void>;

  /**
   * Get a signed URL for temporary access (for S3)
   * For local storage, just returns the public path
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

export enum StorageType {
  LOCAL = 'local',
  S3 = 's3',
}
