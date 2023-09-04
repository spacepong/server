import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { Mute } from './entities/mute.entity';
import { MuteService } from './mute.service';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';
import { NewMuteInput } from './dto/new-mute.input';
import { DEBUG } from 'src/constants';

/**
 * The resolver that deals with mute based GraphQL requests.
 *
 * @export
 * @class MuteResolver
 * @module mute
 */
@Resolver()
export class MuteResolver {
  /**
   * Creates an instance of MuteResolver.
   *
   * @param {MuteService} muteService - The mute service.
   */
  constructor(private readonly muteService: MuteService) {}

  /**
   * Creates a new mute record for a user.
   *
   * @param {string} id - The ID of the user sending the mute request.
   * @param {NewMuteInput} newMuteInput - The new mute input data.
   * @returns {Promise<Mute>} - The created mute record.
   * @throws {ForbiddenException} - When sending a mute request for another user.
   */
  @Mutation(() => Mute, {
    name: 'muteUser',
    description: 'Create a new mute record',
  })
  async muteUser(
    @CurrentUserId() id: string,
    @Args('newMuteInput') newMuteInput: NewMuteInput,
  ): Promise<Mute> {
    if (id !== newMuteInput.userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.muteService.muteUser(newMuteInput);
  }
}
