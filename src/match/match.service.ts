import { Injectable, NotFoundException } from '@nestjs/common';

import { Match } from './entities/match.entity';
import { NewMatchInput } from './dto/new-match.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { matchIncludes } from 'src/includes/match.includes';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async createMatch(newMatchInput: NewMatchInput): Promise<Match> {
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

  getAllMatches(): Promise<Match[]> {
    return this.prisma.match.findMany({
      include: matchIncludes,
    });
  }

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

  async deleteAllMatches(): Promise<void> {
    await this.prisma.match.deleteMany({});
  }
}
