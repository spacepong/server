import { socket } from './../../../../client/src/store/socket';
export interface InviteDictionary{
    gameId: string; //“###”,
    inviter: {
    userId: string; // “myId”,
    socketId: string; // “socketId”,
    accepted: boolean; // false,
    },
    invited: {
    userId: string; //“yourId”,
    socketId: string; //“socketId”,
    accepted: boolean; //false,
    }
}