import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsInt, IsNotEmpty } from 'class-validator';

/**
 * Represents a connection entity that stores user-related data.
 *
 * @export
 * @class Connection
 * @module connection
 */
@ObjectType()
export class Connection {
  /**
   * The unique identifier for the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Connection ID must not be empty' })
  @Field(() => String, { description: 'Unique identifier for the connection' })
  id: string;

  /**
   * The ID of the associated user.
   * @type {string}
   */
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @Field(() => String, { description: 'The ID of the associated user' })
  userId: string;

  /**
   * One-time password associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'OTP must not be empty' })
  @Field(() => String, {
    description: 'One-time password associated with the connection',
    nullable: true,
  })
  otp?: string;

  /**
   * The date when the one-time password was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'OTP created at must not be empty' })
  @IsDate({ message: 'OTP created at must be a valid date' })
  @Field(() => Date, {
    description: 'The date when the one-time password was created',
    nullable: true,
  })
  otpCreatedAt?: Date;

  /**
   * Indicates whether two-factor authentication is enabled for the connection.
   * @type {boolean}
   * @default false
   */
  @IsNotEmpty({ message: 'Is 2FA enabled must not be empty' })
  @IsBoolean({ message: 'Is 2FA enabled must be a boolean' })
  @Field(() => Boolean, {
    description:
      'Indicates whether two-factor authentication is enabled for the connection',
    defaultValue: false,
  })
  is2faEnabled: boolean;

  /**
   * The intra_42 identifier associated with the connection.
   * @type {number}
   */
  @IsNotEmpty({ message: 'Intra_42 must not be empty' })
  @IsInt({ message: 'Intra_42 must be an integer' })
  @Field(() => Int, {
    description: 'The intra_42 identifier associated with the connection',
    nullable: true,
  })
  intra_42?: number;

  /**
   * The date when the connection was created.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Created at must not be empty' })
  @IsDate({ message: 'Created at must be a valid date' })
  @Field(() => Date, {
    description: 'The date when the connection was created',
  })
  createdAt: Date;

  /**
   * The date when the connection was last updated.
   * @type {Date}
   */
  @IsNotEmpty({ message: 'Updated at must not be empty' })
  @IsDate({ message: 'Updated at must be a valid date' })
  @Field(() => Date, {
    description: 'The date when the connection was last updated',
  })
  updatedAt: Date;
}
