/**
 * User includes for fetching user entities.
 *
 * @export
 * @constant userIncludes
 * @type {object}
 * @property {boolean} avatar - Whether to include the user's avatar.
 * @property {boolean} connection - Whether to include the user's connection.
 * @property {boolean} lost - Whether to include the user's lost games.
 * @property {boolean} won - Whether to include the user's won games.
 * @property {object} achievements - Whether to include the user's achievements.
 */
export const userIncludes: object = {
  avatar: true,
  connection: true,
  lost: true,
  won: true,
  achievements: {
    include: {
      achievement: true,
    },
  },
};
