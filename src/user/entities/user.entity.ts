import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserAchievement } from 'src/achievement/entities/user-achievement.entity';

import { Avatar } from 'src/avatar/entities/avatar.entity';
import { Connection } from 'src/connection/entities/connection.entity';
import { Match } from 'src/match/entities/match.entity';

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
   * Whether or not the user is an admin.
   * @type {boolean}
   * @default false
   */
  @IsNotEmpty({ message: 'User is admin must not be empty' })
  @IsBoolean({ message: 'User is admin must be a boolean' })
  @Field(() => Boolean, {
    description: 'Whether or not the user is an admin',
    defaultValue: false,
  })
  isAdmin: boolean;

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
   * Last time the user was online.
   * @type {Date}
   */
  @IsDate({ message: 'User last online must be a date' })
  @Field(() => Date, { description: 'Last time the user was online' })
  lastOnline: Date;

  /**
   * The games won by the user.
   * @type {Match[]}
   */
  @Field(() => [Match], {
    description: 'Games won by the user',
    defaultValue: [],
  })
  won?: Match[];

  /**
   * The games lost by the user.
   * @type {Match[]}
   */
  @Field(() => [Match], {
    description: 'Games lost by the user',
    defaultValue: [],
  })
  lost?: Match[];

  /**
   * The achievements of the user.
   * @type {UserAchievement[]}
   */
  @Field(() => [UserAchievement], {
    description: 'Achievements of the user',
    defaultValue: [],
  })
  achievements?: UserAchievement[];

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
