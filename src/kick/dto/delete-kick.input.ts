import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteKickInput {
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsString({ message: 'User ID must be a string' })
  @Field(() => String, {
    description: 'ID of the associated user sending the request',
  })
  userId: string;

  @IsNotEmpty({ message: 'Channel ID must not be empty' })
  @IsString({ message: 'Channel ID must be a string' })
  @Field(() => String, { description: 'ID of the associated channel' })
  channelId: string;

  @IsNotEmpty({ message: 'User ID to unkick must not be empty' })
  @IsString({ message: 'User ID to unkick must be a string' })
  @Field(() => String, { description: 'ID of the associated user to unkick' })
  userIdToUnkick: string;

  @IsNotEmpty({ message: 'Kick ID must not be empty' })
  @IsString({ message: 'Kick ID must be a string' })
  @Field(() => String, { description: 'ID of the associated kick' })
  kickId: string;
}
