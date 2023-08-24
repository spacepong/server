import { Args, Mutation, Resolver } from '@nestjs/graphql';

import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

import { Avatar } from './entities/avatar.entity';
import { AvatarService } from './avatar.service';
import { User } from 'src/user/entities/user.entity';
import { FileUpload } from './scalars/file-upload.scalar';

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

  /**
   * Mutation to upload an avatar.
   *
   * @param {string} userId - The ID of the user.
   * @param {GraphQLUpload} avatar - The avatar image.
   * @returns {Promise<User>} The updated user entity.
   */
  @Mutation(() => User, {
    name: 'uploadAvatar',
    description: 'Uploads an avatar for the user',
  })
  async uploadAvatar(
    @Args('userId', { type: () => String }) userId: string,
    @Args('avatar', { type: () => GraphQLUpload }) avatar: Promise<FileUpload>,
  ): Promise<User | void> {
    const upload = await this.avatarService.uploadAvatar({ userId, avatar });
    console.log(upload);
  }
}
