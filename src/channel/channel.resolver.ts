import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { DEBUG } from 'src/constants';
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
    return this.channelService.createChannel(newChannelInput);
  }

  @Query(() => [Channel], {
    name: 'getAllChannels',
    description: 'Get all channels',
  })
  getAllChannels() {
    return this.channelService.getAllChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllPublicChannels',
    description: 'Get all public channels',
  })
  getAllPublicChannels() {
    return this.channelService.getAllPublicChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllPrivateChannels',
    description: 'Get all private channels',
  })
  getAllPrivateChannels() {
    return this.channelService.getAllPrivateChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllProtectedChannels',
    description: 'Get all protected channels',
  })
  getAllProtectedChannels() {
    return this.channelService.getAllProtectedChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllDirectChannels',
    description: 'Get all direct channels',
  })
  getAllDirectChannels() {
    return this.channelService.getAllDirectChannels();
  }

  @Query(() => Channel, {
    name: 'getChannelById',
    description: 'Get a channel by its ID',
  })
  getChannelById(@Args('channelId') channelId: string) {
    return this.channelService.getChannelById(channelId);
  }

  @Query(() => [Channel], {
    name: 'getChannelsByUserId',
    description: 'Get all channels of a user ordered by most recent',
  })
  getChannelsByUserId(@Args('userId') userId: string) {
    return this.channelService.getChannelsByUserId(userId);
  }

  @Mutation(() => Channel, {
    name: 'joinPublicChannel',
    description: 'Join a public channel',
  })
  async joinPublicChannel(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized to join channel');
    return this.channelService.joinPublicChannel(channelId, userId);
  }
}
