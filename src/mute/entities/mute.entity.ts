import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

/**
 * Represents an individual mute within the system.
 * This entity encapsulates fundamental mute-related details.
 *
 * @export
 * @class Mute
 */
@ObjectType()
export class Mute {
  /**
   * The unique identifier for the mute.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Mute ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the mute' })
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
   * The duration of the mute.
   * @type {number}
   */
  @IsNotEmpty({ message: 'Mute duration must not be empty' })
  @Field(() => Int, { description: 'Duration of the mute' })
  duration: number;

  /**
   * The reason for the mute.
   * @type {string}
   */
  @IsString({ message: 'Mute reason must be a string' })
  @Field(() => String, {
    description: 'Reason for the mute',
    nullable: true,
  })
  reason?: string;

  /**
   * The date and time the mute expires.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Mute expires at must not be empty' })
  @IsDate({ message: 'Mute expires at must be a date' })
  @Field(() => Date, {
    description: 'Date and time the mute expires',
  })
  expiresAt: Date;

  /**
   * The date and time the mute was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Mute created at must not be empty' })
  @IsDate({ message: 'Mute created at must be a date' })
  @Field(() => Date, {
    description: 'Date and time the mute was created',
  })
  createdAt: Date;

  /**
   * The date and time the mute was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Mute updated at must not be empty' })
  @IsDate({ message: 'Mute updated at must be a date' })
  @Field(() => Date, {
    description: 'Date and time the mute was last updated',
  })
  updatedAt: Date;
}
