import { Injectable, NotFoundException } from '@nestjs/common';

import { Match } from './entities/match.entity';
import { UserService } from 'src/user/user.service';
import { NewMatchInput } from './dto/new-match.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { matchIncludes } from 'src/includes/match.includes';

/**
 * Service class for handling operations related to matches.
 *
 * @export
 * @class MatchService
 * @module match
 */
@Injectable()
export class MatchService {
  /**
   * Creates an instance of the MatchService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a new match.
   *
   * @param {NewMatchInput} newMatchInput - The input data for the new match.
   * @returns {Promise<Match>} The created match.
   */
  async createMatch(newMatchInput: NewMatchInput): Promise<Match> {
    await this.userService.updateRank(newMatchInput.winnerId, +25);
    await this.userService.updateRank(newMatchInput.loserId, -25);

    return this.prisma.match.create({
      data: {
        score: newMatchInput.score,
        winnerId: newMatchInput.winnerId,
        loserId: newMatchInput.loserId,
        date: new Date(),
      },
      include: matchIncludes,
    });
  }

  /**
   * Retrieves all matches.
   *
   * @returns {Promise<Match[]>} A list of all matches.
   */
  getAllMatches(): Promise<Match[]> {
    return this.prisma.match.findMany({
      include: matchIncludes,
    });
  }

  /**
   * Retrieves a match by its ID.
   *
   * @param {string} matchId - The ID of the match.
   * @returns {Promise<Match>} The match with the specified ID.
   * @throws {NotFoundException} If the match is not found.
   */
  async getMatchById(matchId: string): Promise<Match> {
    const match: Match = await this.prisma.match.findUnique({
      where: {
        id: matchId,
      },
      include: matchIncludes,
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  /**
   * Retrieves all matches associated with a user.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Match[]>} A list of matches associated with the user.
   */
  getMatchesByUserId(userId: string): Promise<Match[]> {
    return this.prisma.match.findMany({
      where: {
        OR: [
          {
            winnerId: userId,
          },
          {
            loserId: userId,
          },
        ],
      },
      include: matchIncludes,
    });
  }

  /**
   * Retrieves a list of matches by their IDs.
   *
   * @param {string[]} matchIds - The IDs of the matches.
   * @returns {Promise<Match[]>} A list of matches with the specified IDs.
   */
  populateMatchIds(matchIds: string[]): Promise<Match[]> {
    return this.prisma.match.findMany({
      where: {
        id: {
          in: matchIds,
        },
      },
      include: matchIncludes,
    });
  }

  /**
   * Deletes all matches.
   *
   * @returns {Promise<void>}
   */
  async deleteAllMatches(): Promise<void> {
    await this.prisma.match.deleteMany({});
  }
}