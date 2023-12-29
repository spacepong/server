
import {customRand, Vector3, Quaternion} from "./math";
import { Socket, Server } from 'socket.io';

const winScore = 5;


/**
 * Represents a ball.
 * @class
 */
export class ball {
    public position: Vector3;
    public speed: number;
    public radius: number;
    public direction: Vector3;
    public quaternion: Quaternion;
    public io: Server;
    public lobby: string;

    /** 
     * Creates a new ball instance.
     * @constructor
     * @param {Vector3} [position=new Vector3(0, 3, 0)] - The position of the ball.
     * @param {number} [speed=50] - The speed of the ball.
     * @param {number} [radius=2] - The radius of the ball.
     * */
    constructor(position: Vector3 = new Vector3(0, 3, 0), speed: number = 85, radius: number = 2) {
        this.position = position;
        this.speed = speed;
        this.radius = radius;
        this.direction = new Vector3(0, 0, 0);
        this.quaternion = new Quaternion();
        this.quaternion.set(new Vector3(0, 1, 0), customRand.degToRad(20));
    }

    /**
    * mount the SocketIo server to the ball and set the lobby name.
    * @param {Server} serverIo - The the SocketIo server to mount.
    * @param {string} lobby - The lobby name.
    */
    public mountSocket(serverIo: Server, lobby: string): void {
        this.io = serverIo;
        this.lobby = lobby;
    }

    /**
     * emmit the ball position to the all user in the lobby.
    */
    emitPOS(): void {
        if (this.io === undefined)
            return;
        this.io.to(this.lobby).emit('ballMove', { position: this.position });
    }

    /**
     * sets the ball speed.
     * @param {number} speed - The speed to set.
    */
    public setSpeed(speed: number) {
        this.speed = speed;
    }

    /**
     * increases the ball speed by 5 each time till it reaches 110.
     */
    public increseSpeed() {
        if (this.speed + 20 <= 180)
            this.speed += 20;
    }


    private timeOutId : NodeJS.Timeout | null = null;
    /**
     * resets the ball position to 0,3,0 and speed to 50.
     */
    public reset() {
        this.position.set(0, 3, 0);
        this.speed = 0;
        this.timeOutId = setTimeout(() => {
            this.speed = 85;
        }, 3000);
    }

    /**
     * sets the ball direction.
     * @param {Vector3} direction - The direction to set.
     */
    public setDirection(direction: Vector3) {
        this.direction.copy(direction);
    }

    /**
     * rotates the ball direction by quaternion.
     */
    public slide() {
        this.direction.applyQuaternion(this.quaternion);
    }

    public dispose() {
        if (this.timeOutId != null)
            clearTimeout(this.timeOutId);
        delete this.position;
        delete this.direction;
        delete this.quaternion;
    }


}

/**
 * Represents a player and a paddle in the game.
 * @class
 */
export class Player {

    public position: Vector3;
    public side: string;
    public length: number;
    public width: number;
    public speed: number;
    public Score: number;
    public socket: Socket;
    public lobby: string;
    public isWinner: boolean;

    /**
     * Creates a new Player instance.
     * @constructor
     * @param {Vector3} [position=new Vector3(0, 0, 0)] - The position of the player.
     * @param {object} set - The settings of the player.
     * @param {string} set.side - The side of the player.
     * @param {number} set.length - The length of the player.
     * @param {number} set.width - The width of the player.
     * @param {number} set.speed - The speed of the player.
     */

    constructor(position: Vector3 = new Vector3(0, 0, 0), set: any = {}) {

        this.position = position;

        this.side = set.side || 'left';
        this.length = set.length || 14;
        this.width = set.width || 1.5;
        this.speed = set.speed || 2;

        this.Score = 0;
        this.isWinner = false;
    }

    /**
     * mount the socket to the player and set the lobby name.
     * @param {Socket} socket - The socket to mount.
     * @param {string} lobby - The lobby name.
     */

    public mountSocket(socket: Socket, lobby: string): void {
        this.socket = socket;
        this.lobby = lobby;
    }

    /**
     *  listens to the player socket for position updates.
     *  @event playerMove 
     */

    public updateMoves() {
        if (this.socket === undefined)
            return;

        this.socket.on('playerMove', (data: any) => {
            this.position.copy(data.position);
        });
    }

    /**
     * emmit the player position to the oppenent in the lobby.
     */

    public emitPOS() {
        if (this.socket === undefined)
            return;
        this.socket.to(this.lobby).emit('playerMove', { position: this.position });
    }


    /**
     * emmit the innitial player position to the player.
     */
    public echoPos() {
        if (this.socket === undefined)
            return;
        this.socket.emit('initPlayer', {pos: this.position, side: this.side});
    }

    /**
     * checks if the ball collides with the player.
     * @param {ball} ball - The ball to check collision with.
     * @returns {boolean} true if the ball collides with the player.
     */
    public checkCollision(ball: ball): boolean {

        let botCorner = {
            x: this.position.x - this.width,
            z: this.position.z - this.length
        }

        let topCorner = {
            x: this.position.x + this.width,
            z: this.position.z + this.length
        }

        if (ball.position.x > botCorner.x && ball.position.x < topCorner.x
            && ball.position.z > botCorner.z && ball.position.z < topCorner.z)
            return true;
        return false;
    }

    /**
     * adds a score to the player.
     * @returns {boolean} true if the player wins.
     */
    public addScore(): boolean {
        this.Score++;
        if (this.Score == winScore){
            this.isWinner = true;
            return true;
        }
        return false;
    }

    /**
     * emitts a win event to the current player.
     */
    public win(): void {
        if (this.socket === undefined)
            return;
        this.socket.emit('win');
    }

    /**
     * emitts a lose event to the current player.
     */
    public lose(): void {
        if (this.socket === undefined)
            return;
        this.socket.emit('lose');
    }
    
    /**
     * resets the player position to the middle of the arena.
     * @param {arena} arena - The arena to reset the player in.
     */
    public reset(arena: arena) {
        if (this.side == 'left')
            this.position.set(arena.width / -2, 0, 0);
        else if (this.side == 'right')
            this.position.set(arena.width / 2, 0, 0);
    }

    public FF(): void {
        if (this.socket === undefined)
            return;
        this.socket.to(this.lobby).emit('ff');
    }

    public dispose() {
        this.socket.offAny();
        delete this.position;
    }

}

/**
 * Represents the arena.
 * @class
 */
export class arena {
    public hieght: number;
    public width: number;

    /**
     * Creates a new arena instance.
     * @constructor
     * @param {number} [hieght=150] - The hieght of the arena.
     * @param {number} [width=200] - The width of the arena.
     */

    constructor(hieght: number = 150, width: number = 200) {
        this.hieght = hieght;
        this.width = width;
    }

    /**
     * checks if the ball collides with the arena.
     * @param {ball} ball - The ball to check collision with.
     * @returns {string} 'bounce' if the ball collides with the arena hieght, 'goal' if the ball collides with the arena width, 'none' if no collision detected.
     */
    public checkCollision(ball: ball): string {
        if (ball.position.z > this.hieght / 2){
            ball.position.z = this.hieght / 2;
            return 'bounce';
        }
        else if (ball.position.z < - this.hieght / 2){
            ball.position.z = - this.hieght / 2;
            return 'bounce';
        }
        else if (ball.position.x > this.width / 2 || ball.position.x < - this.width / 2)
            return 'goal';
        return 'none';
    }
}

export default { 
    ball,
    Player,
    arena
};
