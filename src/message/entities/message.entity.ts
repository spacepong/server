import { ObjectType } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@ObjectType()
export class Message {
  id: string;
  channelId: string;
  channel?: Channel;
  userId: string;
  user?: User;
  content: string;
  unsent: boolean;
  seenBy: string[];
  createdAt: Date;
  updatedAt: Date;
}
