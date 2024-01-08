import { NewMatchInput } from './../../match/dto/new-match.input';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
import { SocketService } from 'src/sockets/socket.service';

@Injectable()
export class game
{
    server: Server;
    public iId: any;
    public player1: Socket;
    public player2: Socket;
  //attribute:
      //Ball:
  public pheight: number;
  public pwidth: number;
  public ballX: number;
  public ballY: number;
  public ballWidth: number = 15;
  public ballHeight: number = 15;
  public ballSpeed: number = 2;
  public ballDirectionX: number = -1;
  public ballDirectionY: number = 1;
  //Player1:
  public p1X: number = 10;
  public p1Y: number;
  // Player2
  public p2X: number;
  public p2Y: number;
  // Player size
  public playerWidth: number = 20;
  public playerHeight: number = 100;
  public pSpeed: number = 5;
  //Scoreboard:
  public p1Score: number = 0;
  public p2Score: number = 0;
  public stage: number;
  public col: number = 0;
  //room
  public room: string;
  public isGameFinished: boolean = false;
    public player1Id :string;
    public player2Id :string;

  constructor(
    private readonly matchService: MatchService,
    private readonly socketService: SocketService,
    room: string, server: Server, p1: Socket, p2 : Socket, data: { width: number, height: number }) {
    console.log(`game created with id ${room}`);
    this.pheight = data.height;
    this.pwidth = data.width;
    this.p1X = 10;
    this.p1Y = this.pheight/2;
    this.p2X= this.pwidth - 10;
    this.p2Y= this.pheight/2;
    this.ballX = this.pwidth / 2;
    this.ballY = this.pheight / 2;
    this.p1Score = 0;
    this.p2Score = 0;
    this.room = room;
    this.server = server;
    this.player1Id = p1.handshake.query.userId as string;
    this.player2Id = p2.handshake.query.userId as string;
    this.server.to(this.room).emit("startGame",{
        gamer1: {
            id: p1.id,
            side: 1
        },
        gamer2:{
            id: p2.id,
            side: 2
        }
    });
    this.player1 = p1;
    this.player2 = p2;
  }


  startGame()
  {
    let playerLMainSocket = this.socketService.getUserSocketIds(this.player1Id);
    let playerRMainSocket = this.socketService.getUserSocketIds(this.player2Id);
    playerLMainSocket.forEach(socketId=>{

        this.server.to(socketId).emit("playerInGame",this.player1Id);
    });
    playerRMainSocket.forEach(socketId=>{

        this.server.to(socketId).emit("playerInGame",this.player2Id);
    })
    console.log(`game ${this.room}: started`);
    this.handleBallUpdates();
    this.player1.on('moveP1Up',(data)=>{
        // console.log('moveP1UP event is trigred');
        this.handleP1MoveUp();
    });
    this.player1.on('moveP1Down',(data)=>{
        // console.log('moveP1down event is trigred');
        this.handleP1MoveDown();
    });
    this.player2.on('moveP2Up',(data)=>{
        // console.log('moveP2up event is trigred');
        this.handleP2MoveUp();
    });
    this.player2.on('moveP2Down',(data)=>{
        // console.log('moveP2down event is trigred');
        this.handleP2MoveDown();
    });
  }

//   @SubscribeMessage('ballUpdates')
  handleBallUpdates(): void {
    // console.log("BALL");
      this.iId = setInterval(() => {
          // console.log("YO WHO LET YOU IN HEEEEEREEE??????!!!");
      //physics:
      this.ballX = this.ballX + (this.ballDirectionX*this.ballSpeed);
      this.ballY = this.ballY + (this.ballDirectionY*this.ballSpeed);
      //colisions:
          //with walls:
      if(this.ballY >= this.pheight)
      {
          this.ballDirectionY = this.ballDirectionY*-1;
      }
      if(this.ballY <= 0)
      {
          this.ballDirectionY = this.ballDirectionY*-1;
      }
          //with paddles:        
      if(this.ballX <= this.p1X + 20 && this.col == 0)
          this.col = this.ballX;
      if(this.ballX == this.col && this.ballY >= this.p1Y - 60 && this.ballY <= this.p1Y + 60)
      {
          this.ballDirectionX = this.ballDirectionX * -1;//change direction
      }
      if(this.ballX >= this.p2X - 20 && this.ballX <= this.p2X + 20 && this.ballY >= this.p2Y - 60 && this.ballY <= this.p2Y + 60)
      {
          this.ballDirectionX = this.ballDirectionX * -1;//change direction
      }
      if(this.ballX <= 0)
      {
          //off left wall - p1 missed
          this.p2Score = this.p2Score+1;
          this.ballX = this.pwidth/2;
          this.ballY = this.pheight/2;
      }
      if(this.ballX >= this.pwidth)
      {
          //off left wall - p1 missed
          this.p1Score = this.p1Score+1;
          this.ballX = this.pwidth/2;
          this.ballY = this.pheight/2;
      }

      //stages according to scores
      if(this.p1Score >= 5)
      {
          this.stage = 2;
          this.writeScore();
          this.isGameFinished = true;
          clearInterval(this.iId);
      }
      if(this.p2Score >= 5)
      {
          this.stage = 3;
          this.writeScore();
          this.isGameFinished = true;
          clearInterval(this.iId);
      }
      if (this.player1 && this.player2) 
          this.server.to(this.room).emit('updateBall', { ballX: this.ballX, ballY: this.ballY, stage: this.stage, p2Score: this.p2Score, p1Score: this.p1Score });    
      }, 1000 / 60);
  }

  //P1:
  handleP1MoveUp(): void {
      this.p1Y = this.p1Y - this.pSpeed;
      if(this.p1Y < 50)
          this.p1Y = 50;
      // console.log("PLAYER1 IS:", this.player1);
      this.server.to(this.room).emit('p1UpPosition', { p1Y: this.p1Y});
  }

  handleP1MoveDown(): void {
      this.p1Y = this.p1Y + this.pSpeed;
      if(this.p1Y > this.pheight - 50)
          this.p1Y = this.pheight - 50;
      this.server.to(this.room).emit('p1DownPosition', { p1Y: this.p1Y});
  }

  //P2:
  handleP2MoveUp(): void {
      this.p2Y = this.p2Y - this.pSpeed;
      if(this.p2Y < 50)
          this.p2Y = 50;
      this.server.to(this.room).emit('p2UpPosition', { p2Y: this.p2Y});
  }

  handleP2MoveDown(): void {
      this.p2Y = this.p2Y + this.pSpeed;
      if(this.p2Y > this.pheight - 50)
          this.p2Y = this.pheight - 50;
      this.server.to(this.room).emit('p2DownPosition', { p2Y: this.p2Y});
  }

  async writeScore() {

    let wId: string;
    let lId: string;

    if (this.p1Score > this.p2Score) {
        wId = this.player1.handshake.query.userId as string;
        lId = this.player2.handshake.query.userId as string;
    } else {
        wId = this.player2.handshake.query.userId as string;
        lId = this.player1.handshake.query.userId as string;
    }

    const newMatchInput: NewMatchInput = {
        score: [this.p1Score, this.p2Score],
        winnerId: wId,
        loserId: lId,
    };
    console.log(newMatchInput);
    await this.matchService.createMatch(newMatchInput);
}


  endGame(client: Socket) 
  {
    let playerLMainSocket = this.socketService.getUserSocketIds(this.player1Id);
    let playerRMainSocket = this.socketService.getUserSocketIds(this.player2Id);

    playerLMainSocket.forEach(socketId =>{

        this.server.to(socketId).emit("playerOffGame",this.player1Id);
    })

    playerRMainSocket.forEach(socketId =>{

        this.server.to(socketId).emit("playerOffGame",this.player2Id);
    })
    if(this.isGameFinished == true)
        return ;
    let loser;
    let winner;
    if(client.id == this.player1.id){
        this.p2Score = 5;
        this.p1Score = 0;
        this.stage = 3;
        loser = this.player1;
        winner = this.player2;
    }
    else if (client.id == this.player2.id)
    {
        this.p1Score = 5;
        this.p2Score = 0;
        this.stage = 2;
        loser = this.player2;
        winner = this.player1;
    }
    this.writeScore();
    this.isGameFinished = true;
    clearInterval(this.iId);
    this.server.to(this.room).emit('updateBall', { ballX: this.ballX, ballY: this.ballY, stage: this.stage, p2Score: this.p2Score, p1Score: this.p1Score });
    this.player1.leave(this.room);
    this.player2.leave(this.room);
}
}