import { Socket } from 'socket.io';

export interface SocketUser {
  userId: string;
  sockets: Socket[];
}
