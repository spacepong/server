import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Channel } from '../entities/channel.entity';
import { ChannelService } from '../channel.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { NewChannelInput } from '../dto/new-channel.input';
import { randomChannelName } from '../utils/random-channel-name';

/**
 * Service responsible for all public channel-related operations.
 *
 * @export
 * @class PublicChannelService
 * @module channel
 * @see ChannelService
 */
@Injectable()
export class PublicChannelService {
  /**
   * Creates an instance of PublicChannelService.
   *
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new public channel.
   *
   * @param {NewChannelInput} newChannelInput - The new channel input data.
   * @returns {Promise<Channel>} A promise that resolves to the newly created channel.
   * @throws {ForbiddenException} If the channel has more than 30 users.
   * @throws {InternalServerErrorException} If an error occurs while creating the channel.
   */
  async createPublicChannel(
    newChannelInput: NewChannelInput,
  ): Promise<Channel> {
    if (newChannelInput.userIds.length > 30)
      throw new ForbiddenException(
        'Public channels must have 30 or fewer users',
      );

    /**
     * @description
     * Checks if the user has already created a channel of the same type in the last 24 hours.
     * If so, throws a ForbiddenException.
     */
    await ChannelService.didUserAlreadyCreatedChannel(
      newChannelInput,
      this.prismaService,
    );

    /**
     * @description
     * If the owner is not in the list of users, add them.
     * This is to ensure that the owner is always in the channel.
     */
    if (!newChannelInput.userIds.includes(newChannelInput.ownerId))
      newChannelInput.userIds.push(newChannelInput.ownerId);

    try {
      /**
       * @description
       * Generates a random name for the channel if one is not provided.
       * Generates a default description for the channel if one is not provided.
       * Creates the channel and connects the users to it.
       */
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
  }

  /**
   * Joins a public channel.
   *
   * @param {string} channelId - The ID of the channel to join.
   * @param {string} userId - The ID of the user joining the channel.
   * @returns {Promise<Channel>} A promise that resolves to the channel joined.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is not public or the user is already in the channel.
   * @throws {InternalServerErrorException} If an error occurs while joining the channel.
   */
  async joinPublicChannel(channelId: string, userId: string): Promise<Channel> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type !== 'PUBLIC')
      throw new ForbiddenException('Channel is not public');

    if (channel.users.some((user) => user.id === userId))
      throw new ForbiddenException('User already in channel');

    try {
      /**
       * @description
       * When a channel is empty, the owner is null and the admins are empty.
       * If the channel has no owner, set the owner to the user joining.
       * If the channel has no admins, add the user joining as an admin.
       * Connect the user to the channel.
       */
      const channelJoined: Channel = await this.prismaService.channel.update({
        where: {
          id: channelId,
        },
        data: {
          ownerId: channel.ownerId === null ? userId : channel.ownerId,
          adminIds: channel.adminIds.length === 0 ? [userId] : channel.adminIds,
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

  /**
   * Leaves a public channel.
   *
   * @param {string} channelId - The ID of the channel to leave.
   * @param {string} userId - The ID of the user leaving the channel.
   * @returns {Promise<Channel>} A promise that resolves to the channel left.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is not public or the user is not in the channel.
   * @throws {InternalServerErrorException} If an error occurs while leaving the channel.
   */
  async leavePublicChannel(
    channelId: string,
    userId: string,
  ): Promise<Channel> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type !== 'PUBLIC')
      throw new ForbiddenException('Channel is not public');

    if (!channel.users.some((user) => user.id === userId))
      throw new ForbiddenException('User not in channel');

    const isOwner: boolean = userId === channel.ownerId;
    const isAdmin: boolean = channel.adminIds.some(
      (adminId: string) => adminId === userId,
    );

    /**
     * @description
     * If the user is the owner and there are other admins, set the first admin as the new owner.
     * If the user is the owner and there are no other admins, set the first user as the new owner.
     * If there is no other user, set the owner to null.
     */
    let newOwnerId: string = null;
    if (isOwner) {
      for (const adminId of channel.adminIds)
        if (adminId !== channel.ownerId) {
          newOwnerId = adminId;
          break;
        }
      if (!newOwnerId)
        for (const user of channel.users) {
          if (user.id !== channel.ownerId) {
            newOwnerId = user.id;
            break;
          }
        }
    }

    /**
     * @description
     * If the user is an admin, remove them from the list of admins.
     * If there is a new owner, add them to the list of admins.
     */
    const adminIdsSet: Set<string> = new Set(channel.adminIds);
    adminIdsSet.delete(userId);
    isOwner && newOwnerId && adminIdsSet.add(newOwnerId);
    const adminIds: string[] = Array.from(adminIdsSet);

    try {
      /**
       * @description
       * Disconnect the user from the channel.
       * If the user is the owner, set the new owner.
       * If the user is an admin, set the new admins from the updated list.
       */
      const channelLeft: Channel = await this.prismaService.channel.update({
        where: {
          id: channelId,
        },
        data: {
          ownerId: isOwner ? newOwnerId : channel.ownerId,
          adminIds: isAdmin ? adminIds : channel.adminIds,
          users: {
            disconnect: {
              id: userId,
            },
          },
          updatedAt: new Date(),
        },
        include: channelIncludes,
      });
      return channelLeft;
    } catch (e) {
      throw new InternalServerErrorException('Error leaving channel');
    }
  }
}
