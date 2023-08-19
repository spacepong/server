import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

/**
 * Main application module that configures and initializes various modules.
 *
 * @export
 * @class AppModule
 */
@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [
    PrismaService, // Provide Prisma service throughout the application
  ],
})
export class AppModule {}
