import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * Guard to protect routes by checking the validity of the access token.
 * Extends AuthGuard from @nestjs/passport to handle authentication.
 *
 * @export
 * @class AccessTokenGuard
 */
@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  /**
   * Creates an instance of the AccessTokenGuard class.
   *
   * @param {Reflector} reflector - The reflector service used to retrieve metadata.
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Retrieves the request object from the GraphQL context.
   *
   * @template T
   * @param {ExecutionContext} context - Execution context.
   * @returns {T} - The request object.
   */
  getRequest<T = any>(context: ExecutionContext): T {
    return GqlExecutionContext.create(context).getContext().req;
  }

  /**
   * Determines whether the route is publicly accessible or requires authentication.
   * If the route is marked as public, access is granted; otherwise, the superclass's canActivate is called.
   *
   * @param {ExecutionContext} context - Execution context.
   * @returns {(boolean | Promise<boolean> | Observable<boolean>)} - A boolean indicating whether access should be granted.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * Retrieve the 'isPublic' metadata from the handler and class level using the reflector.
     * This metadata indicates whether the route is publicly accessible or requires authentication.
     */
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      'isPublic',
      [context.getHandler(), context.getClass()],
    );

    // If the route is marked as public, allow access without authentication.
    if (isPublic) return true;

    /**
     * If the route is not marked as public, call the canActivate method of the superclass (AuthGuard)
     * to perform the standard authentication check for the route.
     * This method returns a boolean indicating whether access should be granted based on authentication.
     */
    return super.canActivate(context);
  }
}
