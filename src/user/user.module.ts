import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';

/**
 * Module for managing User-related functionality.
 *
 * @export
 * @class UserModule
 */
@Module({
  providers: [
    UserResolver, // Resolver for handling User-related GraphQL queries
    UserService, // Service for interacting with the User entity
    PrismaService, // Service for interacting with the Prisma ORM
    JwtService, // Service for handling JWTs
    AccessTokenStrategy, // Strategy for handling access tokens
  ],
})
export class UserModule {}
