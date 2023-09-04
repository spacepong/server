import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class NewMuteInput {
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

  @IsNotEmpty({ message: 'User ID to mute must not be empty' })
  @IsString({ message: 'User ID to mute must be a string' })
  @Field(() => String, { description: 'ID of the associated user to mute' })
  userIdToMute: string;

  @IsNotEmpty({ message: 'Duration must not be empty' })
  @IsInt({ message: 'Duration must be an integer' })
  @Field(() => Number, { description: 'Duration of the mute' })
  duration: number;

  @Field(() => String, {
    description: 'Reason for the mute',
    nullable: true,
  })
  reason?: string;
}
