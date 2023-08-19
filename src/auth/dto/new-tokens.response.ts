import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the response containing new access and refresh tokens.
 *
 * This response includes the access token and refresh token
 * generated during the token renewal process.
 *
 * @export
 * @class NewTokensResponse
 */
@ObjectType()
export class NewTokensResponse {
  /**
   * The JSON Web Token (JWT) used for authorization and access.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'Access token is required' })
  @IsString({ message: 'Access token must be a string' })
  @Field({
    description: 'JSON Web Token (JWT) used for authorization and access',
  })
  accessToken: string;

  /**
   * The token for refreshing the JSON Web Token (JWT) when it expires.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  @Field({
    description:
      'Token for refreshing the JSON Web Token (JWT) when it expires',
  })
  refreshToken: string;
}