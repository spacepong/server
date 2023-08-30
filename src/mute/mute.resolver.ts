import { Resolver } from '@nestjs/graphql';
import { MuteService } from './mute.service';

@Resolver()
export class MuteResolver {
  constructor(private readonly muteService: MuteService) {}
}
