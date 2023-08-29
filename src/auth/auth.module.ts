import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { Intra42Strategy } from './strategies/intra42.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserRelationsService } from 'src/user/services/user-relations.service';
import { Auth2faService } from './services/auth-2fa.service';
import { UserAchievementService } from 'src/achievement/user-achievement.service';

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
    Auth2faService, // Service for handling 2FA-related functionality
    JwtService, // Service for handling JWTs
    PrismaService, // Service for handling database interactions
    UserService, // Service for handling user-related functionality
    UserRelationsService, // Service for handling user relations (follows, block, etc.)
    Intra42Strategy, // Passport strategy for authenticating with 42 intra
    UserAchievementService, // Service for handling user achievement-related functionality
  ],
  exports: [Auth2faService], // Export Auth2faService to be used in other modules
})
export class AuthModule {}
