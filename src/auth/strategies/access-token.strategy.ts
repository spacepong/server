import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Injectable class representing an access token authentication strategy.
 *
 * This strategy validates access tokens for authentication.
 *
 * @export
 * @class AccessTokenStrategy
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Creates an instance of the AccessTokenStrategy class.
   *
   * @param {ConfigService} config - The configuration service used to access application configuration.
   */
  constructor(public config: ConfigService) {
    super({
      // Extracts the access token from the authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // The secret used to sign the JWT
      secretOrKey: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  /**
   * Validates the payload extracted from the access token.
   *
   * @param {JwtPayload} payload - The payload extracted from the access token.
   * @returns {Promise<JwtPayload>} - The validated payload.
   * @throws {ForbiddenException} - If 2FA is required but not authenticated.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (payload.is2faEnabled && !payload.is2faAuthenticated)
      throw new ForbiddenException('2FA required');

    return payload;
  }
}
