import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

/**
 * Interface representing the validated user object.
 */
export interface ValidateUser {
  accessToken: string;
  refreshToken: string;
  profile: any;
}

/**
 * Custom Passport strategy for authenticating users using Intra42 OAuth2.
 * Extends the PassportStrategy class and uses the Strategy from the 'passport-42' library.
 *
 * @export
 * @class Intra42Strategy
 */
@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
  /**
   * Creates an instance of the Intra42Strategy class.
   * Initializes the strategy with the provided client ID, client secret, and callback URL.
   */
  constructor() {
    super({
      clientID: process.env.INTRA42_CLIENT_ID,
      clientSecret: process.env.INTRA42_CLIENT_SECRET,
      callbackURL: process.env.INTRA42_CALLBACK_URL,
    });
  }

  /**
   * Method called when a user has been successfully authenticated using the strategy.
   *
   * @param {string} accessToken - The access token provided by the authentication provider.
   * @param {string} refreshToken - The refresh token provided by the authentication provider.
   * @param {*} profile - The user's profile information.
   * @returns {Promise<ValidateUser>} - The validated user information.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<ValidateUser> {
    return {
      accessToken,
      refreshToken,
      profile,
    };
  }
}
