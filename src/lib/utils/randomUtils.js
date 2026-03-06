/**
 * Shared random utility functions
 */

/**
 * Pick a random element from an array
 * @param {Array} arr
 * @returns {*} Random element
 */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
