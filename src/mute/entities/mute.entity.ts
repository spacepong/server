import { ObjectType } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@ObjectType()
export class Mute {
  id: string;
  channelId: string;
  channel?: Channel;
  userId: string;
  user: User;
  duration: number;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}
