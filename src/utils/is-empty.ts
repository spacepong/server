/**
 * Check if a value is empty
 *
 * @export
 * @param {*} value - The value to check.
 * @returns {boolean} - A boolean indicating whether the value is empty.
 */
export const isEmpty = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return value === undefined || value === null;
};
