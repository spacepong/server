import { Module } from '@nestjs/common';

import { MatchService } from './match.service';
import { MatchResolver } from './match.resolver';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Module for handling operations related to matches.
 *
 * @export
 * @class MatchModule
 */
@Module({
  providers: [
    MatchResolver, // Provide the Match resolver throughout the application
    MatchService, // Provide the Match service throughout the application
    UserService, // Provide the User service throughout the application
    PrismaService, // Provide the Prisma service throughout the application
  ],
})
export class MatchModule {}