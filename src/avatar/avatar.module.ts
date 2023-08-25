import { Module } from '@nestjs/common';

import { AvatarService } from './avatar.service';
import { AvatarResolver } from './avatar.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AvatarController } from './avatar.controller';
import { UserService } from 'src/user/user.service';
import { UserRelationsService } from 'src/user/services/user-relations.service';

@Module({
  providers: [
    AvatarService,
    AvatarResolver,
    PrismaService,
    UserService,
    UserRelationsService,
  ],
  controllers: [AvatarController],
})
export class AvatarModule {}
