import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { NewChannelInput } from './dto/new-channel.input';
import { Channel, ChannelType } from './entities/channel.entity';
import { channelIncludes } from 'src/includes/channel.includes';
import { randomChannelName } from './utils/random-channel-name';

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async createChannel(newChannelInput: NewChannelInput): Promise<Channel> {
    if (!ChannelType[newChannelInput.type])
      throw new InternalServerErrorException('Invalid channel type');

    if (newChannelInput.type === 'DIRECT') {
      if (newChannelInput.userIds.length !== 2)
        throw new ForbiddenException(
          'Direct channels must have exactly two users',
        );

      const isDirectChannelExists: Channel =
        await this.prismaService.channel.findFirst({
          where: {
            AND: [
              {
                type: newChannelInput.type,
              },
              {
                users: { every: { id: { in: newChannelInput.userIds } } },
              },
            ],
          },
          include: channelIncludes,
        });

      if (isDirectChannelExists) return isDirectChannelExists;

      try {
        const directChannel: Channel = await this.prismaService.channel.create({
          data: {
            type: newChannelInput.type,
            users: {
              connect: newChannelInput.userIds.map((userId: string) => ({
                id: userId,
              })),
            },
          },
          include: channelIncludes,
        });
        return directChannel;
      } catch (e) {
        throw new InternalServerErrorException('Error creating channel');
      }
    } else if (newChannelInput.type === 'PUBLIC') {
      if (newChannelInput.userIds.length !== 1)
        throw new ForbiddenException(
          'Public channels must have exactly one user during creation',
        );

      const isUserAlreadyCreatedPublicChannel: Channel =
        await this.prismaService.channel.findFirst({
          where: {
            AND: [
              {
                type: newChannelInput.type,
              },
              {
                ownerId: newChannelInput.ownerId,
              },
              {
                createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
              },
            ],
          },
          include: channelIncludes,
        });

      if (isUserAlreadyCreatedPublicChannel)
        throw new ForbiddenException(
          'User already created a public channel in the last 24 hours',
        );

      try {
        const publicChannel: Channel = await this.prismaService.channel.create({
          data: {
            type: newChannelInput.type,
            name: newChannelInput.name || randomChannelName(),
            description: newChannelInput.description || 'A public channel',
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
        return publicChannel;
      } catch (e) {
        throw new InternalServerErrorException('Error creating channel');
      }
    } else if (newChannelInput.type === 'PRIVATE') {
    } else if (newChannelInput.type === 'PROTECTED') {
    }
  }

  async getAllChannels() {
    return await this.prismaService.channel.findMany();
  }
}
