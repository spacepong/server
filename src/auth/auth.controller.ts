import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { SignResponse } from 'src/auth/dto/sign.response';
import { Intra42Guard } from 'src/auth/guards/intra42.guard';
import { SignIn2faInput } from './dto/signin-2fa.input';
import { Auth2faService } from './services/auth-2fa.service';

/**
 * Controller class for handling authentication-related HTTP requests.
 *
 * @export
 * @class AuthController
 */
@Controller('/')
export class AuthController {
  /**
   * Creates an instance of the AuthController class.
   *
   * @param {AuthService} authService - The authentication service for handling user sign-in.
   * @param {ConfigService} configService - The configuration service for accessing application configuration.
   * @param {Auth2faService} auth2faService - The service responsible for two-factor authentication (2FA) related functionality.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly auth2faService: Auth2faService,
  ) {}

  /**
   * Endpoint for handling the Intra42 OAuth2 callback.
   * Signs in the user, sets the access token as a cookie, and redirects to the frontend.
   *
   * @param {*} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Promise representing the completion of the callback process.
   */
  @Public()
  @UseGuards(Intra42Guard)
  @Get('/callback')
  async intraCallback(@Req() req: any, @Res() res: Response): Promise<void> {
    // Sign in the user
    const response: SignResponse = await this.authService.signin(req.user);

    // Set the access token as a cookie
    res.cookie('accessToken', response.accessToken, {
      // Cookie is not accessible via client-side JavaScript for better security
      httpOnly: false,
      // Cookie is only sent to the server via HTTPS
      secure: false,
    });

    // Redirect the user to the frontend
    res.redirect(this.configService.get<string>('FRONTEND_URL'));
  }

  /**
   * Endpoint for signing in the user using 2FA.
   * Verifies the 2FA token, signs in the user, sets the access token as a cookie, and redirects to the frontend.
   *
   * @param {SignIn2faInput} signIn2faInput - Input containing user ID and 2FA token.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - Promise representing the completion of the sign-in process.
   * @throws {ForbiddenException} - If the provided 2FA token is invalid.
   */
  @Public()
  @Post('/2fa')
  async signin2fa(
    @Body() signIn2faInput: SignIn2faInput,
    @Res() res: Response,
  ): Promise<void> {
    // Verify the 2FA token
    const isTokenValid: boolean = await this.auth2faService.verify2faToken(
      signIn2faInput.userId,
      signIn2faInput.token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    // Sign in the user using 2FA
    const response: SignResponse =
      await this.authService.signin2fa(signIn2faInput);

    // Set the access token as a cookie
    res.cookie('accessToken', response.accessToken, {
      // Cookie is not accessible via client-side JavaScript for better security
      httpOnly: false,
      // Cookie is only sent to the server via HTTPS
      secure: false,
    });

    // Redirect the user to the frontend
    res.json({ accessToken: response.accessToken });
  }
}