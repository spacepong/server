import { ObjectType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Auth {
  @IsString({ message: 'The OTP URL must be a string' })
  @Field(() => String, { description: 'The OTP URL', nullable: true })
  otpAuthUrl?: string;

  @Field(() => User, { description: 'The user object', nullable: true })
  user?: User;

  @IsBoolean({ message: 'The 2FA validation must be a boolean' })
  @Field(() => Boolean, { description: 'The 2FA validation', nullable: true })
  is2faValid?: boolean;

  @IsString({ message: 'The status must be a string' })
  @Field(() => String, { description: 'The status', nullable: true })
  status?: string;
}
