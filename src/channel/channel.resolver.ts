import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { DEBUG } from 'src/constants';
import { Channel } from './entities/channel.entity';
import { ChannelService } from './channel.service';
import { NewChannelInput } from './dto/new-channel.input';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';
import { PublicChannelService } from './services/public-channel.service';
import { PrivateChannelService } from './services/private-channel.service';
import { ProtectedChannelService } from './services/protected-channel.service';
import { DirectChannelService } from './services/direct-channel.service';

@Resolver()
export class ChannelResolver {
  constructor(
    private readonly channelService: ChannelService,
    private readonly publicChannelService: PublicChannelService,
    private readonly privateChannelService: PrivateChannelService,
    private readonly protectedChannelService: ProtectedChannelService,
    private readonly directChannelService: DirectChannelService,
  ) {}

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
    return this.publicChannelService.getAllPublicChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllPrivateChannels',
    description: 'Get all private channels',
  })
  getAllPrivateChannels() {
    return this.privateChannelService.getAllPrivateChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllProtectedChannels',
    description: 'Get all protected channels',
  })
  getAllProtectedChannels() {
    return this.protectedChannelService.getAllProtectedChannels();
  }

  @Query(() => [Channel], {
    name: 'getAllDirectChannels',
    description: 'Get all direct channels',
  })
  getAllDirectChannels() {
    return this.directChannelService.getAllDirectChannels();
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
      throw new ForbiddenException('User not authorized');
    return this.publicChannelService.joinPublicChannel(channelId, userId);
  }

  @Mutation(() => Channel, {
    name: 'leavePublicChannel',
    description: 'Leave a public channel',
  })
  async leavePublicChannel(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.publicChannelService.leavePublicChannel(channelId, userId);
  }

  @Mutation(() => Channel, {
    name: 'joinPrivateChannel',
    description: 'Join a private channel',
  })
  async joinPrivateChannel(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.privateChannelService.joinPrivateChannel(channelId, userId);
  }

  @Mutation(() => Channel, {
    name: 'leavePrivateChannel',
    description: 'Leave a private channel',
  })
  async leavePrivateChannel(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.privateChannelService.leavePrivateChannel(channelId, userId);
  }

  @Mutation(() => Channel, {
    name: 'joinProtectedChannel',
    description: 'Join a protected channel',
  })
  async joinProtectedChannel(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
    @Args('password') password: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.protectedChannelService.joinProtectedChannel(
      channelId,
      userId,
      password,
    );
  }

  @Mutation(() => Channel, {
    name: 'leaveProtectedChannel',
    description: 'Leave a protected channel',
  })
  async leaveProtectedChannel(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
    @Args('password') password: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.protectedChannelService.leaveProtectedChannel(
      channelId,
      userId,
      password,
    );
  }

  @Mutation(() => Channel, {
    name: 'addAdmin',
    description: 'Add a user to the admins of an already joined channel',
  })
  async addAdmin(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.channelService.addAdmin(channelId, userId, id);
  }

  @Mutation(() => Channel, {
    name: 'removeAdmin',
    description: 'Remove a user from the admins of an already joined channel',
  })
  async removeAdmin(
    @CurrentUserId() id: string,
    @Args('userId') userId: string,
    @Args('channelId') channelId: string,
  ) {
    if (userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.channelService.removeAdmin(channelId, userId, id);
  }
}
