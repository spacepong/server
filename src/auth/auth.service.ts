// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAccessTokenResponse } from './dto/new-access-token.response';
import { SignResponse } from './dto/sign.response';

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
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   * @param {ConfigService} configService - The configuration service for accessing application configuration.
   * @param {JwtService} JwtService - The JWT service for generating and verifying tokens.
   */
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private JwtService: JwtService,
  ) {}
  async signin(signInInput: any): Promise<SignResponse> {
    let user: User = null;
    try {
      user = await this.prisma.user.findFirst({
        where: {
          connection: {
            intra_42: signInInput.profile._json.id,
          },
        },
        include: {
          lost: true,
          won: true,
          avatar: true,
          connection: true,
        },
      });
    } catch (e) {}
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          avatar: {
            create: {
              defaultFilename: signInInput.profile._json.image.link,
              filename: signInInput.profile._json.image.link,
            },
          },
          connection: {
            create: {
              intra_42: signInInput.profile._json.id,
              email: signInInput.profile._json.email,
            },
          },
          username: signInInput.profile.username,
        },
        include: {
          lost: true,
          won: true,
          avatar: true,
          connection: true,
        },
      });
    }

    const accessToken: string = await this.createAccessToken(
      user.id,
      signInInput.accessToken,
    ).then((response: NewAccessTokenResponse) => response.accessToken);

    return {
      accessToken,
      intra42AccessToken: signInInput.accessToken,
      intra42RefreshToken: signInInput.refreshToken,
      user,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  /**
   * Creates an access token for the provided user ID and Intra42 access token.
   *
   * @param {string} userId - User ID.
   * @param {string} intra42AccessToken - Intra42 access token.
   * @returns {Promise<NewAccessTokenResponse>} - The user's access token.
   */
  async createAccessToken(
    userId: string,
    intra42AccessToken: string,
  ): Promise<NewAccessTokenResponse> {
    return {
      accessToken: this.JwtService.sign(
        { userId, intra42AccessToken },
        {
          algorithm: 'HS256',
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        },
      ),
    };
  }
}
