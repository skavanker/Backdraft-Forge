/**
 * Shared HP calculation utilities
 */

/**
 * Parse a hit die string to its max value. e.g. 'd8' → 8
 * @param {string} hitDie - e.g. 'd8', 'd10'
 * @returns {number}
 */
export function parseDieMax(hitDie) {
  const match = hitDie.match(/d(\d+)/);
  return match ? parseInt(match[1]) : 4;
}

/**
 * Calculate total HP from hpHistory, or fallback to max die + CON for old saves.
 * @param {Array} hpHistory - array of { total } entries
 * @param {string} hitDie - e.g. 'd8'
 * @param {number} conHpAdj - CON HP adjustment
 * @returns {number}
 */
export function calcTotalHP(hpHistory, hitDie, conHpAdj) {
  if (hpHistory?.length > 0) {
    return hpHistory.reduce((sum, entry) => sum + entry.total, 0);
  }
  // Fallback for old saves without hpHistory: max die + CON mod at level 1
  return Math.max(1, parseDieMax(hitDie) + conHpAdj);
}
