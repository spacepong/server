import { Module } from '@nestjs/common';

import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicChannelService } from './services/public-channel.service';
import { PrivateChannelService } from './services/private-channel.service';
import { ProtectedChannelService } from './services/protected-channel.service';
import { DirectChannelService } from './services/direct-channel.service';

@Module({
  providers: [
    ChannelResolver,
    ChannelService,
    PublicChannelService,
    PrivateChannelService,
    ProtectedChannelService,
    DirectChannelService,
    PrismaService,
  ],
  exports: [
    PublicChannelService,
    PrivateChannelService,
    ProtectedChannelService,
    DirectChannelService,
  ],
})
export class ChannelModule {}
