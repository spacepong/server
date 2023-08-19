import { Injectable } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { UpdateAuthInput } from './dto/update-auth.input';
import { SignUpInput } from './dto/signup.input';
import { SignResponse } from './dto/sign.response';
import { Status } from 'src/user/enums/status.enum';

registerEnumType(Status, {
  name: 'Status',
  description: 'The status of the user',
});

/**
 * Service responsible for authentication-related functionality.
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of the AuthService class.
   */
  constructor() {}

  /**
   * Creates a new user account through the signup process.
   *
   * @param {SignUpInput} signUpInput - Input data for user signup.
   * @returns {Promise<SignResponse>} - Access and refresh tokens and user data.
   * @throws {ConflictException} If a user with the provided username or email already exists.
   */
  async signup(signUpInput: SignUpInput): Promise<SignResponse> {
    signUpInput;
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      user: {
        id: 1,
        username: 'username',
        profileComplete: false,
        rank: 0,
        status: Status.ONLINE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    updateAuthInput;
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
