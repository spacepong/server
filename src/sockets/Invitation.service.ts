import { Injectable } from '@nestjs/common';
import { InviteDictionary } from "./types/Invitation";
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketUser } from './types/socket-user';
import { SocketService } from './socket.service';

@Injectable()
export class InvitationService {
    constructor(
        private readonly socketService: SocketService,
        ) {}

    private gameInvites: InviteDictionary[] = [];
    
    addInvite(client: Socket , body: any): InviteDictionary {
        console.log(client.id);
        console.log(body.invited.userId);
        let inviteInfo: InviteDictionary = {
            gameId: uuidv4(), // Use uuidv4 here
            inviter: {
                userId: this.socketService.getUserId(client.id),
                socketId: this.socketService.getUserSocketIds(this.socketService.getUserId(client.id))[0],
                accepted: false,
            },
            invited: {
                userId: body.invited.userId,
                socketId: this.socketService.getUserSocketIds(body.invited.userId)[0],
                accepted: false,
            }
        }

        this.gameInvites.push(inviteInfo);
        return inviteInfo;
    }

    getInviteInfoBySocketId(socketId: string): InviteDictionary {
        return this.gameInvites.find((invite: InviteDictionary) => invite.inviter.socketId == socketId || invite.invited.socketId == socketId);
    }
    
    notify(io: Server, inviter: Socket){
        let inviteInfo: InviteDictionary = this.getInviteInfoBySocketId(inviter.id);
        io.to(inviteInfo.invited.socketId).emit('receiveInvite');
    }

    acceptInvite(io: Server , Invited: Socket, body: any): InviteDictionary {
        let inviteInfo: InviteDictionary = this.getInviteInfoBySocketId(Invited.id);
        if (body.option == 'accept'){
            inviteInfo.invited.accepted = true;
            io.to(inviteInfo.inviter.socketId).emit('inviteAccepted');
        }
        else if (body.option == 'reject'){
            inviteInfo.invited.accepted = false;
            io.to(inviteInfo.inviter.socketId).emit('inviteRejected');
            this.gameInvites = this.gameInvites.filter((invite: InviteDictionary) => invite !== inviteInfo);
        }
        return inviteInfo;
    }

    confirmInvite(io: Server, inviter: Socket, body: any): InviteDictionary {
        let inviteInfo: InviteDictionary = this.getInviteInfoBySocketId(inviter.id);
        if (body.option == 'accept'){
            inviteInfo.inviter.accepted = true;
            if (inviteInfo.invited.accepted){
                io.to(inviteInfo.invited.socketId).emit('inviteConfirmed', inviteInfo);
                io.to(inviteInfo.inviter.socketId).emit('inviteConfirmed', inviteInfo);
                this.gameInvites = this.gameInvites.filter((invite: InviteDictionary) => invite !== inviteInfo);
            }
                
        }
        else if (body.option == 'reject'){
            inviteInfo.inviter.accepted = false;
            io.to(inviteInfo.invited.socketId).emit('inviteRejected');
            this.gameInvites = this.gameInvites.filter((invite: InviteDictionary) => invite !== inviteInfo);
        }
        return inviteInfo;
    }

    
}
