import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ConnectionModule } from '../connection/connection.module';
import { AvatarModule } from '../avatar/avatar.module';
import { AppController } from './app.controller';
import { AuthService } from 'src/auth/auth.service';
import { ConnectionService } from 'src/connection/connection.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

/**
 * Main application module that configures and initializes various modules.
 *
 * @export
 * @class AppModule
 */
@Module({
  imports: [
    // Configure ConfigModule with environment variables
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Use Apollo Server
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Enable GraphQL Playground
      sortSchema: true, // Sort schema alphabetically
      includeStacktraceInErrorResponses: false, // Disable stacktraces
    }),

    // Import AuthModule for authentication related features
    AuthModule,

    // Import UserModule for user-related features
    UserModule,

    // Import ConnectionModule for connection-related features
    ConnectionModule,

    // Import AvatarModule for avatar-related features
    AvatarModule,
  ],
  controllers: [
    AppController, // Provide AppController throughout the application
  ],
  providers: [
    PrismaService, // Provide Prisma service throughout the application
    AuthService, // Provide Auth service throughout the application
    JwtService, // Provide JWT service throughout the application
    ConnectionService, // Provide Connection service throughout the application
    { provide: APP_GUARD, useClass: AccessTokenGuard }, // Use access token guard for all routes
  ],
})
export class AppModule {}
