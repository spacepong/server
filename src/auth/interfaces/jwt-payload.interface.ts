/**
 * Interface for the JWT payload
 *
 * @export
 * @interface JwtPayload
 * @property {string} userId - The user's ID.
 * @property {string} intra42AccessToken - The user's Intra42 access token.
 * @property {string} intra42RefreshToken - The user's Intra42 refresh token.
 * @property {boolean} is2faEnabled - Whether or not 2FA is enabled for the user.
 * @property {boolean} is2faAuthenticated - Whether or not 2FA is authenticated for the user.
 * @property {boolean} isAdmin - Whether or not the user is an admin.
 */
export interface JwtPayload {
  userId: string;
  intra42AccessToken: string;
  intra42RefreshToken: string;
  is2faEnabled: boolean;
  is2faAuthenticated: boolean;
  isAdmin: boolean;
}
