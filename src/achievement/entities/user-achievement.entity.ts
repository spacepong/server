import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';

import { User } from 'src/user/entities/user.entity';
import { Achievement } from './achievement.entity';

@ObjectType()
export class UserAchievement {
  @IsNotEmpty({ message: 'User achievement ID must not be empty' })
  @Field(() => String, {
    description: 'Unique identifier for the user achievement',
  })
  id: string;

  @IsNotEmpty({ message: 'User ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the user' })
  userId: string;

  @Field(() => User, {
    description: 'The associated user entity',
    nullable: true,
  })
  user?: User;

  @IsNotEmpty({ message: 'Achievement ID must not be empty' })
  @Field(() => String, {
    description: 'Unique identifier for the achievement',
  })
  achievementId: string;

  @Field(() => Achievement, {
    description: 'The associated achievement entity',
    nullable: true,
  })
  achievement?: Achievement;

  @IsNotEmpty({ message: 'User achievement is achieved must not be empty' })
  @IsBoolean({ message: 'User achievement is achieved must be a boolean' })
  @Field(() => Boolean, {
    description: 'Whether the user achievement is achieved',
  })
  isAchieved: boolean;

  @IsDate({ message: 'User achievement achieved at must be a date' })
  @Field(() => Date, {
    description: 'Date the user achievement was achieved',
    nullable: true,
  })
  achievedAt?: Date;

  @IsNotEmpty({ message: 'User achievement created at must not be empty' })
  @IsDate({ message: 'User achievement created at must be a date' })
  @Field(() => Date, {
    description: 'Date the user achievement was created',
  })
  createdAt: Date;

  @IsNotEmpty({ message: 'User achievement updated at must not be empty' })
  @IsDate({ message: 'User achievement updated at must be a date' })
  @Field(() => Date, {
    description: 'Date the user achievement was updated',
  })
  updatedAt: Date;
}
