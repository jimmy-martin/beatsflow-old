import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

const filter = (
  allowedMimeTypes: Array<string>,
  file: Express.Multer.File,
  callback: any,
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestException(
        `Unsupported file type (${allowedMimeTypes.join(', ')})`,
      ),
      false,
    );
  }
};

export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  filter(allowedMimeTypes, file, callback);
};

export const audioFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const allowedMimeTypes = ['audio/wav', 'audio/mpeg'];
  filter(allowedMimeTypes, file, callback);
};
