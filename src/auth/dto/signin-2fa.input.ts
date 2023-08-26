import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the input data required for user authentication with 2FA.
 *
 * @export
 * @class SignIn2faInput
 */
@InputType()
export class SignIn2faInput {
  /**
   * The ID of the user to sign in with 2FA.
   * @type {string}
   */
  @IsNotEmpty({ message: 'UserId is required' })
  @IsString({ message: 'UserId must be a string' })
  @Field(() => String, {
    description: 'The ID of the user to sign in with 2FA',
  })
  userId: string;

  /**
   * The Intra42 access token.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Intra42 access token is required' })
  @IsString({ message: 'Intra42 access token must be a string' })
  @Field(() => String, { description: 'The Intra42 access token' })
  intra42AccessToken: string;

  /**
   * The Intra42 refresh token.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Intra42 refresh token is required' })
  @IsString({ message: 'Intra42 refresh token must be a string' })
  @Field(() => String, { description: 'The Intra42 refresh token' })
  intra42RefreshToken: string;

  /**
   * The 2FA token.
   * @type {string}
   */
  @IsNotEmpty({ message: '2FA token is required' })
  @IsString({ message: '2FA token must be a string' })
  @Field(() => String, { description: 'The 2FA token' })
  token: string;
}
