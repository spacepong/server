import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketGuard } from 'src/auth/guards/websocket.guard';
import {
  SocketIOMiddleware,
  WebsocketMiddleware,
} from 'src/auth/middlewares/websocket.middleware';

@WebSocketGateway({ cors: true })
@UseGuards(WebsocketGuard)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private users: Map<string, string> = new Map();

  afterInit(client: Socket) {
    client.use(WebsocketMiddleware() as SocketIOMiddleware as any);
  }

  handleConnection(client: Socket) {
    client;
  }

  handleDisconnect(client: Socket) {
    if (!this.users.has(client.id)) return;
    this.server.emit('users', [...this.users.values()]);
    this.server.emit('message', {
      userId: 'system',
      message: `${this.users.get(client.id)} has left the chat`,
    });
    this.users.delete(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { data: string }): void {
    this.server.emit('message', {
      userId: this.users.get(client.id),
      message: payload.data,
    });
  }

  @SubscribeMessage('add-user')
  handleAddUser(client: Socket, payload: { userId: string }): void {
    if (this.users.has(client.id)) return;
    this.users.set(client.id, payload.userId);
    this.server.emit('users', [...this.users.values()]);
    this.server.emit('message', {
      userId: 'system',
      message: `${payload.userId} has joined the chat`,
    });
  }
}
