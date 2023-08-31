import { userIncludes } from './user.includes';

/**
 * Channel includes for fetching channel entities.
 *
 * @export
 * @constant channelIncludes
 * @type {object}
 * @property {object} users - The users of the channel.
 * @property {object} users.include - The user includes for the users.
 */
export const channelIncludes: object = {
  users: {
    include: userIncludes,
  },
};
