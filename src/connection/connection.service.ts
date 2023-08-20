import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { NewConnectionInput } from './dto/new-connection.input';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}

  async createConnection(newConnectionInput: NewConnectionInput) {
    return this.prisma.connection.create({
      data: {
        ...newConnectionInput,
        user: {
          connect: {
            id: newConnectionInput.user.id,
          },
        },
      },
    });
  }
}
