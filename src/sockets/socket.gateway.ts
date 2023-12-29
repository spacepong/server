import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  MessageBody,
  ConnectedSocket
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
import { v4 as uuidv4 } from 'uuid';
import { lobby } from 'src/game/game_logic/gameWizzard';

@WebSocketGateway({ cors: true })
@UseGuards(WebsocketGuard)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  /**
   * Map of lobbies, key is lobbyId
   */
  private lobbies: Map<string,lobby> = new Map<string, lobby>();
  /**
   * Map of clients waiting to be matched, key is client id
   */
  private queue: Map<string,Socket> = new Map<string, Socket>();

  /**
   * Map of players in lobby, key is client id
   */
  private playersLobby: Map<string,lobby> = new Map<string, lobby>();
  constructor(
    private readonly socketService: SocketService,
    private readonly channelService: ChannelService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  public afterInit(client: Socket) {
    client.use(WebsocketMiddleware() as SocketIOMiddleware as any);
  }
  private removeFromGame(client: Socket) {

    // remove from queue
    if (this.queue.delete(client.id)) {
        console.log(`removing ${client.id} from queue`);
        // cleanup client
        client.offAny();
        client._cleanup();
        client.removeAllListeners();
        // distroy socket
        client.disconnect(true);
    } 
    // remove from lobby
    else {
      if (this.playersLobby.has(client.id)) {
        console.log(`removing ${client.id} from lobby`);
        const lobby = this.playersLobby.get(client.id);
        if (lobby == undefined)
            return;
        lobby.removePlayer(client);
        this.lobbies.delete(lobby.id);
        lobby.dispose();
        this.playersLobby.delete(client.id);

        // cleanup client
        client.offAny();
        client._cleanup();
        client.removeAllListeners();
        // distroy socket
        client.disconnect(true);
      }

    }

  }

  public handleConnection(client: Socket) {
    console.log(`${client.id} connected`);
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
    this.removeFromGame(client);
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
  @SubscribeMessage('queueUp')
  public handleQueueUp(@ConnectedSocket() client: Socket): void {
    console.log(`${client.id} is queueing up`);
    this.queue.set(client.id, client);

    if (this.queue.size >= 2) {
        console.log(`queue is full with ${this.queue.size} players`);
        let gameId: string = uuidv4();
        console.log(`creating new game with id ${gameId}`);
        this.queue.forEach((client, id) => {
            client.emit('gameId', gameId);
            this.queue.delete(id);
        });
    }
    
  }

  @SubscribeMessage('joinLobby')
  public handleJoinGame3d(@MessageBody() lobbyId: string, @ConnectedSocket() client: Socket): void {
    if (this.lobbies.has(lobbyId)) {
      console.log(`${client.id} is joining existing lobby: ${lobbyId}`);
      const lobby = this.lobbies.get(lobbyId);
      if (lobby == undefined)
          return;
      this.playersLobby.set(client.id, lobby);
      lobby.addPlayer(client);
  }
  else {
      console.log('creating new lobby');
      let newLobby: lobby = new lobby(lobbyId, this.server);
      this.lobbies.set(lobbyId, newLobby);
      this.playersLobby.set(client.id, newLobby);
      newLobby.addPlayer(client);
  }
  }
}
