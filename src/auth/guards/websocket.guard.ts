import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { DEBUG, WS_DEBUG } from 'src/constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Retrieves the client handshake.
 * The handshake is retrieved from the client auth object, the client query object, or the client headers object.
 * The handshake is retrieved in that order.
 * If the process is not running in debug mode, the handshake is only retrieved from the client auth object.
 *
 * @export
 * @param {Socket} client - The client socket.
 * @param {string} key - The key to retrieve from the client handshake.
 * @returns {string} - The value of the key in the client handshake.
 */
export const getClientHandshake = (client: Socket, key: string): string => {
  if (!DEBUG && !WS_DEBUG) return client.handshake.auth[key];
  return (
    client.handshake.auth[key] ||
    client.handshake.query[key] ||
    client.handshake.headers[key]
  );
};

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
    const authorization: string = getClientHandshake(client, 'authorization');

    if (!authorization) throw new Error('Missing authorization header');

    const userId: string = getClientHandshake(client, 'userId');

    if (!userId) throw new Error('Missing userId');

    const token: string = authorization.split(' ')[1];
    if (!token || token.length === 0) throw new Error('Missing token');

    const payload: string | JwtPayload = verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    ) as string;

    return payload;
  }
}
