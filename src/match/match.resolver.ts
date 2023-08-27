import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
import { NewMatchInput } from './dto/new-match.input';
import { DEBUG } from 'src/constants';

/**
 * Resolver class for handling GraphQL queries and mutations related to matches.
 *
 * @export
 * @class MatchResolver
 * @module match
 */
@Resolver(() => Match)
export class MatchResolver {
  /**
   * Creates an instance of the MatchResolver class.
   *
   * @param {MatchService} matchService - The match service used for resolving match-related queries and mutations.
   */
  constructor(private readonly matchService: MatchService) {}

  /**
   * Mutation to create a new match.
   *
   * @param {NewMatchInput} newMatchInput - The input data for the new match.
   * @returns {Promise<Match>} The created match.
   */
  @Mutation(() => Match, {
    name: 'createMatch',
    description: 'Creates a new match with the given data',
  })
  createMatch(
    @Args('newMatchInput') newMatchInput: NewMatchInput,
  ): Promise<Match> {
    return this.matchService.createMatch(newMatchInput);
  }

  /**
   * Query to fetch all matches.
   *
   * @returns {Promise<Match[]>} A list of all matches.
   */
  @Query(() => [Match], {
    name: 'getAllMatches',
    description: 'Retrieves all matches with their associated data',
  })
  getAllMatches(): Promise<Match[]> {
    return this.matchService.getAllMatches();
  }

  /**
   * Query to fetch a match by its ID.
   *
   * @param {string} matchId - The ID of the match.
   * @returns {Promise<Match>} The match with the specified ID.
   */
  @Query(() => Match, {
    name: 'getMatchById',
    description: 'Retrieves a match by its ID with associated data',
  })
  getMatchById(
    @Args('matchId', { type: () => String }) matchId: string,
  ): Promise<Match> {
    return this.matchService.getMatchById(matchId);
  }

  /**
   * Query to fetch all matches associated with a user.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Match[]>} A list of matches associated with the user.
   */
  @Query(() => [Match], {
    name: 'getMatchesByUserId',
    description: 'Retrieves all matches for a user by their ID',
  })
  getMatchesByUserId(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<Match[]> {
    return this.matchService.getMatchesByUserId(userId);
  }

  /**
   * Query to fetch a list of matches by their IDs.
   *
   * @param {string[]} matchIds - The IDs of the matches.
   * @returns {Promise<Match[]>} A list of matches with the specified IDs.
   */
  @Query(() => [Match], {
    name: 'populateMatchIds',
    description: 'Retrieves a list of matches by their IDs',
  })
  populateMatchIds(
    @Args('matchIds', { type: () => [String] }) matchIds: string[],
  ): Promise<Match[]> {
    return this.matchService.populateMatchIds(matchIds);
  }

  /**
   * Mutation to delete all matches (development environment only).
   *
   * @returns {string} A message indicating that all matches were deleted.
   * @throws {ForbiddenException} If attempted to delete matches outside of the development environment.
   */
  @Mutation(() => String, {
    name: 'deleteAllMatches',
    description: 'Deletes all matches in development environment',
  })
  deleteAllMatches(): string {
    if (DEBUG) this.matchService.deleteAllMatches();
    else
      throw new ForbiddenException(
        'Cannot delete all matches unless in development mode',
      );
    return 'All matches deleted';
  }
}
