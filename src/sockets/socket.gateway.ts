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
import { SocketService } from './socket.service';
import { ChannelService } from 'src/channel/channel.service';
import {
  WebsocketGuard,
  getClientHandshake,
} from 'src/auth/guards/websocket.guard';
import { Channel } from 'src/channel/entities/channel.entity';
import { isEmpty } from 'src/utils/is-empty';

@WebSocketGateway({ cors: true })
@UseGuards(WebsocketGuard)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly channelService: ChannelService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  public afterInit(client: Socket) {
    client.use(WebsocketMiddleware() as SocketIOMiddleware as any);
  }

  public handleConnection(client: Socket) {
    const userId: string = this.socketService.addUser(
      client,
      getClientHandshake(client, 'userId'),
    );
    if (!userId) return;

    this.server.emit('users', this.socketService.getUserIds());

    this.channelService
      .getChannelsByUserId(userId)
      .then((channels: Channel[]) => {
        channels.forEach((channel: Channel) => {
          client.join(channel.id);
        });
      });
  }

  public handleDisconnect(client: Socket): WsResponse<void> {
    const userId: string = this.socketService.removeUser(client.id);
    if (!userId) return;

    this.server.emit('users', this.socketService.getUserIds());

    this.channelService
      .getChannelsByUserId(userId)
      .then((channels: Channel[]) => {
        channels.forEach((channel: Channel) => {
          client.leave(channel.id);
        });
      });
  }

  @SubscribeMessage('message')
  public handleMessage(
    client: Socket,
    payload: { roomId: string; message: string },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (isEmpty(payload.message))
      client.emit('error', {
        message: 'Message cannot be empty',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('message', {
        userId,
        message: payload.message,
      });
  }

  @SubscribeMessage('typing')
  public handleTyping(
    client: Socket,
    payload: { roomId: string; typing: boolean },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('typing', {
        userId,
        typing: payload.typing,
      });
  }

  @SubscribeMessage('mute')
  public handleMute(
    client: Socket,
    payload: {
      roomId: string;
      userId: string;
      duration: number;
      reason?: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (isEmpty(payload.userId))
      client.emit('error', {
        message: 'User ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('mute', {
        userId,
        muted: payload.userId,
        duration: payload.duration,
        reason: payload.reason,
      });
  }

  @SubscribeMessage('unmute')
  public handleUnmute(
    client: Socket,
    payload: {
      roomId: string;
      userId: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (isEmpty(payload.userId))
      client.emit('error', {
        message: 'User ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('unmute', {
        userId,
        unmuted: payload.userId,
      });
  }

  @SubscribeMessage('kick')
  public handleKick(
    client: Socket,
    payload: {
      roomId: string;
      userId: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (isEmpty(payload.userId))
      client.emit('error', {
        message: 'User ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('kick', {
        userId,
        kicked: payload.userId,
      });
  }

  @SubscribeMessage('ban')
  public handleBan(
    client: Socket,
    payload: {
      roomId: string;
      userId: string;
      reason?: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (isEmpty(payload.userId))
      client.emit('error', {
        message: 'User ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('ban', {
        userId,
        banned: payload.userId,
        reason: payload.reason,
      });
  }

  @SubscribeMessage('unban')
  public handleUnban(
    client: Socket,
    payload: {
      roomId: string;
      userId: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (isEmpty(payload.userId))
      client.emit('error', {
        message: 'User ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else
      this.server.to(payload.roomId).emit('unban', {
        userId,
        unbanned: payload.userId,
      });
  }

  @SubscribeMessage('join')
  public handleJoin(
    client: Socket,
    payload: {
      roomId: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else {
      client.join(payload.roomId);
      this.server.to(payload.roomId).emit('join', {
        userId,
      });
    }
  }

  @SubscribeMessage('leave')
  public handleLeave(
    client: Socket,
    payload: {
      roomId: string;
    },
  ): WsResponse<void> {
    const userId: string = this.socketService.getUserId(client.id);
    if (!userId) return;

    if (isEmpty(payload.roomId))
      client.emit('error', {
        message: 'Room ID is required',
      });
    else if (!client.rooms.has(payload.roomId))
      client.emit('error', {
        message: 'You are not in this channel',
      });
    else {
      client.leave(payload.roomId);
      this.server.to(payload.roomId).emit('leave', {
        userId,
      });
    }
  }
}
