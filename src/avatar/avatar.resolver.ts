import { Resolver } from '@nestjs/graphql';

import { Avatar } from './entities/avatar.entity';

/**
 * Resolver for handling Avatar-related GraphQL queries.
 *
 * @export
 * @class AvatarResolver
 * @module avatar
 */
@Resolver(() => Avatar)
export class AvatarResolver {
  /**
   * Creates an instance of the AvatarResolver class.
   */
  constructor() {}
}
