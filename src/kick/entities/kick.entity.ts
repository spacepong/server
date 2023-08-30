import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

/**
 * Represents an individual kick within the system.
 * This entity encapsulates fundamental kick-related details.
 *
 * @export
 * @class Kick
 */
@ObjectType()
export class Kick {
  /**
   * The unique identifier for the kick.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Kick ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the kick' })
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
   * The reason for the kick.
   * @type {string}
   */
  @IsString({ message: 'Kick reason must be a string' })
  @Field(() => String, {
    description: 'Reason for the kick',
    nullable: true,
  })
  reason?: string;

  /**
   * The date and time the kick was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Kick creation date must not be empty' })
  @IsDate({ message: 'Kick creation date must be a valid date' })
  @Field(() => Date, { description: 'Date and time the kick was created' })
  createdAt: Date;

  /**
   * The date and time the kick was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Kick updated at must not be empty' })
  @IsDate({ message: 'Kick updated at must be a valid date' })
  @Field(() => Date, { description: 'Date and time the kick was last updated' })
  updatedAt: Date;
}
