import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';

@Injectable()
export class UploadsService {
  uploadImage(image: Express.Multer.File) {
    return {
      url: `/uploads/image/${image.filename}`,
    };
  }

  uploadAudio(audio: Express.Multer.File) {
    return {
      url: `/uploads/audio/${audio.filename}`,
    };
  }

  async deleteOldFile(filePath: string): Promise<void> {
    const localPath = filePath.replace('/uploads', './uploads');
    unlink(localPath, error => {
      if (error) throw error;
    });
  }
}
