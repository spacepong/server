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
   * A JSON Web Token (JWT) used for authorization and access to intra42 API.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Intra42 access token is required' })
  @IsString({ message: 'Intra42 access token must be a string' })
  @Field(() => String, {
    description:
      'JSON Web Token (JWT) used for authorization and access to intra42 API',
  })
  intra42AccessToken: string;

  /**
   * A token for refreshing the intra42 API JSON Web Token (JWT) when it expires.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Intra42 refresh token is required' })
  @IsString({ message: 'Intra42 refresh token must be a string' })
  @Field(() => String, {
    description:
      'A token for refreshing the intra42 API JSON Web Token (JWT) when it expires',
  })
  intra42RefreshToken: string;

  /**
   * The user entity containing information about the signed-in user.
   * @type {User}
   */
  @IsNotEmpty({ message: 'User is required' })
  @Field(() => User, {
    description: 'User entity containing user details',
    nullable: true,
  })
  user: User | null;
}
