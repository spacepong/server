import { Resolver } from '@nestjs/graphql';
import { KickService } from './kick.service';

@Resolver()
export class KickResolver {
  constructor(private readonly kickService: KickService) {}
}
