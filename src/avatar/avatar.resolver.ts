import { Resolver } from '@nestjs/graphql';

import { Avatar } from './entities/avatar.entity';
import { AvatarService } from './avatar.service';

/**
 * Resolver for handling Avatar-related GraphQL queries.
 *
 * @export
 * @class AvatarResolver
 */
@Resolver(() => Avatar)
export class AvatarResolver {
  /**
   * Creates an instance of the AvatarResolver class.
   *
   * @param {AvatarService} avatarService - The avatar service used for resolving avatar-related queries.
   */
  constructor(private readonly avatarService: AvatarService) {}
}
