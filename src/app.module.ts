import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
