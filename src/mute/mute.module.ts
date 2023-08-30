import { Module } from '@nestjs/common';
import { MuteService } from './mute.service';
import { MuteResolver } from './mute.resolver';

@Module({
  providers: [MuteResolver, MuteService],
})
export class MuteModule {}
