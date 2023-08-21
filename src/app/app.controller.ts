import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { Intra42Guard } from 'src/auth/guards/intra42.guard';

@Controller('app')
export class AppController {
  constructor() {}

  @Public()
  @UseGuards(Intra42Guard)
  @Get('/callback')
  intraCallback(@Query('code') code: string) {
    console.log(code);
    return 'Hello World!';
  }
}
