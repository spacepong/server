import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
  constructor() {
    super({
      clientID: process.env.INTRA42_CLIENT_ID,
      clientSecret: process.env.INTRA42_CLIENT_SECRET,
      callbackURL: process.env.INTRA42_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    return profile;
  }
}
