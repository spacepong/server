import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteMuteInput {
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

  @IsNotEmpty({ message: 'User ID to unmute must not be empty' })
  @IsString({ message: 'User ID to unmute must be a string' })
  @Field(() => String, { description: 'ID of the associated user to unmute' })
  userIdToUnmute: string;

  @IsNotEmpty({ message: 'Mute ID must not be empty' })
  @IsString({ message: 'Mute ID must be a string' })
  @Field(() => String, { description: 'ID of the associated mute' })
  muteId: string;
}
