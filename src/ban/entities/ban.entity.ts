import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { Channel } from 'src/channel/entities/channel.entity';

/**
 * Represents an individual ban within the system.
 * This entity encapsulates fundamental ban-related details.
 *
 * @export
 * @class Ban
 */
@ObjectType()
export class Ban {
  /**
   * The unique identifier for the ban.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Ban ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the ban' })
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
   * The reason for the ban.
   * @type {string}
   */
  @IsString({ message: 'Ban reason must be a string' })
  @Field(() => String, {
    description: 'Ban reason',
    nullable: true,
  })
  reason?: string;

  /**
   * The date and time the ban was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Ban creation date must not be empty' })
  @IsDate({ message: 'Ban creation date must be a valid date' })
  @Field(() => Date, { description: 'Date and time the ban was created' })
  createdAt: Date;

  /**
   * The date and time the ban was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Ban update date must not be empty' })
  @IsDate({ message: 'Ban update date must be a valid date' })
  @Field(() => Date, { description: 'Date and time the ban was last updated' })
  updatedAt: Date;
}
