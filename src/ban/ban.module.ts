import { Module } from '@nestjs/common';

import { BanService } from './ban.service';
import { BanResolver } from './ban.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageService } from 'src/message/message.service';

@Module({
  providers: [BanResolver, BanService, PrismaService, MessageService],
})
export class BanModule {}
