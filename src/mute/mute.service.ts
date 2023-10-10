import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Mute } from './entities/mute.entity';
import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMuteInput } from './dto/new-mute.input';
import { channelIncludes } from 'src/includes/channel.includes';
import { MessageService } from 'src/message/message.service';
import { muteIncludes } from 'src/includes/mute.includes';
import { DeleteMuteInput } from './dto/delete-mute.input';

@Injectable()
export class MuteService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  async muteUser(newMuteInput: NewMuteInput): Promise<Mute> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: newMuteInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const userToMute: User = channel.users.find(
      (user: User) => user.id === newMuteInput.userIdToMute,
    );

    if (!userToMute) throw new NotFoundException('User to kick not found');

    if (newMuteInput.userId === channel.ownerId)
      throw new ForbiddenException('Cannot mute the channel owner');

    if (channel.mutes.some((mute: Mute) => mute.userId === userToMute.id))
      throw new ForbiddenException('User already muted');

    if (
      !channel.adminIds.some(
        (adminId: string) => adminId === newMuteInput.userId,
      ) ||
      (channel.ownerId !== newMuteInput.userId &&
        channel.adminIds.some(
          (adminId: string) => adminId === newMuteInput.userIdToMute,
        ))
    )
      throw new ForbiddenException('User not authorized');

    try {
      const mute: Mute = await this.prismaService.mute.create({
        data: {
          userId: newMuteInput.userIdToMute,
          channelId: newMuteInput.channelId,
          duration: newMuteInput.duration,
          reason: newMuteInput.reason,
          expiresAt: new Date(Date.now() + newMuteInput.duration * 1000),
        },
        include: muteIncludes,
      });
      await this.messageService.createMessage(
        {
          channelId: newMuteInput.channelId,
          userId: newMuteInput.userId,
          text: `User ${userToMute.username} has been muted for ${newMuteInput.duration} seconds`,
        },
        true,
      );
      return mute;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while creating the mute',
      );
    }
  }

  async deleteMute(deleteMuteInput: DeleteMuteInput): Promise<Mute> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: deleteMuteInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (!channel.mutes.find((mute: Mute) => mute.id === deleteMuteInput.muteId))
      throw new NotFoundException('Mute not found');

    if (
      !channel.adminIds.some(
        (adminId: string) => adminId === deleteMuteInput.userId,
      )
    )
      throw new ForbiddenException('User not authorized');

    try {
      const mute: Mute = await this.prismaService.mute.delete({
        where: {
          id: deleteMuteInput.muteId,
        },
        include: muteIncludes,
      });
      return mute;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the mute',
      );
    }
  }

  async clearExpiredMutes(): Promise<void> {
    try {
      await this.prismaService.mute.deleteMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while clearing expired mutes',
      );
    }
  }
}
