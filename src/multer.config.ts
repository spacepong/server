import { StorageEngine, diskStorage } from 'multer';
import { extname } from 'path';

interface MulterConfig {
  storage: StorageEngine;
}

export const multerConfig: MulterConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (
      _: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error, filename: string) => void,
    ) => {
      const randomName: string = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
