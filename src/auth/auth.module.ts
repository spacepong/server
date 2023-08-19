import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Module for handling authentication-related functionality.
 *
 * @export
 * @class AuthModule
 */
@Module({
  providers: [
    AuthResolver, // GraphQL resolver for authentication-related functionality
    AuthService, // Service for handling authentication-related functionality
    JwtService, // Service for handling JWTs
    PrismaService, // Service for handling database interactions
  ],
})
export class AuthModule {}
