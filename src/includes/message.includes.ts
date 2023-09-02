import { userIncludes } from './user.includes';
import { channelIncludes } from './channel.includes';

/**
 * Message includes for fetching message entities.
 *
 * @export
 * @constant messageIncludes
 * @type {object}
 * @property {object} channel - The channel of the message.
 * @property {object} channel.include - The channel includes for the channel.
 * @property {object} user - The user of the message.
 * @property {object} user.include - The user includes for the user.
 */
export const messageIncludes: object = {
  channel: {
    include: channelIncludes,
  },
  user: {
    include: userIncludes,
  },
};
