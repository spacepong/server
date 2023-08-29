import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { Public } from 'src/auth/decorators/public.decorator';

@Controller('achievement')
export class AchievementController {
  @Public()
  @Get(':filename')
  getAvatar(@Param('filename') filename: string, @Res() res: Response): void {
    try {
      return res.sendFile(filename, { root: 'assets/achievements' });
    } catch (e) {
      throw new NotFoundException('File not found');
    }
  }
}
