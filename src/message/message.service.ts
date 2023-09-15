import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Message } from './entities/message.entity';
import { Mute } from 'src/mute/entities/mute.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMessageInput } from './dto/new-message.input';
import { channelIncludes } from 'src/includes/channel.includes';
import { messageIncludes } from 'src/includes/message.includes';
import { UnsendMessageInput } from './dto/unsend-message.input';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessage(
    newMessageInput: NewMessageInput,
    isLog: boolean = false,
  ): Promise<Message> {
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

    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: newMessageInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

    if (
      channel.mutes.some((mute: Mute) => mute.userId === newMessageInput.userId)
    ) {
      const mute: Mute = channel.mutes.find(
        (mute: Mute) => mute.userId === newMessageInput.userId,
      );
      if (mute.expiresAt > new Date())
        throw new NotFoundException('User is muted');
      await this.prismaService.mute.delete({
        where: {
          id: mute.id,
        },
      });
    }

    if (
      isLog &&
      !channel.adminIds.some(
        (adminId: string) => adminId === newMessageInput.userId,
      )
    )
      throw new NotFoundException('User not authorized');

    try {
      const message: Message = await this.prismaService.message.create({
        data: {
          ...newMessageInput,
          isLog,
        },
        include: messageIncludes,
      });
      await this.prismaService.channel.update({
        where: {
          id: newMessageInput.channelId,
        },
        data: {
          lastMessageSentAt: new Date(),
        },
      });
      return message;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while creating the message',
      );
    }
  }

  async unsendMessage(
    unsendMessageInput: UnsendMessageInput,
  ): Promise<Message> {
    const message: Message = await this.prismaService.message.findUnique({
      where: {
        id: unsendMessageInput.messageId,
      },
      include: messageIncludes,
    });

    if (!message) throw new NotFoundException('Message not found');

    try {
      const messageUnsent: Message = await this.prismaService.message.update({
        where: {
          id: unsendMessageInput.messageId,
        },
        data: {
          unsent: true,
        },
        include: messageIncludes,
      });
      return messageUnsent;
    } catch (e) {
      throw new InternalServerErrorException(
        'An error occurred while unsending the message',
      );
    }
  }
}
