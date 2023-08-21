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

  /**
   * Finds a connection by the user's 42 intra ID.
   * @param intra_42 The user's 42 intra ID.
   * @returns The connection.
   */
  async findConnectionByUserId(intra_42: number) {
    try {
      return this.prisma.connection.findFirst({
        where: {
          intra_42,
        },
      });
    } catch (e) {
      return null;
    }
  }
}
