import { Module } from '@nestjs/common';
import { KickService } from './kick.service';
import { KickResolver } from './kick.resolver';

@Module({
  providers: [KickResolver, KickService],
})
export class KickModule {}
