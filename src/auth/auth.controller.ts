import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SignResponse } from 'src/auth/dto/sign.response';
import { Intra42Guard } from 'src/auth/guards/intra42.guard';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @UseGuards(Intra42Guard)
  @Get('/callback')
  async intraCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    // Sign in the user
    const response: SignResponse = await this.authService.signin(req.user);

    // Set the access token as a cookie
    res.cookie('accessToken', response.accessToken, {
      // Cookie is not accessible via client-side JavaScript for better security
      httpOnly: true,
      // Cookie is only sent to the server via HTTPS
      secure: true,
    });

    console.log(response.accessToken);

    // Redirect the user to the frontend
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }
}
