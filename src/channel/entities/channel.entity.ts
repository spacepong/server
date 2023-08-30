import { ObjectType } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { Mute } from 'src/mute/entities/mute.entity';
import { Kick } from 'src/kick/entities/kick.entity';
import { Message } from 'src/message/entities/message.entity';

export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  DIRECT = 'DIRECT',
}

@ObjectType()
export class Channel {
  id: string;
  name: string;
  description?: string;
  type: ChannelType;
  password?: string;
  ownerId: string;
  adminIds: string[];
  mutes: Mute[];
  kicks: Kick[];
  users: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
