import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class NewMatchInput {
  @IsNotEmpty({ message: 'Score is required' })
  @IsInt({ message: 'Score must be an integer' })
  @Field(() => [Int], { description: 'The score of the match' })
  score: number[];

  @IsNotEmpty({ message: 'Winner ID is required' })
  @IsString({ message: 'Winner ID must be a string' })
  @Field(() => String, { description: 'The ID of the winner' })
  winnerId: string;

  @IsNotEmpty({ message: 'Loser ID is required' })
  @IsString({ message: 'Loser ID must be a string' })
  @Field(() => String, { description: 'The ID of the loser' })
  loserId: string;
}
