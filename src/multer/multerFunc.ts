import { Request } from 'express';

export const getFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, `${uniqueSuffix}-${file.originalname}`);
};
