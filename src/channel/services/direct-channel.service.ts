import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Channel } from '../entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { NewChannelInput } from '../dto/new-channel.input';

@Injectable()
export class DirectChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDirectChannel(
    newChannelInput: NewChannelInput,
  ): Promise<Channel> {
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
  }
}
