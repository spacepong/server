import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { NewConnectionInput } from './dto/new-connection.input';
import { Connection } from './entities/connection.entity';

/**
 * Service class for handling operations related to connections.
 *
 * @export
 * @class ConnectionService
 * @module connection
 */
@Injectable()
export class ConnectionService {
  /**
   * Creates an instance of the ConnectionService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new connection.
   *
   * @param {NewConnectionInput} newConnectionInput - The input data for the new connection.
   * @returns {Promise<any>} The created connection.
   */
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
   * Retrieves a connection by the 42 user's ID.
   *
   * @param {string} intra_42 - The ID of the 42 user.
   * @returns {Promise<Connection>} The connection with the specified ID.
   * @throws {NotFoundException} If the connection is not found.
   */
  async findConnectionByUserId(intra_42: number): Promise<Connection> {
    try {
      return this.prisma.connection.findFirst({
        where: {
          intra_42,
        },
      });
    } catch (e) {
      throw new NotFoundException('Connection not found');
    }
  }
}
