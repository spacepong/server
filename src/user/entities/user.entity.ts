import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  IsDate,
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { Status } from '../enums/status.enum';
import { Connection } from 'src/connection/entities/connection.entity';

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
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsInt({ message: 'User ID must be an integer' })
  @Field(() => Int, { description: 'Unique identifier for the user' })
  id: number;

  /**
   * The associated connection entity.
   * @type {Connection}
   */
  @IsNotEmpty({ message: 'Connection must not be empty' })
  @Field(() => Connection, { description: 'The associated connection entity' })
  connection: Connection;

  /**
   * The username chosen by the user for identification.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'Username must be a string' })
  @Field(() => String, { description: 'Username chosen by the user' })
  username: string;

  /**
   * Whether the user has completed their profile.
   * @type {boolean}
   */
  @IsNotEmpty({ message: 'Profile completion status must not be empty' })
  @IsBoolean({ message: 'Profile completion status must be a boolean' })
  @Field(() => Boolean, {
    description: 'Whether the user has completed their profile',
  })
  profileComplete: boolean;

  /**
   * The rank of the user.
   * @type {number}
   */
  @IsNotEmpty({ message: 'User rank must not be empty' })
  @IsInt({ message: 'User rank must be an integer' })
  @Field(() => Int, { description: 'User rank' })
  rank: number;

  /**
   * The status of the user.
   * @type {Status}
   */
  @IsNotEmpty({ message: 'User status must not be empty' })
  @Field(() => Status, { description: 'User status' })
  status: Status;

  /**
   * The date the user account was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'User created at must not be empty' })
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
