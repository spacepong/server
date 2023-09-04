import { Module } from '@nestjs/common';

import { KickService } from './kick.service';
import { KickResolver } from './kick.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageService } from 'src/message/message.service';

@Module({
  providers: [KickResolver, KickService, PrismaService, MessageService],
})
export class KickModule {}
