import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { Channel } from '../entities/channel.entity';
import { ChannelService } from '../channel.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { NewChannelInput } from '../dto/new-channel.input';
import { randomChannelName } from '../utils/random-channel-name';

@Injectable()
export class ProtectedChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProtectedChannel(
    newChannelInput: NewChannelInput,
  ): Promise<Channel> {
    if (newChannelInput.userIds.length > 20)
      throw new ForbiddenException(
        'Protected channels must have 20 or fewer users',
      );

    if (!newChannelInput.password || newChannelInput.password.length < 8)
      throw new ForbiddenException(
        'Protected channels must have a password of at least 8 characters',
      );

    await ChannelService.didUserAlreadyCreatedChannel(
      newChannelInput,
      this.prismaService,
    );

    try {
      const hashedPassword: string = await argon.hash(newChannelInput.password);
      const protectedChannel: Channel = await this.prismaService.channel.create(
        {
          data: {
            type: newChannelInput.type,
            name: newChannelInput.name || randomChannelName(),
            description: newChannelInput.description || 'A protected channel',
            password: hashedPassword,
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
        },
      );
      return protectedChannel;
    } catch (e) {
      throw new InternalServerErrorException('Error creating channel');
    }
  }
}
