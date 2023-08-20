import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsDate, IsEmail, IsInt, IsNotEmpty } from 'class-validator';

/**
 * Represents a connection entity that stores user-related data.
 *
 * @export
 * @class Connection
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
   * The email associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Field(() => String, {
    description: 'The email associated with the connection',
    nullable: true,
  })
  email?: string;

  /**
   * The password associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Field(() => String, {
    description: 'The password associated with the connection',
    nullable: true,
  })
  password?: string;

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
