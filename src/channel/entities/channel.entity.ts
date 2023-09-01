import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { Mute } from 'src/mute/entities/mute.entity';
import { Kick } from 'src/kick/entities/kick.entity';
import { Message } from 'src/message/entities/message.entity';

/**
 * Represents the type of a channel.
 * @type {object}
 * @property {string} PUBLIC - A public channel (no restrictions).
 * @property {string} PRIVATE - A private channel (requires invite).
 * @property {string} PROTECTED - A protected channel (requires password).
 * @property {string} DIRECT - A direct channel (between two users).
 */
export const ChannelType: object = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  PROTECTED: 'PROTECTED',
  DIRECT: 'DIRECT',
};

/**
 * Represents an individual channel within the system.
 * This entity encapsulates fundamental channel-related details.
 *
 * @export
 * @class Channel
 */
@ObjectType()
export class Channel {
  /**
   * The unique identifier for the channel.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Channel ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the channel' })
  id: string;

  /**
   * The name of the channel.
   * @type {string}
   */
  @IsString({ message: 'Channel name must be a string' })
  @Field(() => String, {
    description: 'Name of the channel',
    nullable: true,
  })
  name?: string;

  /**
   * The description of the channel.
   * @type {string}
   */
  @IsString({ message: 'Channel description must be a string' })
  @Field(() => String, {
    description: 'Description of the channel',
    nullable: true,
  })
  description?: string;

  /**
   * The type of the channel.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Channel type must not be empty' })
  @Field(() => String, {
    description: 'Type of the channel',
  })
  type: string;

  /**
   * The hashed password of the channel (if applicable).
   * Applies to protected channels.
   * @type {string}
   */
  @IsString({ message: 'Channel password must be a string' })
  @Field(() => String, {
    description: 'Password of the channel',
    nullable: true,
  })
  password?: string;

  /**
   * The first owner of the channel (who created it).
   * @type {string}
   */
  @IsNotEmpty({ message: 'Channel first owner ID must not be empty' })
  @IsString({ message: 'Channel first owner ID must be a string' })
  @Field(() => String, {
    description: 'Unique identifier for the channel first owner',
    nullable: true,
  })
  firstOwnerId?: string;

  /**
   * The owner of the channel.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Channel owner ID must not be empty' })
  @IsString({ message: 'Channel owner ID must be a string' })
  @Field(() => String, {
    description: 'Unique identifier for the channel owner',
    nullable: true,
  })
  ownerId?: string;

  /**
   * The admins of the channel.
   * @type {string[]}
   */
  @IsNotEmpty({ message: 'Channel admin IDs must not be empty' })
  @IsString({ each: true, message: 'Channel admin IDs must be a string' })
  @Field(() => [String], {
    description: 'Unique identifiers for the channel admins',
  })
  adminIds: string[];

  /**
   * The muted users of the channel.
   * @type {Mute[]}
   * @default []
   */
  @Field(() => [Mute], {
    description: 'Mutes associated with the channel',
    defaultValue: [],
  })
  mutes?: Mute[];

  /**
   * The kicked users of the channel.
   * @type {Kick[]}
   * @default []
   */
  @Field(() => [Kick], {
    description: 'Kicks associated with the channel',
    defaultValue: [],
  })
  kicks?: Kick[];

  /**
   * The members of the channel.
   * @type {User[]}
   * @default []
   */
  @Field(() => [User], {
    description: 'Members of the channel',
    defaultValue: [],
  })
  users?: User[];

  /**
   * The messages of the channel.
   * @type {Message[]}
   * @default []
   */
  @Field(() => [Message], {
    description: 'Messages associated with the channel',
    defaultValue: [],
  })
  messages?: Message[];

  /**
   * When the last message was sent in the channel.
   * @type {Date}
   */
  @IsDate({ message: 'Channel last message sent at must be a date' })
  @Field(() => Date, {
    description: 'Date the last message was sent in the channel',
    nullable: true,
  })
  lastMessageSentAt?: Date;

  /**
   * The date the channel was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Channel created at must not be empty' })
  @IsDate({ message: 'Channel created at must be a date' })
  @Field(() => Date, { description: 'Date the channel was created' })
  createdAt: Date;

  /**
   * The date the channel was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Channel updated at must not be empty' })
  @IsDate({ message: 'Channel updated at must be a date' })
  @Field(() => Date, { description: 'Date the channel was last updated' })
  updatedAt: Date;
}
