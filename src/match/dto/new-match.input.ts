import { InputType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

/**
 * Input type for creating a new match.
 * This type is used as the argument for the createMatch mutation.
 *
 * @export
 * @class NewMatchInput
 */
@InputType()
export class NewMatchInput {
  /**
   * The score of the match.
   * @type {number[]}
   * @example [10, 5]
   */
  @IsNotEmpty({ message: 'Score is required' })
  @IsArray({ message: 'Score must be an array' })
  @Field(() => [Int], { description: 'The score of the match' })
  score: number[];

  /**
   * The ID of the winner.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Winner ID is required' })
  @IsString({ message: 'Winner ID must be a string' })
  @Field(() => String, { description: 'The ID of the winner' })
  winnerId: string;

  /**
   * The ID of the loser.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Loser ID is required' })
  @IsString({ message: 'Loser ID must be a string' })
  @Field(() => String, { description: 'The ID of the loser' })
  loserId: string;
}
