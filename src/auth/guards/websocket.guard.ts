import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { WS_DEBUG } from 'src/constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Guard to protect websockets by checking the validity of the access token.
 *
 * @export
 * @class WebsocketGuard
 * @implements {CanActivate}
 */
@Injectable()
export class WebsocketGuard implements CanActivate {
  /**
   * Checks if the access token is valid.
   * If the process is running in debug mode, the check is skipped.
   *
   * @param {ExecutionContext} context - Execution context.
   * @returns {(boolean | Promise<boolean> | Observable<boolean>)} - A boolean indicating whether access should be granted.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws' || WS_DEBUG) return true;

    const client: Socket = context.switchToWs().getClient();
    WebsocketGuard.validateToken(client);

    return true;
  }

  /**
   * Validates the access token.
   * If the token is valid, the payload is returned.
   * If the token is invalid, an error is thrown.
   *
   * @static
   * @param {Socket} client - The client socket.
   * @returns {(string | JwtPayload)} - The payload of the access token.
   */
  static validateToken(client: Socket): string | JwtPayload {
    /**
     * @description
     * Retrieve the authorization header from the client handshake.
     * If the header is not present, retrieve the authorization header from the client auth object.
     * If the header is not present, throw an error.
     *
     * @type {Client SocketIO} - the token is retrieved from the authorization header in the client handshake.
     * @type {Postman SocketIO} - the token is retrieved from the authorization header in the client auth object.
     */
    const authorization: string =
      client.handshake.headers.authorization ||
      client.handshake.auth.authorization;

    if (!authorization) throw new Error('Missing authorization header');

    const token: string = authorization.split(' ')[1];
    if (!token || token.length === 0) throw new Error('Missing token');

    const payload: string | JwtPayload = verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    ) as string;

    return payload;
  }
}
