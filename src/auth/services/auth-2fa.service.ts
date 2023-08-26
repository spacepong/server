import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import { userIncludes } from 'src/includes/user.includes';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

/**
 * Service responsible for two-factor authentication (2FA) related functionality.
 *
 * @export
 * @class Auth2faService
 */
@Injectable()
export class Auth2faService {
  /**
   * Creates an instance of the Auth2faService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   * @param {ConfigService} configService - The configuration service for accessing application configuration.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates a 2FA secret and OTP authentication URL for a user.
   *
   * @param {string} userId - User ID.
   * @param {string} username - Username of the user.
   * @returns {Promise<{ secret: string; otpAuthUrl: string }>} - The generated 2FA secret and OTP authentication URL.
   */
  async generate2faSecret(
    userId: string,
    username: string,
  ): Promise<{ secret: string; otpAuthUrl: string }> {
    const secret: string = authenticator.generateSecret();
    const otpAuthUrl: string = authenticator.keyuri(
      username,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.set2faSecret(userId, secret);
    return { secret, otpAuthUrl };
  }

  /**
   * Sets a 2FA secret for a user.
   *
   * @param {string} userId - User ID.
   * @param {string} secret - 2FA secret.
   * @returns {Promise<User>} - The updated user object.
   */
  async set2faSecret(userId: string, secret: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connection: {
          update: {
            otp: secret,
            otpCreatedAt: new Date(),
          },
        },
      },
      include: userIncludes,
    });
  }

  /**
   * Generates a QR code data URL from an OTP authentication URL.
   *
   * @param {string} otpAuthUrl - OTP authentication URL.
   * @returns {Promise<string>} - The generated QR code data URL.
   */
  async generateQrCodeDataURL(otpAuthUrl: string): Promise<string> {
    return toDataURL(otpAuthUrl);
  }

  /**
   * Enables two-factor authentication (2FA) for a user.
   *
   * @param {string} userId - User ID.
   * @returns {Promise<User>} - The updated user object with 2FA enabled.
   */
  async turnOn2fa(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connection: {
          update: {
            is2faEnabled: true,
          },
        },
      },
      include: userIncludes,
    });
  }

  /**
   * Disables two-factor authentication (2FA) for a user.
   *
   * @param {string} userId - User ID.
   * @returns {Promise<User>} - The updated user object with 2FA disabled.
   */
  async turnOff2fa(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connection: {
          update: {
            otp: null,
            otpCreatedAt: null,
            is2faEnabled: false,
          },
        },
      },
      include: userIncludes,
    });
  }

  /**
   * Verifies a 2FA token for a user.
   *
   * @param {string} userId - User ID.
   * @param {string} token - 2FA token to verify.
   * @returns {Promise<boolean>} - Whether the 2FA token is valid.
   * @throws {ForbiddenException} - If 2FA is not enabled for the user.
   */
  async verify2faToken(userId: string, token: string): Promise<boolean> {
    const user: User = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: userIncludes,
    });

    if (!user) return false;

    if (!user.connection.otp)
      throw new ForbiddenException('2FA is not enabled');

    return authenticator.verify({
      token,
      secret: user.connection.otp,
    });
  }
}
