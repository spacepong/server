import { Module } from '@nestjs/common';

import { AvatarService } from './avatar.service';
import { AvatarResolver } from './avatar.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AvatarController } from './avatar.controller';
import { UserService } from 'src/user/user.service';
import { UserRelationsService } from 'src/user/services/user-relations.service';

/**
 * Module for handling operations related to avatars.
 *
 * @export
 * @class AvatarModule
 */
@Module({
  providers: [
    AvatarService, // Provide the Avatar service throughout the application
    AvatarResolver, // Provide the Avatar resolver throughout the application
    PrismaService, // Provide the Prisma service throughout the application
    UserService, // Provide the User service throughout the application
    UserRelationsService, // Provide the UserRelations service throughout the application
  ],
  controllers: [AvatarController], // Provide the Avatar controller throughout the application
})
export class AvatarModule {}
