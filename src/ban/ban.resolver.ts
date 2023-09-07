import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { DEBUG } from 'src/constants';
import { Ban } from './entities/ban.entity';
import { BanService } from './ban.service';
import { NewBanInput } from './dto/new-ban.input';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';
import { DeleteBanInput } from './dto/delete-ban.input';

/**
 * The resolver that deals with ban based GraphQL requests.
 *
 * @export
 * @class BanResolver
 * @module ban
 */
@Resolver()
export class BanResolver {
  /**
   * Creates an instance of BanResolver.
   *
   * @param {BanService} banService - The ban service.
   */
  constructor(private readonly banService: BanService) {}

  /**
   * Creates a new ban record for a user.
   *
   * @param {string} id - The ID of the user sending the ban request.
   * @param {NewBanInput} newBanInput - The new ban input data.
   * @returns {Promise<Ban>} - The created ban record.
   * @throws {ForbiddenException} - When sending a ban request for another user.
   */
  @Mutation(() => Ban, {
    name: 'banUser',
    description: 'Create a new ban record',
  })
  async banUser(
    @CurrentUserId() id: string,
    @Args('newBanInput') newBanInput: NewBanInput,
  ): Promise<Ban> {
    if (id !== newBanInput.userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.banService.banUser(newBanInput);
  }

  /**
   * Deletes a ban record.
   *
   * @param {string} id - The ID of the user sending the unban request.
   * @param {DeleteBanInput} deleteBanInput - The delete ban input data.
   * @returns {Promise<Ban>} - The deleted ban record.
   * @throws {ForbiddenException} - When sending an unban request for another user.
   */
  @Mutation(() => Ban, {
    name: 'unbanUser',
    description: 'Delete a ban record',
  })
  async unbanUser(
    @CurrentUserId() id: string,
    @Args('deleteBanInput') deleteBanInput: DeleteBanInput,
  ): Promise<Ban> {
    if (id !== deleteBanInput.userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.banService.deleteBan(deleteBanInput);
  }
}
