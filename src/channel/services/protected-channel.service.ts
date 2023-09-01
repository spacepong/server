import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as argon from 'argon2';

import { Channel } from '../entities/channel.entity';
import {
  ChannelService,
  ValidateChannelBeforeLeaving,
} from '../channel.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { NewChannelInput } from '../dto/new-channel.input';
import { randomChannelName } from '../utils/random-channel-name';

/**
 * Service responsible for all protected channel-related operations.
 *
 * @export
 * @class ProtectedChannelService
 * @module channel
 * @see ChannelService
 */
@Injectable()
export class ProtectedChannelService {
  /**
   * Creates an instance of ProtectedChannelService.
   *
   * @param {PrismaService} prismaService - The Prisma service for database operations.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new protected channel.
   *
   * @param {NewChannelInput} newChannelInput - The new channel input data.
   * @returns {Promise<Channel>} A promise that resolves to the newly created channel.
   * @throws {ForbiddenException} If the channel has more than 20 users or the password is less than 8 characters.
   * @throws {InternalServerErrorException} If an error occurs while creating the channel.
   */
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
       * Hashes the password using Argon2.
       * Generates a random channel name if one is not provided.
       * Generates a random channel description for protected channels if one is not provided.
       * Creates the channel and connects the users to it.
       */
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
      orderBy: {
        updatedAt: 'desc',
      },
      include: channelIncludes,
    });
  }

  /**
   * Joins a protected channel.
   *
   * @param {string} channelId - The ID of the channel to join.
   * @param {string} userId - The ID of the user joining the channel.
   * @param {string} password - The password of the channel to join.
   * @returns {Promise<Channel>} A promise that resolves to the joined channel.
   * @throws {ForbiddenException} If the password is incorrect.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is not protected or the user is already in the channel.
   * @throws {InternalServerErrorException} If an error occurs while joining the channel.
   */
  async joinProtectedChannel(
    channelId: string,
    userId: string,
    password: string,
  ): Promise<Channel> {
    /**
     * @description
     * Checks if the channel exists and if the user is in the channel or if the channel is not protected.
     * If so, throws an exception.
     */
    const channel: Channel = await ChannelService.validateChannelBeforeJoining(
      channelId,
      userId,
      'PROTECTED',
      this.prismaService,
    );

    /**
     * @description
     * Verifies the password using Argon2.
     */
    const isPasswordValid: boolean = await argon.verify(
      channel.password,
      password,
    );
    if (!isPasswordValid) throw new ForbiddenException('Incorrect password');

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
   * Leaves a protected channel.
   *
   * @param {string} channelId - The ID of the channel to leave.
   * @param {string} userId - The ID of the user leaving the channel.
   * @param {string} password - The password of the channel to leave.
   * @returns {Promise<Channel>} A promise that resolves to the channel left.
   * @throws {ForbiddenException} If the password is incorrect.
   * @throws {NotFoundException} If the channel is not found.
   * @throws {ForbiddenException} If the channel is not protected or the user is not in the channel.
   * @throws {InternalServerErrorException} If an error occurs while leaving the channel.
   */
  async leaveProtectedChannel(
    channelId: string,
    userId: string,
    password: string,
  ): Promise<Channel> {
    /**
     * @description
     * Checks if the channel exists and if the user is in the channel or if the channel is not protected.
     * If so, throws an exception.
     * Also checks if the user is the owner or an admin.
     * If so, sets the new owner and updates the list of admins.
     */
    const {
      isOwner,
      isAdmin,
      newOwnerId,
      adminIds,
      channel,
    }: ValidateChannelBeforeLeaving =
      await ChannelService.validateChannelBeforeLeaving(
        channelId,
        userId,
        'PROTECTED',
        this.prismaService,
      );

    /**
     * @description
     * Verifies the password using Argon2.
     */
    const isPasswordValid: boolean = await argon.verify(
      channel.password,
      password,
    );
    if (!isPasswordValid) throw new ForbiddenException('Incorrect password');

    try {
      /**
       * @description
       * If the user is the owner, set the new owner.
       * If the user is an admin, set the new admins from the updated list.
       * Disconnect the user from the channel.
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
