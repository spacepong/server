import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsEmail, IsInt, IsNotEmpty } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

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
   * @type {number}
   */
  @IsNotEmpty({ message: 'Connection ID must not be empty' })
  @IsInt({ message: 'Connection ID must be an integer' })
  @Field(() => Number, { description: 'Unique identifier for the connection' })
  id: number;

  /**
   * The associated user entity.
   * @type {User}
   */
  @IsNotEmpty({ message: 'User must not be empty' })
  @Field(() => User, { description: 'The associated user entity' })
  user: User;

  /**
   * The ID of the associated user.
   * @type {number}
   */
  @IsNotEmpty({ message: 'User ID must not be empty' })
  @IsInt({ message: 'User ID must be an integer' })
  @Field(() => Number, { description: 'The ID of the associated user' })
  userId: number;

  /**
   * The email associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Field(() => String, {
    description: 'The email associated with the connection',
  })
  email: string;

  /**
   * The password associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Field(() => String, {
    description: 'The password associated with the connection',
  })
  password: string;

  /**
   * One-time password associated with the connection.
   * @type {string}
   */
  @IsNotEmpty({ message: 'OTP must not be empty' })
  @Field(() => String, {
    description: 'One-time password associated with the connection',
  })
  otp: string;

  /**
   * The intra_42 identifier associated with the connection.
   * @type {number}
   */
  @IsNotEmpty({ message: 'Intra_42 must not be empty' })
  @IsInt({ message: 'Intra_42 must be an integer' })
  @Field(() => Number, {
    description: 'The intra_42 identifier associated with the connection',
  })
  intra_42: number;

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
