import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Channel } from '../entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { NewChannelInput } from '../dto/new-channel.input';

/**
 * Service responsible for all direct channel-related operations.
 *
 * @export
 * @class DirectChannelService
 * @module channel
 * @see ChannelService
 */
@Injectable()
export class DirectChannelService {
  /**
   * Creates an instance of DirectChannelService.
   *
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new direct channel.
   *
   * @param {NewChannelInput} newChannelInput - The new channel input data.
   * @returns {Promise<Channel>} A promise that resolves to the newly created channel.
   * @throws {ForbiddenException} If the channel has more than 2 users.
   * @throws {InternalServerErrorException} If an error occurs while creating the channel.
   */
  async createDirectChannel(
    newChannelInput: NewChannelInput,
  ): Promise<Channel> {
    if (newChannelInput.userIds.length !== 2)
      throw new ForbiddenException(
        'Direct channels must have exactly two users',
      );

    /**
     * @description
     * Checks if the user has already a direct channel with the other user.
     * If so, returns the existing channel.
     * Otherwise, creates a new direct channel.
     */
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
      /**
       * @description
       * Creates the new direct channel and connects the users to it.
       */
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

  /**
   * Retrieves a list of all direct channels.
   * Direct channels are direct messages between two users.
   *
   * @returns {Promise<Channel[]>} A promise that resolves to the list of all direct channels.
   */
  getAllDirectChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      where: {
        type: 'DIRECT',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: channelIncludes,
    });
  }
}
