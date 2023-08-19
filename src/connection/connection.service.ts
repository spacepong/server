import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { NewConnectionInput } from './dto/new-connection.input';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}

  async createConnection(newConnectionInput: NewConnectionInput) {
    const connection = await this.prisma.connection.create({
      data: {
        user: {
          connect: {
            id: newConnectionInput.user.id,
          },
        },
        userId: newConnectionInput.user.id,
        email: newConnectionInput.email,
        password: newConnectionInput.password,
        intra_42: newConnectionInput.intra_42,
      },
    });
    return connection;
  }
}
