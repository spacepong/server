import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { Auth } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { SignIn2faInput } from './dto/signin-2fa.input';
import { SignResponse } from './dto/sign.response';

/**
 * Resolver class for handling GraphQL queries and mutations related to authentication.
 *
 * @export
 * @class AuthResolver
 */
@Resolver(() => Auth)
export class AuthResolver {
  /**
   * Creates an instance of the AuthResolver class.
   *
   * @param {AuthService} authService - The authentication service used for resolving authentication-related queries and mutations.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => Auth, {
    name: 'signin2fa',
    description: 'Signs in a user with 2FA',
  })
  async signin2fa(
    @Args('signIn2faInput', { type: () => SignIn2faInput })
    signInInput: SignIn2faInput,
    @Res() res: Response,
  ): Promise<void> {
    /**
     * Verify the 2FA token.
     * If the token is invalid, throw an error.
     * Otherwise, sign in the user.
     */
    const isTokenValid: boolean = await this.authService.verify2faToken(
      signInInput.userId,
      signInInput.token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    const response: SignResponse =
      await this.authService.signin2fa(signInInput);

    // Set the access token as a cookie
    res.cookie('accessToken', response.accessToken, {
      // Cookie is not accessible via client-side JavaScript for better security
      httpOnly: true,
      // Cookie is only sent to the server via HTTPS
      secure: true,
    });

    console.log(response.accessToken);

    // Redirect the user to the frontend
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  @Mutation(() => Auth, {
    name: 'generate2faToken',
    description: 'Generates a 2FA token for the current user',
  })
  async generate2faToken(
    @Args('userId', { type: () => String }) userId: string,
    @Args('username', { type: () => String }) username: string,
  ): Promise<Auth> {
    const { otpAuthUrl } = await this.authService.generate2faSecret(
      userId,
      username,
    );
    return {
      status: '2FA token generated',
      otpAuthUrl: await this.authService.generateQrCodeDataURL(otpAuthUrl),
    };
  }

  @Mutation(() => Auth, {
    name: 'turnOn2fa',
    description: 'Turns on 2FA for the current user',
  })
  async turnOn2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Auth> {
    const isTokenValid: boolean = await this.authService.verify2faToken(
      userId,
      token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    return {
      status: '2FA turned on',
      user: await this.authService.turnOn2fa(userId),
    };
  }

  @Mutation(() => Auth, {
    name: 'turnOff2fa',
    description: 'Turns off 2FA for the current user',
  })
  async turnOff2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Auth> {
    const isTokenValid: boolean = await this.authService.verify2faToken(
      userId,
      token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    return {
      status: '2FA turned off',
      user: await this.authService.turnOff2fa(userId),
    };
  }

  @Mutation(() => Auth, {
    name: 'verify2fa',
    description: 'Verifies a 2FA token for the current user',
  })
  async verify2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Auth> {
    return {
      status: '2FA token verified',
      is2faValid: await this.authService.verify2faToken(userId, token),
    };
  }
}
