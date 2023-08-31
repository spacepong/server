import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { NewChannelInput } from './dto/new-channel.input';
import { Channel, ChannelType } from './entities/channel.entity';
import { channelIncludes } from 'src/includes/channel.includes';
import { randomChannelName } from './utils/random-channel-name';

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}

  static async didUserAlreadyCreatedChannel(
    newChannelInput: NewChannelInput,
    prismaService: PrismaService,
  ) {
    const didUserAlreadyCreatedChannel: Channel =
      await prismaService.channel.findFirst({
        where: {
          AND: [
            {
              type: newChannelInput.type,
            },
            {
              firstOwnerId: newChannelInput.ownerId,
            },
            {
              createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            },
          ],
        },
        include: channelIncludes,
      });

    if (didUserAlreadyCreatedChannel)
      throw new ForbiddenException(
        `User already created a ${newChannelInput.type.toLowerCase()} channel in the last 24 hours`,
      );
  }

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
      if (newChannelInput.userIds.length > 30)
        throw new ForbiddenException(
          'Public channels must have 30 or fewer users',
        );

      await ChannelService.didUserAlreadyCreatedChannel(
        newChannelInput,
        this.prismaService,
      );

      try {
        const publicChannel: Channel = await this.prismaService.channel.create({
          data: {
            type: newChannelInput.type,
            name: newChannelInput.name || randomChannelName(),
            description: newChannelInput.description || 'A public channel',
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
        return publicChannel;
      } catch (e) {
        throw new InternalServerErrorException('Error creating channel');
      }
    } else if (newChannelInput.type === 'PRIVATE') {
      if (newChannelInput.userIds.length > 20)
        throw new ForbiddenException(
          'Private channels must have 20 or fewer users',
        );

      await ChannelService.didUserAlreadyCreatedChannel(
        newChannelInput,
        this.prismaService,
      );

      try {
        const privateChannel: Channel = await this.prismaService.channel.create(
          {
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
          },
        );
        return privateChannel;
      } catch (e) {
        throw new InternalServerErrorException('Error creating channel');
      }
    } else if (newChannelInput.type === 'PROTECTED') {
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
        const hashedPassword: string = await argon.hash(
          newChannelInput.password,
        );
        const protectedChannel: Channel =
          await this.prismaService.channel.create({
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
          });
        return protectedChannel;
      } catch (e) {
        throw new InternalServerErrorException('Error creating channel');
      }
    }
  }

  async getAllChannels() {
    return await this.prismaService.channel.findMany();
  }
}
