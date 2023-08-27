import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsDate, IsNotEmpty } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

/**
 * Represents a match between two users.
 * This entity encapsulates fundamental match-related details.
 *
 * @export
 * @class Match
 */
@ObjectType()
export class Match {
  /**
   * The unique identifier for the match.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Match ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the match' })
  id: string;

  /**
   * The score of the match.
   * @type {number[]}
   * @example [10, 5]
   */
  @IsNotEmpty({ message: 'Score must not be empty' })
  @IsArray({ message: 'Score must be an array' })
  @Field(() => [Int], { description: 'The score of the match' })
  score: number[];

  /**
   * The ID of the winner.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Winner ID must not be empty' })
  @Field(() => String, { description: 'The ID of the winner' })
  winnerId: string;

  /**
   * The winner of the match.
   * @type {User}
   */
  @Field(() => User, { description: 'The winner of the match' })
  winner?: User;

  /**
   * The ID of the loser.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Loser ID must not be empty' })
  @Field(() => String, { description: 'The ID of the loser' })
  loserId: string;

  /**
   * The loser of the match.
   * @type {User}
   */
  @Field(() => User, { description: 'The loser of the match' })
  loser?: User;

  /**
   * The date of the match.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Date must not be empty' })
  @Field(() => Date, { description: 'The date of the match' })
  date: Date;

  /**
   * The date when the match was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Created at must not be empty' })
  @IsDate({ message: 'Created at must be a valid date' })
  @Field(() => Date, { description: 'The date when the match was created' })
  createdAt: Date;

  /**
   * The date when the match was updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Updated at must not be empty' })
  @IsDate({ message: 'Updated at must be a valid date' })
  @Field(() => Date, { description: 'The date when the match was updated' })
  updatedAt: Date;
}
