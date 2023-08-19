import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the input data required for user authentication (sign-in).
 * It includes the user's email and password for authentication.
 *
 * @export
 * @class SignInInput
 */
@InputType()
export class SignInInput {
  /**
   * The email address or username associated with the user's account.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Email address or username is required' })
  @IsString({ message: 'Email address or username must be a string' })
  @Field(() => String, {
    description:
      "The email address or username associated with the user's account",
  })
  emailOrUsername: string;

  /**
   * The password associated with the user's account.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Field(() => String, {
    description: "The password associated with the user's account",
  })
  password: string;
}
