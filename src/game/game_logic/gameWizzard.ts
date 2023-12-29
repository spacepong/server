import { clearTimeout } from 'timers';
import {ball , Player, arena} from './gameObjects';
import { Vector3, customRand } from './math'
import { Socket, Server } from 'socket.io';
/**
 * Represents a game.
 * @class
 */
export class Game {

    public playerL: Player;
    public playerR: Player;
    public ball: ball;
    public arena: arena;
    public interval: any;
    public io: Server;
    public id: string;

    /**
     * Creates a new Game instance.
     * @constructor
     * @param {Player[]} players - The players in the game.
     * @param {ball} ball - The ball in the game.
     * @param {arena} arena - The arena in the game.
     * @param {Server} io - The socketIo server instance.
     * @param {string} id - The id of the game.
     * @throws {Error} Invalid number of players.
     */

    constructor(players: Player[], ball: ball, arena: arena, io: Server, id: string) {

        if (players.length != 2)
            throw new Error('invalid number of players');
        this.io = io;
        this.id = id;
        this.playerL = players[0]; // left player
        this.playerR = players[1]; // right player
        this.ball = ball;
        this.arena = arena;

        this.interval = null;
    }

    /**
     * handles a score in the game and resets the ball and the players.
     * if a player wins the game is finished.
     */

    public Score() {
        let isWinner: boolean = this.ball.position.x > 0 ? this.playerL.addScore() : this.playerR.addScore();
        if (isWinner) {
            this.finish();
            // stop excution here
            return;
        }

        this.io.to(this.id).emit('score', { left: this.playerL.Score, right: this.playerR.Score});

        this.playerL.reset(this.arena);
        this.playerR.reset(this.arena);
        this.ball.reset();
        this.playerL.echoPos();
        this.playerR.echoPos();
        this.ball.setDirection(new Vector3(this.ball.position.x > 0 ? 1 : -1, 0, 0).normalize());
    }

    /**
     * checks if the ball collides with a player and handles the collision.
     */
    public checkplayersCollision(): boolean{
        if (this.playerL.checkCollision(this.ball)) {

            if (this.ball.position.z > this.playerL.position.z) {
                this.ball.direction.x *= -1;
                this.ball.slide();
            }
            else if (this.ball.position.z < this.playerL.position.z) {
                this.ball.slide();
                this.ball.direction.x *= -1;
            }
            else {
                this.ball.direction.x *= -1;
            }
            this.ball.position.x = this.playerL.position.x + this.playerL.width; 
            this.ball.increseSpeed();
            return true;
        }
        else if (this.playerR.checkCollision(this.ball)) {

            if (this.ball.position.z > this.playerR.position.z) {
                this.ball.slide();
                this.ball.direction.x *= -1;
            }
            else if (this.ball.position.z < this.playerR.position.z) {
                this.ball.direction.x *= -1;
                this.ball.slide();
            }
            else {
                this.ball.direction.x *= -1;
            }
            this.ball.position.x = this.playerR.position.x - this.playerR.width;
            this.ball.increseSpeed();
            return true;
        }
        return false;
    }

    /**
     * checks if the ball collides with the arena or a player and handles the collision.
     * in case of a goal the score is handled.
     */
    public checkCollision() {
        if (this.checkplayersCollision())
            return;
        let arenaCollision = this.arena.checkCollision(this.ball);
        switch (arenaCollision) {
            case 'bounce':
                this.ball.direction.z *= -1;
                break;
            case 'goal':
                this.Score();
                break;
            default:
                // this.checkplayersCollision();
                break;
        }

    }

    /**
     * starts the game loop.
     */

    private timeOutId: NodeJS.Timeout | null = null;
    public start() {
        this.ball.setDirection(new Vector3(...customRand.randomDirection(-30 ,30)).normalize());
        
        this.playerL.echoPos();
        this.playerR.echoPos();

        this.playerL.emitPOS();
        this.playerR.emitPOS();

        this.playerL.updateMoves();
        this.playerR.updateMoves();

        this.ball.emitPOS();

        this.timeOutId = setTimeout(() => {
            this.gameLoop();
        }, 3000);
    }

    /**
     * the game loop.
     */
    private gameLoop() {
        let lastTime: number = Date.now();

        this.interval = setInterval(() => {
            const currentTime: number = Date.now();
            const deltaTime: number = (currentTime - lastTime) / 1000; // Convert to seconds

            console
            this.ball.emitPOS();
            this.playerR.emitPOS();
            this.playerL.emitPOS();
            this.ball.position.add(this.ball.direction.clone().multiplyScalar(this.ball.speed * deltaTime));
            this.checkCollision();
            this.ball.emitPOS();
            this.playerR.emitPOS();
            this.playerL.emitPOS();

            lastTime = currentTime;
        }, 1000 / 160);

    }
    /**
    * finishes the game.
    */
    finish() {
        if (this.playerL.isWinner) {
            this.playerL.win();
            this.playerR.lose();
        }
        else {
            this.playerR.win();
            this.playerL.lose();
        }
        this.dispose();
        console.log('game finished');
    }

    public forfeit(playerSocketId: string) {

        clearInterval(this.interval);

        if (this.playerL.socket.id == playerSocketId) {
            this.playerL.FF();
        }
        else if (this.playerR.socket.id == playerSocketId){
            this.playerR.FF();
        }
        this.finish();
    }

    public dispose() {
        if (this.timeOutId)
            clearTimeout(this.timeOutId);
        if (this.interval)
            clearInterval(this.interval);
        this.playerL.dispose();
        this.playerR.dispose();
        this.ball.dispose();
    }



}

export type playerInfo = {
    playerSocket: any,
    isReady: boolean,
    inGame: boolean
}

export type sideSet = {
    side: string,
    pos: Vector3
}

/**
 * Represents a lobby.
 */
export class lobby {
    public id: string;
    public io: Server;
    public players: Map<playerInfo, Player | null>;
    public ball: ball;
    public arena: arena;
    public game: Game | null;
    public sides: sideSet[];
    public confiramtions: number;

    /**
     * Creates a new lobby instance.
     * @constructor
     * @param {string} id - The id of the lobby.
     * @param {Server} io - The socketIo server instance.
     */

    constructor(id: string, io: any) {
        this.id = id;
        this.io = io;
        this.players = new Map();
        this.ball = new ball();
        this.arena = new arena();
        this.game = null;
        this.sides = [
            { side: 'left', pos: new Vector3((this.arena.width / -2), 0, 0) },
            { side: 'right', pos: new Vector3((this.arena.width / 2), 0, 0) }
        ];
        this.confiramtions = 0;
    }

    /**
     * adds a player to the lobby.
     * @param {Socket} clientToAdd - The socket of the player to add.
     * @throws {Error} Lobby is full.
     */

    public addPlayer(clientToAdd: Socket) {
        if (this.players.size == 2)
            throw new Error('lobby is full');

        this.players.set({ playerSocket: clientToAdd, isReady: false , inGame: false}, null);

        clientToAdd.on('playerReady', (socketID: string) => {
            this.setReady(socketID);
        });

        console.log(`player added to lobby: ${this.id} as ${clientToAdd.id}`);
        if (this.players.size == 2)
            this.setupGame();
    }

    /**
     * sets up the game.
     */
    public setupGame() {
        // loop  over players and set their side
        if (this.game != null)
            return;
        console.log('setting up game');

        let i: number = 0;

        this.ball.mountSocket(this.io, this.id);

        this.players.forEach((player, key) => {
            let newPlayer: Player = new Player(this.sides[i].pos, this.sides[i]);
            newPlayer.mountSocket(key.playerSocket, this.id);
            this.players.set(key, newPlayer);
            key.playerSocket.join(this.id);
            key.inGame = true;
            i++;
        });

        let playerArr: Player[] | any = [...this.players.values()];

        this.game = new Game(playerArr, this.ball, this.arena, this.io, this.id);

        this.io.to(this.id).emit('startGame');
        this.game.start();

    }

    /**
     * sets a player as ready.
     * @param {string} playerSocketIdToSet - The socket id of the player to set.
     */
    public setReady(playerSocketIdToSet: string) {
        console.log(`confirmaion from ${playerSocketIdToSet}`)
        this.players.forEach((value, key) => {
            if (key.playerSocket && key.playerSocket.id == playerSocketIdToSet) {
                key.isReady = true;
                this.confiramtions++;
            }
        });

        // check if all players are ready
        if (this.confiramtions === 2) {
            console.log('confirmed - starting game ')
            this.setupGame();
        }

    }


    public dispose() {
        this.players.forEach((value, key) => {
            if (key.playerSocket) {
                key.playerSocket.leave(this.id);
            }
        });
        this.players.clear();
        if (this.game)
            this.game.dispose();
        this.game = null;
        delete this.sides;
        delete this.ball;
        delete this.arena;
    }

    /**
     * removes a player from the lobby.
     * @param {Socket} clientToRemove - The socket of the player to remove.
     */
    public removePlayer(clientToRemove: Socket) {

        this.players.forEach((value, key) => {
            if (key.playerSocket && key.playerSocket.id == clientToRemove.id) {

                    // remove player from game and finish game
                    this.game.forfeit(clientToRemove.id);
                    clientToRemove.offAny();
                    this.game.dispose();
                    delete this.game;
                    this.game = null
            }
        });

    }
}

export default{
    Game,
    lobby
}