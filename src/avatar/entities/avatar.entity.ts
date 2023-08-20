import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty } from 'class-validator';

/**
 * Represents an avatar entity that stores user's avatar-related data.
 *
 * @export
 * @class Avatar
 */
@ObjectType()
export class Avatar {
  /**
   * The unique identifier for the avatar.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Avatar ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the avatar' })
  id: string;

  /**
   * The filename of the avatar.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Filename must not be empty' })
  @Field(() => String, { description: 'Filename of the avatar' })
  filename: string;

  /**
   * The ID of the associated user.
   * @type {string}
   */
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @Field(() => String, { description: 'The ID of the associated user' })
  userId: string;

  /**
   * The date when the avatar was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Created at must not be empty' })
  @IsDate({ message: 'Created at must be a valid date' })
  @Field(() => Date, { description: 'The date when the avatar was created' })
  createdAt: Date;

  /**
   * The date when the avatar was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Updated at must not be empty' })
  @IsDate({ message: 'Updated at must be a valid date' })
  @Field(() => Date, {
    description: 'The date when the avatar was last updated',
  })
  updatedAt: Date;
}
