import { Module } from '@nestjs/common';

import { MuteService } from './mute.service';
import { MuteResolver } from './mute.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageService } from 'src/message/message.service';

@Module({
  providers: [MuteResolver, MuteService, PrismaService, MessageService],
})
export class MuteModule {}
