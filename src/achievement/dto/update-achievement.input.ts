import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAchievementInput {
  @Field(() => String, { description: 'Achievement name', nullable: true })
  name?: string;

  @Field(() => String, {
    description: 'Achievement description',
    nullable: true,
  })
  description?: string;

  @Field(() => String, {
    description: 'Achievement icon',
    nullable: true,
  })
  icon?: string;
}
