import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class NewBanInput {
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

  @IsNotEmpty({ message: 'User ID to ban must not be empty' })
  @IsString({ message: 'User ID to ban must be a string' })
  @Field(() => String, { description: 'ID of the associated user to ban' })
  userIdToBan: string;

  @Field(() => String, {
    description: 'Reason for the ban',
    nullable: true,
  })
  reason?: string;
}
