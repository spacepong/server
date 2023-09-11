import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ConnectionModule } from '../connection/connection.module';
import { AvatarModule } from '../avatar/avatar.module';
import { AuthService } from 'src/auth/auth.service';
import { ConnectionService } from 'src/connection/connection.service';
import { UserService } from 'src/user/user.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AppController } from './app.controller';
import { MatchModule } from 'src/match/match.module';
import { MatchService } from 'src/match/match.service';
import { AchievementModule } from 'src/achievement/achievement.module';
import { UserAchievementModule } from 'src/achievement/user-achievement.module';
import { UserAchievementService } from 'src/achievement/user-achievement.service';
import { AchievementService } from 'src/achievement/achievement.service';
import { ChannelModule } from 'src/channel/channel.module';
import { MessageModule } from 'src/message/message.module';
import { MuteModule } from 'src/mute/mute.module';
import { KickModule } from 'src/kick/kick.module';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { MuteService } from 'src/mute/mute.service';
import { KickService } from 'src/kick/kick.service';
import { PublicChannelService } from 'src/channel/services/public-channel.service';
import { DirectChannelService } from 'src/channel/services/direct-channel.service';
import { PrivateChannelService } from 'src/channel/services/private-channel.service';
import { ProtectedChannelService } from 'src/channel/services/protected-channel.service';
import { BanModule } from 'src/ban/ban.module';
import { BanService } from 'src/ban/ban.service';
import { TasksService } from 'src/tasks/tasks.service';
import { ChatGateway } from 'src/chat/chat.gateway';

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

    // Configure GraphQLModule with Apollo Server
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Use Apollo Server
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Enable GraphQL Playground
      sortSchema: true, // Sort schema alphabetically
      includeStacktraceInErrorResponses: false, // Disable stacktraces
    }),

    // Configure ScheduleModule for scheduled tasks
    ScheduleModule.forRoot(),

    // Import AuthModule for authentication related features
    AuthModule,

    // Import UserModule for user-related features
    UserModule,

    // Import ConnectionModule for connection-related features
    ConnectionModule,

    // Import AvatarModule for avatar-related features
    AvatarModule,

    // Import MatchModule for match-related features
    MatchModule,

    // Import AchievementModule for achievement-related features
    AchievementModule,

    // Import UserAchievementModule for user achievement-related features
    UserAchievementModule,

    /**
     * Import the following modules for channel-related features:
     * - ChannelModule: Channel-related features (e.g. CRUD operations)
     * - MessageModule: Message-related operations
     * - MuteModule: Channel mute-related operations
     * - KickModule: Channel kick-related operations
     */
    ChannelModule,
    MessageModule,
    MuteModule,
    KickModule,
    BanModule,
  ],
  providers: [
    PrismaService, // Provide Prisma service throughout the application
    AuthService, // Provide Auth service throughout the application
    JwtService, // Provide JWT service throughout the application
    UserService, // Provide User service throughout the application
    ConnectionService, // Provide Connection service throughout the application
    MatchService, // Provide Match service throughout the application
    AchievementService, // Provide Achievement service throughout the application
    UserAchievementService, // Provide UserAchievement service throughout the application
    ChannelService, // Provide Channel service throughout the application
    PublicChannelService, // Provide PublicChannel service throughout the application
    PrivateChannelService, // Provide PrivateChannel service throughout the application
    ProtectedChannelService, // Provide ProtectedChannel service throughout the application
    DirectChannelService, // Provide DirectChannel service throughout the application
    MessageService, // Provide Message service throughout the application
    MuteService, // Provide Mute service throughout the application
    KickService, // Provide Kick service throughout the application
    BanService, // Provide Ban service throughout the application
    TasksService, // Provide Tasks service throughout the application
    { provide: APP_GUARD, useClass: AccessTokenGuard }, // Use access token guard for all routes
    ChatGateway, // Provide ChatGateway throughout the application
  ],
  controllers: [AppController], // Provide App controller throughout the application
})
export class AppModule {}
