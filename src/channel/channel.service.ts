import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

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
   * Retrieves a list of all channels.
   *
   * @returns {Promise<Channel[]>} A promise that resolves to the list of all channels.
   */
  getAllChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      include: channelIncludes,
    });
  }

  /**
   * Retrieves a list of all public channels.
   * Public channels are channels that anyone can join.
   *
   * @returns {Promise<Channel[]>} A promise that resolves to the list of all public channels.
   */
  getAllPublicChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      where: {
        type: 'PUBLIC',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: channelIncludes,
    });
  }

  /**
   * Retrieves a list of all private channels.
   * Private channels are channels that only invited users can join.
   *
   * @returns {Promise<Channel[]>} A promise that resolves to the list of all private channels.
   */
  getAllPrivateChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      where: {
        type: 'PRIVATE',
      },
      include: channelIncludes,
    });
  }

  /**
   * Retrieves a list of all protected channels.
   * Protected channels are channels that anyone with the password can join.
   *
   * @returns {Promise<Channel[]>} A promise that resolves to the list of all protected channels.
   */
  getAllProtectedChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      where: {
        type: 'PROTECTED',
      },
      include: channelIncludes,
    });
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
}
