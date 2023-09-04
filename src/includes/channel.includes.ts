import { userIncludes } from './user.includes';
import { kickIncludes } from './kick.includes';
import { banIncludes } from './ban.includes';

/**
 * Channel includes for fetching channel entities.
 *
 * @export
 * @constant channelIncludes
 * @type {object}
 * @property {object} users - The users of the channel.
 * @property {object} users.include - The user includes for the users.
 * @property {object} kicks - The kicks of the channel.
 * @property {object} kicks.include - The kick includes for the kicks.
 * @property {object} bans - The bans of the channel.
 * @property {object} bans.include - The ban includes for the bans.
 */
export const channelIncludes: object = {
  users: {
    include: userIncludes,
  },
  kicks: {
    include: kickIncludes,
  },
  bans: {
    include: banIncludes,
  },
};
