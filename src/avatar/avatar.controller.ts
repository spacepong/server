import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';

import { Public } from 'src/auth/decorators/public.decorator';
import { UserService } from 'src/user/user.service';

@Controller('/')
export class AvatarController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file: Express.Multer.File, cb) => {
          cb(
            null,
            `${Date.now()}-${file.originalname
              .replace(/\s/g, '')
              .split('.')
              .slice(0, -1)
              .join('.')}.png`,
          );
        },
      }),
      fileFilter: (_, file: Express.Multer.File, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) cb(null, true);
        else cb(new ForbiddenException('Unsupported file type'), false);
      },
    }),
  )
  uploadAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateAvatar(
      req.body.userId,
      `${process.env.BACKEND_URL}avatar/${file.filename}`,
    );
  }

  @Public()
  @Get('avatar/:filename')
  getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    try {
      return res.sendFile(filename, { root: 'uploads' });
    } catch (e) {
      throw new NotFoundException('File not found');
    }
  }
}
