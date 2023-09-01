import { userIncludes } from './user.includes';

/**
 * Ban includes for fetching ban entities.
 *
 * @export
 * @constant banIncludes
 * @type {object}
 * @property {object} channel - The channel of the ban.
 * @property {object} user - The user of the ban.
 * @property {object} user.include - The user includes for the user.
 */
export const banIncludes: object = {
  channel: true,
  user: {
    include: userIncludes,
  },
};
