import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Intra42Guard extends AuthGuard('intra42') {}
