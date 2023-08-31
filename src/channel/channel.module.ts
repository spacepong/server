import { Module } from '@nestjs/common';

import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChannelResolver, ChannelService, PrismaService],
})
export class ChannelModule {}
