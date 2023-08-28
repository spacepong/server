import { Field, ObjectType } from '@nestjs/graphql';
import { AchievementType } from '@prisma/client';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class Achievement {
  @IsNotEmpty({ message: 'Achievement ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the achievement' })
  id: string;

  @IsNotEmpty({ message: 'Achievement name must not be empty' })
  @IsString({ message: 'Achievement name must be a string' })
  @Field(() => String, { description: 'Name of the achievement' })
  name: string;

  @IsNotEmpty({ message: 'Achievement description must not be empty' })
  @IsString({ message: 'Achievement description must be a string' })
  @Field(() => String, { description: 'Description of the achievement' })
  description: string;

  @IsNotEmpty({ message: 'Achievement icon must not be empty' })
  @IsString({ message: 'Achievement icon must be a string' })
  @Field(() => String, { description: 'Icon of the achievement' })
  icon: string;

  @IsNotEmpty({ message: 'Achievement type must not be empty' })
  @Field(() => AchievementType, { description: 'Type of the achievement' })
  type: AchievementType;

  @IsNotEmpty({ message: 'Achievement created at must not be empty' })
  @IsDate({ message: 'Achievement created at must be a date' })
  @Field(() => Date, { description: 'Date the achievement was created' })
  createdAt: Date;

  @IsNotEmpty({ message: 'Achievement updated at must not be empty' })
  @IsDate({ message: 'Achievement updated at must be a date' })
  @Field(() => Date, { description: 'Date the achievement was updated' })
  updatedAt: Date;
}
