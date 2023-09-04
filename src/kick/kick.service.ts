import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Kick } from './entities/kick.entity';
import { NewKickInput } from './dto/new-kick.input';
import { Channel } from 'src/channel/entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { kickIncludes } from 'src/includes/kick.includes';
import { DeleteKickInput } from './dto/delete-kick.input';
import { MessageService } from 'src/message/message.service';
import { User } from 'src/user/entities/user.entity';
import { channelIncludes } from 'src/includes/channel.includes';

/**
 * Service dealing with kick based operations.
 *
 * @export
 * @class KickService
 * @module kick
 */
@Injectable()
export class KickService {
  /**
   * Creates an instance of KickService.
   *
   * @param {PrismaService} prismaService - The Prisma database service.
   * @param {MessageService} messageService - The message service.
   */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  /**
   * Creates a new kick record.
   *
   * @param {NewKickInput} newKickInput - The new kick input data.
   * @returns {Promise<Kick>} - The created kick record.
   * @throws {InternalServerErrorException} - An error occurred while creating the kick.
   * @throws {NotFoundException} - When the channel to kick from is not found.
   * @throws {NotFoundException} - When the user to kick is not found.
   * @throws {ForbiddenException} - When the user is not authorized to kick from the channel.
   * @throws {ForbiddenException} - When the user is trying to kick an admin.
   */
  async kickUser(newKickInput: NewKickInput): Promise<Kick> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: newKickInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const userToKick: User = channel.users.find(
      (user: User) => user.id === newKickInput.userIdToKick,
    );

    if (!userToKick) throw new NotFoundException('User to kick not found');

    if (
      !channel.adminIds.some(
        (adminId: string) => adminId === newKickInput.userId,
      ) ||
      channel.adminIds.some(
        (adminId: string) => adminId === newKickInput.userIdToKick,
      )
    )
      throw new ForbiddenException('User not authorized');

    try {
      const kick: Kick = await this.prismaService.kick.create({
        data: {
          userId: newKickInput.userIdToKick,
          channelId: newKickInput.channelId,
          reason: newKickInput.reason,
        },
        include: kickIncludes,
      });
      await this.prismaService.channel.update({
        where: {
          id: newKickInput.channelId,
        },
        data: {
          users: {
            disconnect: {
              id: newKickInput.userIdToKick,
            },
          },
        },
      });
      await this.messageService.createMessage(
        {
          channelId: newKickInput.channelId,
          userId: newKickInput.userId,
          text: `User ${userToKick.username} has been kicked${
            kick.reason && ` for ${kick.reason}`
          }`,
        },
        true,
      );
      return kick;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while creating the kick',
      );
    }
  }

  /**
   * Deletes a kick record.
   *
   * @param {DeleteKickInput} deleteKickInput - The delete kick input data.
   * @returns {Promise<Kick>} - The deleted kick record.
   * @throws {InternalServerErrorException} - An error occurred while deleting the kick.
   * @throws {NotFoundException} - When the channel to unkick from is not found.
   * @throws {NotFoundException} - When the kick to delete is not found.
   * @throws {ForbiddenException} - When the user is not authorized to unkick from the channel.
   */
  async deleteKick(deleteKickInput: DeleteKickInput): Promise<Kick> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: deleteKickInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (!channel.kicks.find((kick: Kick) => kick.id === deleteKickInput.kickId))
      throw new NotFoundException('Kick not found');

    if (
      !channel.adminIds.some(
        (adminId: string) => adminId === deleteKickInput.userId,
      )
    )
      throw new ForbiddenException('User not authorized');

    try {
      const kick: Kick = await this.prismaService.kick.delete({
        where: {
          id: deleteKickInput.kickId,
        },
        include: kickIncludes,
      });
      return kick;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the kick',
      );
    }
  }
}
