import { userIncludes } from './user.includes';

/**
 * Match includes for fetching match entities.
 *
 * @export
 * @constant matchIncludes
 * @type {object}
 * @property {object} winner - The winner of the match.
 * @property {object} winner.include - The user includes for the winner.
 * @property {object} loser - The loser of the match.
 * @property {object} loser.include - The user includes for the loser.
 */
export const matchIncludes: object = {
  winner: {
    include: userIncludes,
  },
  loser: {
    include: userIncludes,
  },
};
