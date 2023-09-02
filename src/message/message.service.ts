import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Message } from './entities/message.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMessageInput } from './dto/new-message.input';
import { channelIncludes } from 'src/includes/channel.includes';
import { messageIncludes } from 'src/includes/message.includes';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMessage(
    newMessageInput: NewMessageInput,
    isLog: boolean = false,
  ): Promise<Message> {
    const channel: Channel = await this.prismaService.channel.findUnique({
      where: {
        id: newMessageInput.channelId,
      },
      include: channelIncludes,
    });

    if (!channel) throw new NotFoundException('Channel not found');

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
}
