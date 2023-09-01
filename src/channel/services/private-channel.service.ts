import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Channel } from '../entities/channel.entity';
import { ChannelService } from '../channel.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { NewChannelInput } from '../dto/new-channel.input';
import { randomChannelName } from '../utils/random-channel-name';

@Injectable()
export class PrivateChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPrivateChannel(
    newChannelInput: NewChannelInput,
  ): Promise<Channel> {
    if (newChannelInput.userIds.length > 20)
      throw new ForbiddenException(
        'Private channels must have 20 or fewer users',
      );

    await ChannelService.didUserAlreadyCreatedChannel(
      newChannelInput,
      this.prismaService,
    );

    try {
      const privateChannel: Channel = await this.prismaService.channel.create({
        data: {
          type: newChannelInput.type,
          name: newChannelInput.name || randomChannelName(),
          description: newChannelInput.description || 'A private channel',
          firstOwnerId: newChannelInput.ownerId,
          ownerId: newChannelInput.ownerId,
          adminIds: [newChannelInput.ownerId],
          users: {
            connect: newChannelInput.userIds.map((userId: string) => ({
              id: userId,
            })),
          },
        },
        include: channelIncludes,
      });
      return privateChannel;
    } catch (e) {
      throw new InternalServerErrorException('Error creating channel');
    }
  }

  async joinPrivateChannel(channelId: string, userId: string) {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type !== 'PRIVATE')
      throw new NotFoundException('Channel is not private');

    if (channel.users.some((user) => user.id === userId))
      throw new NotFoundException('User already in channel');

    try {
      const channelJoined: Channel = await this.prismaService.channel.update({
        where: {
          id: channelId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
          updatedAt: new Date(),
        },
        include: channelIncludes,
      });
      return channelJoined;
    } catch (e) {
      throw new InternalServerErrorException('Error joining channel');
    }
  }
}
