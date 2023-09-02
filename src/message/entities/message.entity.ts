import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

/**
 * Represents an individual message within the system.
 * This entity encapsulates fundamental message-related details.
 *
 * @export
 * @class Message
 */
@ObjectType()
export class Message {
  /**
   * The unique identifier for the message.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Message ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the message' })
  id: string;

  /**
   * The ID of the associated channel.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Channel ID must not be empty' })
  @IsString({ message: 'Channel ID must be a string' })
  @Field(() => String, { description: 'ID of the associated channel' })
  channelId: string;

  /**
   * The associated channel entity.
   * @type {Channel}
   */
  @Field(() => Channel, {
    description: 'The associated channel entity',
  })
  channel?: Channel;

  /**
   * The ID of the associated user.
   * @type {string}
   */
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsString({ message: 'User ID must be a string' })
  @Field(() => String, { description: 'ID of the associated user' })
  userId: string;

  /**
   * The associated user entity.
   * @type {User}
   */
  @Field(() => User, {
    description: 'The associated user entity',
  })
  user?: User;

  /**
   * The text of the message.
   * @type {string}
   */
  @IsString({ message: 'Message text must be a string' })
  @Field(() => String, {
    description: 'Text of the message',
    nullable: true,
  })
  text?: string;

  /**
   * The photo of the message.
   * @type {string}
   */
  @IsString({ message: 'Message photo must be a string' })
  @Field(() => String, {
    description: 'Photo of the message',
    nullable: true,
  })
  photo?: string;

  /**
   * The invite to a game.
   * @type {string}
   */
  @IsString({ message: 'Message invite must be a string' })
  @Field(() => String, {
    description: 'Invite to a game',
    nullable: true,
  })
  invite?: string;

  /**
   * Whether or not the message is unsent.
   * @type {boolean}
   * @default false
   */
  @IsNotEmpty({ message: 'Message is unsent must not be empty' })
  @IsBoolean({ message: 'Message is unsent must be a boolean' })
  @Field(() => Boolean, {
    description: 'Whether or not the message is unsent',
    defaultValue: false,
  })
  unsent: boolean;

  /**
   * The IDs of the users who have seen the message.
   * @type {string[]}
   * @default []
   */
  @IsNotEmpty({ message: 'Message seenBy must not be empty' })
  @IsString({ each: true, message: 'Message seenBy must be a string' })
  @Field(() => [String], {
    description: 'IDs of the users who have seen the message',
    defaultValue: [],
  })
  seenBy: string[];

  /**
   * Whether or not the message is a system log.
   * @type {boolean}
   * @default false
   */
  @IsBoolean({ message: 'Message is system log must be a boolean' })
  @Field(() => Boolean, {
    description: 'Whether or not the message is a system log',
    defaultValue: false,
  })
  isLog?: boolean;

  /**
   * The date when the message was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Created at must not be empty' })
  @IsDate({ message: 'Created at must be a valid date' })
  @Field(() => Date, { description: 'The date when the message was created' })
  createdAt: Date;

  /**
   * The date when the message was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Updated at must not be empty' })
  @IsDate({ message: 'Updated at must be a valid date' })
  @Field(() => Date, {
    description: 'The date when the message was last updated',
  })
  updatedAt: Date;
}
