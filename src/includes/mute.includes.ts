import { userIncludes } from './user.includes';

/**
 * Mute includes for fetching mute entities.
 *
 * @export
 * @constant muteIncludes
 * @type {object}
 * @property {object} channel - The channel of the mute.
 * @property {object} user - The user of the mute.
 * @property {object} user.include - The user includes for the user.
 */
export const muteIncludes: object = {
  channel: true,
  user: {
    include: userIncludes,
  },
};
