import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { Channel } from './entities/channel.entity';
import { ChannelService } from './channel.service';
import { NewChannelInput } from './dto/new-channel.input';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';

@Resolver()
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => Channel, {
    name: 'createChannel',
    description: 'Create a new channel',
  })
  async createChannel(
    @CurrentUserId() id: string,
    @Args('newChannelInput') newChannelInput: NewChannelInput,
  ) {
    if (!newChannelInput.userIds.includes(id))
      throw new ForbiddenException('User not authorized');
    return await this.channelService.createChannel(newChannelInput);
  }
}
