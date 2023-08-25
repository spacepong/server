import { Field, InputType, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class NewConnectionInput {
  @Field(() => User, { description: 'The associated user entity' })
  user: User;

  @Field(() => Int, {
    description: 'The 42 intra ID associated with the connection',
    nullable: true,
  })
  intra_42?: number;
}
