import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { audioOptions, imageOptions } from 'src/multer/multerOptions';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image', imageOptions))
  uploadImage(@UploadedFile() image: Express.Multer.File) {
    return this.uploadsService.uploadImage(image);
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('audio', audioOptions))
  uploadAudio(@UploadedFile() audio: Express.Multer.File) {
    return this.uploadsService.uploadAudio(audio);
  }
}
