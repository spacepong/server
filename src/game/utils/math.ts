/**
 * A utility class for generating random numbers and directions.
 * @class
 
 */
export class customRand {

    /**
     * Generates a random integer between the specified range.
     * @param {number} low - The lower bound of the range (inclusive).
     * @param {number} high - The upper bound of the range (inclusive).
     * @returns {number} The random integer.
     */
    static randInt(low: number = 0, high: number = 1000): number {
        const rand  = low + Math.floor(Math.random() * (high - low + 1));
        return rand;
    }

    /**
     * Generates a random floating-point number between the specified range.
     * @param {number} low - The lower bound of the range.
     * @param {number} high - The upper bound of the range.
     * @returns {number} The random floating-point number.
     */
    static randFloat(low: number, high: number): number {
        return low + Math.random() * (high - low);
    }

    /**
     * Generates a random direction vector within the specified range of angles.
     * @param {number} min - The minimum angle in radians.
     * @param {number} max - The maximum angle in radians.
     * @returns {number[]} The random direction vector as an array [x, y, z].
     */
    static randomDirection(min: number, max: number): number[] {
        let randAngle = this.degToRad(this.randInt(min, max));
        let x: number = Math.cos(randAngle);
        let y: number = 0;
        let z: number = Math.sin(randAngle);
        return [x, y, z];
    }

    /**
     * Converts degrees to radians.
     * @param {number} deg - The angle in degrees.
     * @returns {number} The angle in radians.
     */
    static degToRad(deg: number): number {
        return deg * Math.PI / 180;
    }

    /**
     * Converts radians to degrees.
     * @param {number} rad - The angle in radians.
     * @returns {number} The angle in degrees.
     */
    static radToDeg(rad: number): number {
        return rad * 180 / Math.PI;
    }
}

/**
 * Represents a 3D vector.
 * @class
 */
export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    /**
     * Creates a new Vector3 instance.
     * @constructor
     * @param {number} [x=0] - The x-coordinate of the vector.
     * @param {number} [y=0] - The y-coordinate of the vector.
     * @param {number} [z=0] - The z-coordinate of the vector.
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Creates a new Vector3 instance with the same coordinates as the current vector.
     * @returns {Vector3} A new Vector3 instance.
     */
    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Normalizes the vector, making its length equal to 1.
     * @returns {Vector3} The current vector.
     */
    public normalize(): Vector3 {
        let length: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z) || 1;
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
    }

    /**
     * Multiplies the vector by a scalar value.
     * @param {number} scalar - The scalar value to multiply the vector by.
     * @returns {Vector3} The current vector.
     */
    public multiplyScalar(scalar: number): Vector3 {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * Adds another vector to the current vector.
     * @param {Vector3} vec - The vector to add.
     * @returns {Vector3} The current vector.
     */
    public add(vec: Vector3): Vector3 {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    /**
     * Copies the coordinates of another vector to the current vector.
     * @param {Vector3} vec - The vector to copy from.
     * @returns {Vector3} The current vector.
     */
    public copy(vec: Vector3): Vector3 {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        return this;
    }

    /**
     * Sets the coordinates of the vector.
     * @param {number} [x=0] - The x-coordinate of the vector.
     * @param {number} [y=0] - The y-coordinate of the vector.
     * @param {number} [z=0] - The z-coordinate of the vector.
     */
    public set(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Performs a quaternion rotation on the current vector.
     * @param {Quaternion} quaternion - The quaternion to rotate by.
     * @returns {Vector3} The current vector.
     */
    public applyQuaternion(quaternion: Quaternion): Vector3 {

        let qVec = quaternion.getVec();
        let temp = qVec.cross(this).multiplyScalar(2);
        let temp2 = qVec.cross(temp);

        this.add(temp.multiplyScalar(quaternion.getScalar()));
        this.add(temp2);

        return this;
    }
    /**
     * performs a cross product on the current vector and another vector.
     * @param {Vector3} vec the vector to perform the cross product with.
     * @returns {Vector3} the result of the cross product.
     */
    public cross(vec: Vector3): Vector3 {
        const x = vec.y * this.z - vec.z * this.y;
        const y = vec.z * this.x - vec.x * this.z;
        const z = vec.x * this.y - vec.y * this.x;
        return new Vector3(x, y, z);
    }
}


/**
 * Represents a quaternion.
 * @class
 */
export class Quaternion {

    public vec: Vector3;
    public scalar: number;

    /**
     * Creates a new Quaternion instance.
     * @constructor
     * @param {number} [x=0] - The x-coordinate of the vector.
     * @param {number} [y=0] - The y-coordinate of the vector.
     * @param {number} [z=0] - The z-coordinate of the vector.
     * @param {number} [scalar=1] - The scalar value of the quaternion.
     */
    constructor(x: number = 0, y: number = 0, z: number = 0, scalar: number = 1) {
        this.vec = new Vector3(x, y, z);
        this.scalar = scalar;
    }

    /**
     * Sets the quaternion to the specified axis and angle.
     * @param {Vector3} axis - The axis of rotation.
     * @param {number} angle - The angle of rotation in radians.
     * @returns {Quaternion} The current quaternion.
     */
    public set(axis: Vector3, angle: number): Quaternion {
        let halfAngle = angle / 2;
        let s = Math.sin(halfAngle);

        this.vec.copy(axis).normalize().multiplyScalar(s);
        this.scalar = Math.cos(halfAngle);
        return this;
    }

    /**
     * Gets the vector part of the quaternion (imaginary part).
     * @returns {Vector3} The vector part of the quaternion.
     */
    public getVec(): Vector3 {
        return this.vec.clone();
    }


    /**
     * Gets the scalar part of the quaternion (real part).
     * @returns {number} The scalar part of the quaternion.
     */
    public getScalar(): number {
        return this.scalar;
    }


}

export default{
    customRand,
    Vector3,
    Quaternion
}