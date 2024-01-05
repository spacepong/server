import { clearTimeout } from 'timers';
import {ball , Player, arena} from './utils/gameObjects';
import { Vector3, customRand } from './utils/math'
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { MatchService } from 'src/match/match.service';
/**
 * Represents a game.
 * @class
 */
@Injectable()
export class GameService {

    public playerL: Player;
    public playerR: Player;
    public ball: ball;
    public arena: arena;
    public interval: any;
    public io: Server;
    public id: string;
    private isFinished: boolean = false;

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

    constructor(
        private readonly matchService: MatchService,
        players: Player[], ball: ball, arena: arena, io: Server, id: string) {

        if (players.length != 2)
            throw new Error('invalid number of players');
        this.io = io;
        this.id = id;
        this.playerL = players[0];
        this.playerR = players[1]; 
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
        }, 5000);
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
    async finish() {

        if (this.isFinished)
            return;
        let winnerId: string;
        let loserId: string
        if (this.playerL.isWinner) {
            this.playerL.win();
            winnerId = this.playerL.playerId
            this.playerR.lose();
            loserId = this.playerR.playerId;
        }
        else {
            this.playerR.win();
            winnerId = this.playerR.playerId;
            this.playerL.lose();
            loserId = this.playerL.playerId;
        }
        this.isFinished = true;
        const newMatchInput = {
            score: [this.playerR.Score, this.playerL.Score],
            winnerId,
            loserId,
        };

        await this.matchService.createMatch(newMatchInput);
        console.log(`game finished with ${this.playerL.Score} - ${this.playerR.Score}`);
        this.dispose();
        console.log('game finished');
    }

    public forfeit(playerSocketId: string) {

        clearInterval(this.interval);
        console.log(`player ${playerSocketId} forfeited`);
        if (this.playerL.socket.id == playerSocketId) {
            this.playerL.FF();
            this.playerL.Score = 0;
            this.playerR.Score = 5;
        }
        else if (this.playerR.socket.id == playerSocketId){
            this.playerR.FF();
            this.playerR.Score = 0;
            this.playerL.Score = 5;
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
