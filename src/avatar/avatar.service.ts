import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';

import { CreateAvatarInput } from './dto/create-avatar.input';

@Injectable()
export class AvatarService {
  constructor() {}

  async uploadAvatar({ userId, avatar }: CreateAvatarInput) {
    const { createReadStream, mimetype } = await avatar;
    const filename: string = `srd/uploads/${userId}-${new Date().getTime()}.${
      mimetype.split('/')[1]
    }`;
    return new Promise(async (resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filename))
        .on('finish', () =>
          resolve({
            filename,
            mimetype,
          }),
        )
        .on('error', () =>
          reject(new Error(`Error uploading avatar for user ${userId}`)),
        );
    });
  }
}
