import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsInt, IsBoolean, IsEmpty, IsString } from 'class-validator';

import { Status } from '../enums/status.enum';

/**
 * Represents an individual user within the system.
 * This entity encapsulates fundamental user-related details.
 *
 * @export
 * @class User
 */
@ObjectType()
export class User {
  /**
   * The unique identifier for the user.
   * @type {number}
   */
  @IsInt({ message: 'User ID must be an integer' })
  @Field(() => Int, { description: 'Unique identifier for the user' })
  id: number;

  /**
   * The username chosen by the user for identification.
   * @type {string}
   */
  @IsEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'Username must be a string' })
  @Field(() => String, { description: 'Username chosen by the user' })
  username: string;

  /**
   * Whether the user has completed their profile.
   * @type {boolean}
   */
  @IsBoolean({ message: 'Profile completion status must be a boolean' })
  @Field(() => Boolean, {
    description: 'Whether the user has completed their profile',
  })
  profileComplete: boolean;

  /**
   * The rank of the user.
   * @type {number}
   */
  @IsInt({ message: 'User rank must be an integer' })
  @Field(() => Int, { description: 'User rank' })
  rank: number;

  /**
   * The status of the user.
   * @type {Status}
   */
  @Field(() => Status, { description: 'User status' })
  status: Status;

  /**
   * The date the user account was created.
   * @type {Date}
   */
  @IsDate({ message: 'User created at must be a date' })
  @Field(() => Date, { description: 'Date the user was created' })
  createdAt: Date;

  /**
   * The date the user account was last updated.
   * @type {Date}
   */
  @IsDate({ message: 'User updated at must be a date' })
  @Field(() => Date, { description: 'Date the user was last updated' })
  updatedAt: Date;
}
