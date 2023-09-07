import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the input required to create a new channel.
 *
 * @export
 * @class NewChannelInput
 */
@InputType()
export class NewChannelInput {
  /**
   * The name of the channel.
   * @type {string}
   */
  @Field(() => String, {
    description: 'Name of the channel',
    nullable: true,
  })
  name?: string;

  /**
   * The description of the channel.
   * @type {string}
   */
  @Field(() => String, {
    description: 'Description of the channel',
    nullable: true,
  })
  description?: string;

  /**
   * The type of the channel.
   * @type {string}
   * @example 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'DIRECT'
   */
  @IsNotEmpty({ message: 'Channel type must not be empty' })
  @Field(() => String, {
    description: 'Type of the channel',
  })
  type: string;

  /**
   * The password of the channel.
   * @type {string}
   */
  @Field(() => String, {
    description: 'Password of the channel',
    nullable: true,
  })
  password?: string;

  /**
   * The owner ID of the channel (if group channel)
   * @type {string}
   */
  @Field(() => String, {
    description: 'Owner of the channel',
    nullable: true,
  })
  ownerId?: string;

  /**
   * The user IDs of the channel.
   * @type {string[]}
   */
  @IsNotEmpty({ message: 'Channel user IDs must not be empty', each: true })
  @IsString({ message: 'Channel user IDs must be a string', each: true })
  @Field(() => [String], {
    description: 'Users of the channel',
    nullable: true,
  })
  userIds: string[];
}
