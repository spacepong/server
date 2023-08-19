import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

/**
 * Represents the response object after a successful sign-in or authentication operation.
 * It contains important tokens and user details.
 *
 * @export
 * @class SignResponse
 */
@ObjectType()
export class SignResponse {
  /**
   * A JSON Web Token (JWT) used for authorization and access.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Access token is required' })
  @IsString({ message: 'Access token must be a string' })
  @Field(() => String, {
    description: 'JSON Web Token (JWT) used for authorization and access',
  })
  accessToken: string;

  /**
   * A token for refreshing the JSON Web Token (JWT) when it expires.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  @Field(() => String, {
    description:
      'Token for refreshing the JSON Web Token (JWT) when it expires',
  })
  refreshToken: string;

  /**
   * The user entity containing information about the signed-in user.
   * @type {User}
   */
  @IsNotEmpty({ message: 'User is required' })
  @Field(() => User, { description: 'User entity containing user details' })
  user: User;
}
