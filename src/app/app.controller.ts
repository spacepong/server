import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SignResponse } from 'src/auth/dto/sign.response';
import { Intra42Guard } from 'src/auth/guards/intra42.guard';

@Controller('/')
export class AppController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(Intra42Guard)
  @Get('/callback')
  async intraCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    const response: SignResponse = await this.authService.signin(req.user);
    console.log(response);
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }
}
