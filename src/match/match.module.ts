import { Module } from '@nestjs/common';

import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MatchResolver, MatchService, PrismaService],
})
export class MatchModule {}
