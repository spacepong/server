import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the input data required for user registration (sign-up).
 * It includes the user's chosen username, email, and password.
 *
 * @export
 * @class SignUpInput
 */
@InputType()
export class SignUpInput {
  /**
   * The unique username chosen by the user for identification.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @Field(() => String, {
    description: 'The unique username chosen by the user for identification',
  })
  username: string;

  /**
   * The email address associated with the user's registration.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Email address is required' })
  @IsString({ message: 'Email address must be a string' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Field(() => String, {
    description: "The email address associated with the user's registration",
  })
  email: string;

  /**
   * The password chosen by the user for their account.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Field(() => String, {
    description: 'The password chosen by the user for their account',
  })
  password: string;
}
