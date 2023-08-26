import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Custom decorator to retrieve the current user from the request.
 *
 * This decorator extracts user information from the request object,
 * based on the provided data key or without specifying it.
 *
 * @export
 * @function CurrentUser
 * @param {keyof JwtPayload | undefined} data - Optional data key to access a specific user property.
 * @param {ExecutionContext} context - Execution context containing request information.
 * @throws {ForbiddenException} - Throws an error if the user is not found.
 * @returns {(JwtPayload | string | number | boolean)} - The user object or a specific user property.
 */
export const CurrentUser = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    context: ExecutionContext,
  ): JwtPayload | string | number | boolean => {
    // Extract the request object from the GraphQL execution context
    const req = GqlExecutionContext.create(context).getContext().req;

    // If the user is not authenticated, throw an exception
    if (!req.user) throw new ForbiddenException('User not authenticated');

    // Extract the user object from the request
    const user: JwtPayload = req.user as JwtPayload;

    // If data key is provided, return the specified user property
    if (data) return user[data];

    // If no data key is provided, return the entire user object
    return user;
  },
);
