import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

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
   * @type {number}
   */
  @IsNotEmpty({ message: 'Avatar ID must not be empty' })
  @IsInt({ message: 'Avatar ID must be an integer' })
  @Field(() => Number, { description: 'Unique identifier for the avatar' })
  id: number;

  /**
   * The filename of the avatar.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Filename must not be empty' })
  @Field(() => String, { description: 'Filename of the avatar' })
  filename: string;

  /**
   * The binary data of the avatar.
   * @type {Buffer}
   */
  @IsNotEmpty({ message: 'Avatar data must not be empty' })
  data: Buffer;

  /**
   * The associated user entity.
   * @type {User}
   */
  @IsNotEmpty({ message: 'User must not be empty' })
  @Field(() => User, { description: 'The associated user entity' })
  user: User;

  /**
   * The ID of the associated user.
   * @type {number}
   */
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsInt({ message: 'User ID must be an integer' })
  @Field(() => Number, { description: 'The ID of the associated user' })
  userId: number;

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
