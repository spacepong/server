import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Represents the response containing a new access token.
 *
 * This response includes the access token and any additional data
 * generated during the token renewal process.
 *
 * @export
 * @class NewAccessTokenResponse
 */
@ObjectType()
export class NewAccessTokenResponse {
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
}
