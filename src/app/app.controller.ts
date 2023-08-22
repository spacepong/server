import { Controller, Get } from '@nestjs/common';

import { Public } from 'src/auth/decorators/public.decorator';

@Controller('/')
export class AppController {
  constructor() {}

  @Public()
  @Get()
  root(): string {
    return 'transcendence.leet API v1.0.0';
  }
}
