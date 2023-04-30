import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { audioFilter, imageFilter } from './multerFilters';
import { diskStorage } from 'multer';
import { getFileName } from './multerFunc';

export const audioOptions: MulterOptions = {
  fileFilter: audioFilter,
  storage: diskStorage({
    destination: './uploads/audio',
    filename: getFileName,
  }),
};

export const imageOptions: MulterOptions = {
  fileFilter: imageFilter,
  storage: diskStorage({
    destination: './uploads/image',
    filename: getFileName,
  }),
};
