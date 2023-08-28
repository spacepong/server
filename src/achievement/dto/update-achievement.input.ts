import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateAchievementInput {
  @IsString({ message: 'Achievement name must be a string' })
  @Field(() => String, { description: 'Achievement name', nullable: true })
  name?: string;

  @IsString({ message: 'Achievement description must be a string' })
  @Field(() => String, {
    description: 'Achievement description',
    nullable: true,
  })
  description?: string;

  @IsString({ message: 'Achievement icon must be a string' })
  @Field(() => String, {
    description: 'Achievement icon',
    nullable: true,
  })
  icon?: string;
}
