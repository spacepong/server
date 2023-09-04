import { userIncludes } from './user.includes';

/**
 * Kick includes for fetching kick entities.
 *
 * @export
 * @constant kickIncludes
 * @type {object}
 * @property {object} channel - The channel of the kick.
 * @property {object} user - The user of the kick.
 * @property {object} user.include - The user includes for the user.
 */
export const kickIncludes: object = {
  channel: true,
  user: {
    include: userIncludes,
  },
};
