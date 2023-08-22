/**
 * Interface for the JWT payload
 *
 * @export
 * @interface JwtPayload
 * @property {string} userId - The user's ID.
 * @property {string} intra42AccessToken - The user's Intra42 access token.
 */
export interface JwtPayload {
  userId: string;
  intra42AccessToken: string;
}
