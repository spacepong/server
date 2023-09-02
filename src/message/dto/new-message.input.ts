import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class NewMessageInput {
  @IsNotEmpty({ message: 'Channel ID must not be empty' })
  @IsString({ message: 'Channel ID must be a string' })
  @Field(() => String, { description: 'ID of the associated channel' })
  channelId: string;

  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsString({ message: 'User ID must be a string' })
  @Field(() => String, { description: 'ID of the associated user' })
  userId: string;

  @Field(() => String, {
    description: 'Text of the message',
    nullable: true,
  })
  text?: string;

  @Field(() => String, {
    description: 'Path to the uploaded photo',
    nullable: true,
  })
  photo?: string;

  @Field(() => String, {
    description: 'Invite to a new game',
    nullable: true,
  })
  invite?: string;
}
