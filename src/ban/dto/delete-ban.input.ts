import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class DeleteBanInput {
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

  @IsNotEmpty({ message: 'User ID to unban must not be empty' })
  @IsString({ message: 'User ID to unban must be a string' })
  @Field(() => String, { description: 'ID of the associated user to unban' })
  userIdToUnban: string;

  @IsNotEmpty({ message: 'Ban ID must not be empty' })
  @IsString({ message: 'Ban ID must be a string' })
  @Field(() => String, { description: 'ID of the associated ban' })
  banId: string;
}
