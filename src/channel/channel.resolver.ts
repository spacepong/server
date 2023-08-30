import { Resolver } from '@nestjs/graphql';
import { ChannelService } from './channel.service';

@Resolver()
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}
}
