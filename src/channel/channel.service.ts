import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Ban } from 'src/ban/entities/ban.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewChannelInput } from './dto/new-channel.input';
import { Channel, ChannelType } from './entities/channel.entity';
import { channelIncludes } from 'src/includes/channel.includes';
import { PublicChannelService } from './services/public-channel.service';
import { ProtectedChannelService } from './services/protected-channel.service';
import { PrivateChannelService } from './services/private-channel.service';
import { DirectChannelService } from './services/direct-channel.service';

/**
 * @description
 * This interface is used to create a map of channel types to channel services.
 * This is used in the createChannel method to dynamically call the correct
 * channel service based on the channel type.
 */
interface ChannelServiceMap {
  createChannel: (newChannelInput: NewChannelInput) => Promise<Channel>;
}

export interface ValidateChannelBeforeLeaving {
  isOwner: boolean;
  isAdmin: boolean;
  newOwnerId: string;
  adminIds: string[];
  channel: Channel;
}

/**
 * Service responsible for all channel-related operations.
 *
 * @export
 * @class ChannelService
 * @module channel
 */
@Injectable()
export class ChannelService {
  /**
   * Creates an instance of ChannelService.
   *
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   * @param {PublicChannelService} publicChannelService - The public channel service.
   * @param {PrivateChannelService} privateChannelService - The private channel service.
   * @param {ProtectedChannelService} protectedChannelService - The protected channel service.
   * @param {DirectChannelService} directChannelService - The direct channel service.
   */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly publicChannelService: PublicChannelService,
    private readonly privateChannelService: PrivateChannelService,
    private readonly protectedChannelService: ProtectedChannelService,
    private readonly directChannelService: DirectChannelService,
  ) {}

  /**
   * Checks if a user has already created a channel of the same type in the last 24 hours.
   * If so, throws a ForbiddenException.
   *
   * @static
   * @param {NewChannelInput} newChannelInput - The new channel input data.
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   * @returns {Promise<void>} A promise that resolves if the user has not created a channel of the same type in the last 24 hours.
   * @throws {ForbiddenException} If the user has already created a channel of the same type in the last 24 hours.
   */
  static async didUserAlreadyCreatedChannel(
    newChannelInput: NewChannelInput,
    prismaService: PrismaService,
  ): Promise<void> {
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

  /**
   * Validates a channel before joining.
   *
   * @static
   * @param {string} channelId - The ID of the channel to validate.
   * @param {string} userId - The ID of the user to validate.
   * @param {string} type - The type of the channel to validate.
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   * @returns {Promise<Channel>} A promise that resolves to the validated channel.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is not the correct type or the user is already in the channel.
   * @throws {ForbiddenException} If the user is banned from the channel.
   */
  static async validateChannelBeforeJoining(
    channelId: string,
    userId: string,
    type: string,
    prismaService: PrismaService,
  ): Promise<Channel> {
    const channel: Channel = await prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type !== type)
      throw new ForbiddenException(`Channel is not ${type.toLowerCase()}`);

    if (channel.users.find((user) => user.id === userId))
      throw new ForbiddenException('User is already in channel');

    if (channel.bans.find((ban: Ban) => ban.userId === userId))
      throw new ForbiddenException('User is banned from channel');

    return channel;
  }

  /**
   * Validates a channel before leaving.
   *
   * @static
   * @param {string} channelId - The ID of the channel to validate.
   * @param {string} userId - The ID of the user to validate.
   * @param {string} type - The type of the channel to validate.
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   * @returns {Promise<ValidateChannelBeforeLeaving>} A promise that resolves to the validation results.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is not the correct type or the user is not in the channel.
   */
  static async validateChannelBeforeLeaving(
    channelId: string,
    userId: string,
    type: string,
    prismaService: PrismaService,
  ): Promise<ValidateChannelBeforeLeaving> {
    const channel: Channel = await prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type !== type)
      throw new ForbiddenException(`Channel is not ${type.toLowerCase()}`);

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

    return {
      isOwner,
      isAdmin,
      newOwnerId,
      adminIds,
      channel,
    };
  }

  /**
   * Creates a new channel.
   *
   * @param {NewChannelInput} newChannelInput - The new channel input data.
   * @returns {Promise<Channel>} A promise that resolves to the created channel.
   * @throws {InternalServerErrorException} If the channel type is invalid.
   */
  async createChannel(newChannelInput: NewChannelInput): Promise<Channel> {
    if (!ChannelType[newChannelInput.type])
      throw new InternalServerErrorException('Invalid channel type');

    /**
     * @description
     * This map is used to dynamically call the correct channel service based on the channel type.
     */
    const channelServiceMap: Record<string, ChannelServiceMap> = {
      PUBLIC: {
        createChannel: this.publicChannelService.createPublicChannel.bind(
          this.publicChannelService,
        ),
      },
      PRIVATE: {
        createChannel: this.privateChannelService.createPrivateChannel.bind(
          this.privateChannelService,
        ),
      },
      PROTECTED: {
        createChannel: this.protectedChannelService.createProtectedChannel.bind(
          this.protectedChannelService,
        ),
      },
      DIRECT: {
        createChannel: this.directChannelService.createDirectChannel.bind(
          this.directChannelService,
        ),
      },
    };

    /**
     * @description
     * This calls the correct channel service based on the channel type.
     * This is done dynamically using the channelServiceMap.
     */
    return channelServiceMap[newChannelInput.type].createChannel(
      newChannelInput,
    );
  }

  /**
   * Retrieves a list of all channels ordered by most recent.
   *
   * @returns {Promise<Channel[]>} A promise that resolves to the list of all channels.
   */
  getAllChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: channelIncludes,
    });
  }

  /**
   * Retrieves a channel by its ID.
   *
   * @param {string} channelId - The ID of the channel to retrieve.
   * @returns {Promise<Channel>} A promise that resolves to the requested channel.
   * @throws {NotFoundException} If the channel is not found.
   */
  getChannelById(channelId: string): Promise<Channel> {
    const channel = this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    return channel;
  }

  /**
   * Retrieves a list of channels of a user ordered by most recent.
   *
   * @param {string} userId - The ID of the user to retrieve channels for.
   * @returns {Promise<Channel[]>} A promise that resolves to the list of channels of the user ordered by most recent.
   */
  getChannelsByUserId(userId: string): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: channelIncludes,
    });
  }

  /**
   * Adds an administator to a channel.
   *
   * @param {string} channelId - The ID of the channel to add the administrator to.
   * @param {string} userId - The ID of the user to add as an administrator.
   * @returns {Promise<Channel>} A promise that resolves to the updated channel.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is a direct channel.
   * @throws {ForbiddenException} If the user is already the owner.
   * @throws {ForbiddenException} If the user is not in the channel.
   * @throws {ForbiddenException} If the user is already an administrator.
   * @throws {InternalServerErrorException} If an error occurred while adding the administrator.
   */
  async addAdmin(channelId: string, userId: string): Promise<Channel> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type === ChannelType.DIRECT)
      throw new ForbiddenException('Cannot add admin to direct channel');

    if (channel.ownerId === userId)
      throw new ForbiddenException('User is already owner');

    if (!channel.users.some((user) => user.id === userId))
      throw new ForbiddenException('User not in channel');

    if (channel.adminIds.some((adminId) => adminId === userId))
      throw new ForbiddenException('User is already admin');

    try {
      const channelUpdated: Channel = await this.prismaService.channel.update({
        where: {
          id: channelId,
        },
        data: {
          adminIds: {
            push: userId,
          },
        },
        include: channelIncludes,
      });
      return channelUpdated;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while adding the admin',
      );
    }
  }

  /**
   * Removes an administrator from a channel.
   *
   * @param {string} channelId - The ID of the channel to remove the administrator from.
   * @param {string} userId - The ID of the user to remove as an administrator.
   * @returns {Promise<Channel>} A promise that resolves to the updated channel.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is a direct channel.
   * @throws {ForbiddenException} If the user is the owner.
   * @throws {ForbiddenException} If the user is not in the channel.
   * @throws {ForbiddenException} If the user is not an administrator.
   * @throws {InternalServerErrorException} If an error occurred while removing the administrator.
   */
  async removeAdmin(channelId: string, userId: string): Promise<Channel> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.type === ChannelType.DIRECT)
      throw new ForbiddenException('Cannot remove admin from direct channel');

    if (channel.ownerId === userId)
      throw new ForbiddenException('User is owner');

    if (!channel.users.some((user) => user.id === userId))
      throw new ForbiddenException('User not in channel');

    if (!channel.adminIds.some((adminId) => adminId === userId))
      throw new ForbiddenException('User is not admin');

    try {
      const channelUpdated: Channel = await this.prismaService.channel.update({
        where: {
          id: channelId,
        },
        data: {
          adminIds: {
            set: channel.adminIds.filter((adminId) => adminId !== userId),
          },
        },
        include: channelIncludes,
      });
      return channelUpdated;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while removing the admin',
      );
    }
  }
}
