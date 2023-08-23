import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

import { Avatar } from 'src/avatar/entities/avatar.entity';
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
   * @type {string}
   */
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the user' })
  id: string;

  /**
   * The associated connection entity.
   * @type {Connection}
   */
  @IsNotEmpty({ message: 'Connection must not be empty' })
  @Field(() => Connection, {
    description: 'The associated connection entity',
    nullable: true,
  })
  connection?: Connection;

  /**
   * The associated avatar entity.
   * @type {Avatar}
   */
  @IsNotEmpty({ message: 'Avatar must not be empty' })
  @Field(() => Avatar, {
    description: 'The associated avatar entity',
    nullable: true,
  })
  avatar?: Avatar;

  /**
   * The username chosen by the user for identification.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'Username must be a string' })
  @Field(() => String, {
    description: 'Username chosen by the user',
    nullable: true,
  })
  username?: string;

  /**
   * The rank of the user.
   * @type {number}
   */
  @IsNotEmpty({ message: 'User rank must not be empty' })
  @IsInt({ message: 'User rank must be an integer' })
  @Field(() => Int, { description: 'User rank', defaultValue: 100 })
  rank: number;

  /**
   * The users the user is following.
   * @type {string[]}
   */
  @IsNotEmpty({ message: 'User following must not be empty' })
  @Field(() => [String], {
    description: 'Users the user is following',
    defaultValue: [],
  })
  following?: string[];

  /**
   * The users the user is blocking.
   * @type {string[]}
   */
  @IsNotEmpty({ message: 'User blocked must not be empty' })
  @Field(() => [String], {
    description: 'Users the user is blocking',
    defaultValue: [],
  })
  blocked?: string[];

  /**
   * The status of the user.
   * @type {string}
   */
  @IsNotEmpty({ message: 'User status must not be empty' })
  @Field(() => String, { description: 'User status', defaultValue: 'ONLINE' })
  status: string;

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
