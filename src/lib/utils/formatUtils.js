/**
 * Shared formatting utilities
 */

/**
 * Returns ordinal suffix for a number (1st, 2nd, 3rd, 11th, 12th, 13th, etc.)
 * @param {number} n
 * @returns {string} e.g. "1st", "2nd", "11th"
 */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
