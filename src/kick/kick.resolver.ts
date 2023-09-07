import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { DEBUG } from 'src/constants';
import { Kick } from './entities/kick.entity';
import { KickService } from './kick.service';
import { NewKickInput } from './dto/new-kick.input';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';
import { DeleteKickInput } from './dto/delete-kick.input';

/**
 * The resolver that deals with kick based GraphQL requests.
 *
 * @export
 * @class KickResolver
 * @module kick
 */
@Resolver()
export class KickResolver {
  /**
   * Creates an instance of KickResolver.
   *
   * @param {KickService} kickService - The kick service.
   */
  constructor(private readonly kickService: KickService) {}

  /**
   * Creates a new kick record for a user.
   *
   * @param {string} id - The ID of the user sending the kick request.
   * @param {NewKickInput} newKickInput - The new kick input data.
   * @returns {Promise<Kick>} - The created kick record.
   * @throws {ForbiddenException} - When sending a kick request for another user.
   */
  @Mutation(() => Kick, {
    name: 'kickUser',
    description: 'Create a new kick record',
  })
  async kickUser(
    @CurrentUserId() id: string,
    @Args('newKickInput') newKickInput: NewKickInput,
  ): Promise<Kick> {
    if (id !== newKickInput.userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.kickService.kickUser(newKickInput);
  }

  /**
   * Deletes a kick record.
   *
   * @param {string} id - The ID of the user sending the unkick request.
   * @param {DeleteKickInput} deleteKickInput - The delete kick input data.
   * @returns {Promise<Kick>} - The deleted kick record.
   * @throws {ForbiddenException} - When sending an unkick request for another user.
   */
  @Mutation(() => Kick, {
    name: 'unkickUser',
    description: 'Delete a kick record',
  })
  async unkickUser(
    @CurrentUserId() id: string,
    @Args('deleteKickInput') deleteKickInput: DeleteKickInput,
  ): Promise<Kick> {
    if (id !== deleteKickInput.userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.kickService.deleteKick(deleteKickInput);
  }
}
