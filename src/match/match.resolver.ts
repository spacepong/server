import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
import { NewMatchInput } from './dto/new-match.input';
import { DEBUG } from 'src/constants';

@Resolver(() => Match)
export class MatchResolver {
  constructor(private readonly matchService: MatchService) {}

  @Mutation(() => Match, {
    name: 'createMatch',
    description: 'Creates a new match with the given data',
  })
  createMatch(
    @Args('newMatchInput') newMatchInput: NewMatchInput,
  ): Promise<Match> {
    return this.matchService.createMatch(newMatchInput);
  }

  @Query(() => [Match], {
    name: 'getAllMatches',
    description: 'Retrieves all matches with their associated data',
  })
  getAllMatches(): Promise<Match[]> {
    return this.matchService.getAllMatches();
  }

  @Query(() => Match, {
    name: 'getMatchById',
    description: 'Retrieves a match by its ID with associated data',
  })
  getMatchById(
    @Args('matchId', { type: () => String }) matchId: string,
  ): Promise<Match> {
    return this.matchService.getMatchById(matchId);
  }

  @Query(() => [Match], {
    name: 'getMatchesByUserId',
    description: 'Retrieves all matches for a user by their ID',
  })
  getMatchesByUserId(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<Match[]> {
    return this.matchService.getMatchesByUserId(userId);
  }

  @Query(() => [Match], {
    name: 'populateMatchIds',
    description: 'Retrieves a list of matches by their IDs',
  })
  populateMatchIds(
    @Args('matchIds', { type: () => [String] }) matchIds: string[],
  ): Promise<Match[]> {
    return this.matchService.populateMatchIds(matchIds);
  }

  @Mutation(() => [Match], {
    name: 'deleteAllMatches',
    description: 'Deletes all matches in development environment',
  })
  deleteAllMatches(): void {
    if (DEBUG) this.matchService.deleteAllMatches();
    else
      throw new Error('Cannot delete all matches unless in development mode');
  }
}
