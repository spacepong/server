import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { DEBUG } from 'src/constants';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { NewMessageInput } from './dto/new-message.input';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';
import { ForbiddenException } from '@nestjs/common';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => Message, {
    name: 'createMessage',
    description: 'Create a new message',
  })
  async createMessage(
    @CurrentUserId() id: string,
    @Args('newMessageInput') newMessageInput: NewMessageInput,
  ) {
    if (newMessageInput.userId !== id && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.messageService.createMessage(newMessageInput);
  }
}
