import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

@ObjectType()
export class Match {
  @IsNotEmpty({ message: 'Match ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the match' })
  id: string;

  @IsNotEmpty({ message: 'Score must not be empty' })
  @IsInt({ message: 'Score must be an integer' })
  @Field(() => [Int], { description: 'The score of the match' })
  score: number[];

  @IsNotEmpty({ message: 'Winner ID must not be empty' })
  @Field(() => String, { description: 'The ID of the winner' })
  winnerId: string;

  @IsNotEmpty({ message: 'Loser ID must not be empty' })
  @Field(() => String, { description: 'The ID of the loser' })
  loserId: string;

  @IsNotEmpty({ message: 'Date must not be empty' })
  @Field(() => Date, { description: 'The date of the match' })
  date: Date;

  @IsNotEmpty({ message: 'Created at must not be empty' })
  @IsDate({ message: 'Created at must be a valid date' })
  @Field(() => Date, { description: 'The date when the match was created' })
  createdAt: Date;

  @IsNotEmpty({ message: 'Updated at must not be empty' })
  @IsDate({ message: 'Updated at must be a valid date' })
  @Field(() => Date, { description: 'The date when the match was updated' })
  updatedAt: Date;
}
