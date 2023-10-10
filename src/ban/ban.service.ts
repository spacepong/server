import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Ban } from './entities/ban.entity';
import { NewBanInput } from './dto/new-ban.input';
import { Channel } from 'src/channel/entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { banIncludes } from 'src/includes/ban.includes';
import { MessageService } from 'src/message/message.service';
import { channelIncludes } from 'src/includes/channel.includes';
import { User } from 'src/user/entities/user.entity';
import { DeleteBanInput } from './dto/delete-ban.input';

/**
 * Service dealing with ban based operations.
 *
 * @export
 * @class BanService
 * @module ban
 */
@Injectable()
export class BanService {
  /**
   * Creates an instance of BanService.
   *
   * @param {PrismaService} prismaService - The Prisma database service.
   */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  /**
   * Creates a new ban record.
   *
   * @param {NewBanInput} newBanInput - The new ban input data.
   * @returns {Promise<Ban>} - The created ban record.
   * @throws {InternalServerErrorException} - An error occurred while creating the ban.
   * @throws {NotFoundException} - When the channel to ban from is not found.
   * @throws {NotFoundException} - When the user to ban is not found.
   * @throws {ForbiddenException} - When the user is not authorized to ban from the channel.
   * @throws {ForbiddenException} - When the user is trying to ban an admin.
   */
  async banUser(newBanInput: NewBanInput): Promise<Ban> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: newBanInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const userToBan: User = channel.users.find(
      (user: User) => user.id === newBanInput.userIdToBan,
    );

    if (!userToBan) throw new NotFoundException('User to ban not found');

    if (newBanInput.userIdToBan === channel.ownerId)
      throw new ForbiddenException('Cannot ban the channel owner');

    if (
      !channel.adminIds.some(
        (adminId: string) => adminId === newBanInput.userId,
      ) ||
      (channel.ownerId !== newBanInput.userId &&
        channel.adminIds.some(
          (adminId: string) => adminId === newBanInput.userIdToBan,
        ))
    )
      throw new ForbiddenException('User not authorized');

    try {
      /**
       * @description
       * Create a new ban record according to the new ban input data.
       * Disconnect the user from the channel.
       * Send a system log message to the channel indicating the user has been banned.
       */
      const ban: Ban = await this.prismaService.ban.create({
        data: {
          userId: newBanInput.userIdToBan,
          channelId: newBanInput.channelId,
          reason: newBanInput.reason,
        },
        include: banIncludes,
      });
      await this.prismaService.channel.update({
        where: {
          id: newBanInput.channelId,
        },
        data: {
          users: {
            disconnect: {
              id: newBanInput.userIdToBan,
            },
          },
          adminIds: channel.adminIds.filter(
            (adminId: string) => adminId !== newBanInput.userIdToBan,
          ),
        },
      });
      await this.messageService.createMessage(
        {
          channelId: newBanInput.channelId,
          userId: newBanInput.userId,
          text: `User ${userToBan.username} has been banned${
            ban.reason && ` for ${ban.reason}`
          }`,
        },
        true,
      );
      return ban;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while creating the ban',
      );
    }
  }

  /**
   * Deletes a ban record.
   *
   * @param {DeleteBanInput} deleteBanInput - The delete ban input data.
   * @returns {Promise<Ban>} - The deleted ban record.
   * @throws {InternalServerErrorException} - An error occurred while deleting the ban.
   * @throws {NotFoundException} - When the channel to unban from is not found.
   * @throws {NotFoundException} - When the ban to delete is not found.
   * @throws {ForbiddenException} - When the user is not authorized to unban from the channel.
   */
  async deleteBan(deleteBanInput: DeleteBanInput): Promise<Ban> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: deleteBanInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (!channel.bans.find((ban: Ban) => ban.id === deleteBanInput.banId))
      throw new NotFoundException('Ban not found');

    if (
      !channel.adminIds.some(
        (adminId: string) => adminId === deleteBanInput.userId,
      )
    )
      throw new ForbiddenException('User not authorized');

    try {
      const ban: Ban = await this.prismaService.ban.delete({
        where: {
          id: deleteBanInput.banId,
        },
        include: banIncludes,
      });
      return ban;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the ban',
      );
    }
  }
}
