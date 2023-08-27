import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

/**
 * Input type for creating a new connection.
 * This type is used as the argument for the createConnection mutation.
 *
 * @export
 * @class NewConnectionInput
 */
@InputType()
export class NewConnectionInput {
  /**
   * The user entity associated with the connection.
   * @type {User}
   */
  @IsNotEmpty({ message: 'User is required' })
  @Field(() => User, { description: 'The associated user entity' })
  user: User;

  /**
   * The 42 intra ID associated with the connection.
   * @type {number}
   */
  @IsInt({ message: 'Intra42 ID must be an integer' })
  @Field(() => Int, {
    description: 'The 42 intra ID associated with the connection',
    nullable: true,
  })
  intra_42?: number;
}
