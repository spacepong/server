import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

import { SocketUser } from './types/socket-user';

@Injectable()
export class ChatService {
  constructor() {}

  private users: SocketUser[] = [];

  addUser(socket: Socket, userId: string): string {
    !this.users.some((user: SocketUser) => user.userId === userId) &&
      this.users.push({ userId, sockets: [] });
    this.users
      .find((user: SocketUser) => user.userId === userId)
      .sockets.push(socket);
    return userId;
  }

  removeUser(socketId: string): string {
    const user: SocketUser = this.users.find((user: SocketUser) =>
      user.sockets.some((socket: Socket) => socket.id === socketId),
    );
    if (!user) return;
    user.sockets = user.sockets.filter(
      (socket: Socket) => socket.id !== socketId,
    );
    if (user.sockets.length === 0)
      this.users = this.users.filter(
        (connectedUser: SocketUser) => connectedUser.userId !== user.userId,
      );
    return user?.userId;
  }

  getUserId(socketId: string): string {
    const user: SocketUser = this.users.find((user: SocketUser) =>
      user.sockets.find((socket: Socket) => socket.id === socketId),
    );
    return user?.userId;
  }

  getUserSocketIds(userId: string): string[] {
    const user: SocketUser = this.users.find(
      (user: SocketUser) => user.userId === userId,
    );
    if (!user) return;
    return user.sockets.map((socket: Socket) => socket.id);
  }

  getUserIds(): string[] {
    return this.users.map((user: SocketUser) => user.userId);
  }

  getSocketIds(): string[] {
    return this.users.reduce(
      (socketIds: string[], user: SocketUser) => [
        ...socketIds,
        ...user.sockets.map((socket: Socket) => socket.id),
      ],
      [],
    );
  }
}
