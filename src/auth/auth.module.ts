import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectionService } from 'src/connection/connection.service';
import { Intra42Strategy } from './strategies/intra42.strategy';
import { AuthController } from './auth.controller';

/**
 * Module for handling authentication-related functionality.
 *
 * @export
 * @class AuthModule
 */
@Module({
  imports: [PassportModule],
  controllers: [
    AuthController, // Provide AuthController throughout the application
  ],
  providers: [
    AuthResolver, // GraphQL resolver for authentication-related functionality
    AuthService, // Service for handling authentication-related functionality
    JwtService, // Service for handling JWTs
    PrismaService, // Service for handling database interactions
    ConnectionService, // Service for handling connections
    Intra42Strategy, // Passport strategy for authenticating with 42 intra
  ],
})
export class AuthModule {}
