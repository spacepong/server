import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import {
  SocketIOMiddleware,
  WebsocketMiddleware,
} from 'src/auth/middlewares/websocket.middleware';
import { ChatService } from './chat.service';
import { WebsocketGuard } from 'src/auth/guards/websocket.guard';

@WebSocketGateway({ cors: true })
@UseGuards(WebsocketGuard)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  private server: Server;

  afterInit(client: Socket) {
    client.use(WebsocketMiddleware() as SocketIOMiddleware as any);
  }

  handleConnection(client: Socket) {
    client;
  }

  handleDisconnect(client: Socket): WsResponse<void> {
    const userId: string = this.chatService.removeUser(client.id);
    if (!userId) return;

    this.server.emit('users', this.chatService.getUserIds());
    this.server.emit('message', {
      userId: 'system',
      message: `${userId} has left the chat`,
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { data: string }): WsResponse<void> {
    const userId: string = this.chatService.getUserId(client.id);
    if (!userId) return;

    this.server.emit('message', {
      userId,
      message: payload.data,
    });
  }

  @SubscribeMessage('add-user')
  handleAddUser(client: Socket, payload: { userId: string }): WsResponse<void> {
    const userId: string = this.chatService.addUser(client.id, payload.userId);
    if (!userId) return;

    this.server.emit('users', this.chatService.getUserIds());
    this.server.emit('message', {
      userId: 'system',
      message: `${payload.userId} has joined the chat`,
    });
  }
}
