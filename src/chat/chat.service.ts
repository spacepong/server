import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor() {}

  private users: Map<string, string> = new Map();

  addUser(socketId: string, userId: string): string {
    if (this.users.has(socketId)) return;
    this.users.set(socketId, userId);
    return socketId;
  }

  removeUser(socketId: string): string {
    const userId: string = this.users.get(socketId);
    if (userId) this.users.delete(socketId);
    return userId;
  }

  getUserId(socketId: string): string {
    return this.users.get(socketId);
  }

  getSocketId(userId: string): string {
    return this.users.get(userId);
  }

  getUserIds(): string[] {
    return Array.from(this.users.values());
  }

  getSocketIds(): string[] {
    return Array.from(this.users.keys());
  }
}
