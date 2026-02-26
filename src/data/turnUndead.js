/**
 * AD&D 2e Turn Undead — PHB Table 61
 *
 * Values: number = d20 roll needed, 'T' = auto turn, 'D' = auto destroy, null = cannot turn
 */

const UNDEAD_TYPES = [
  'Skeleton', 'Zombie', 'Ghoul', 'Shadow', 'Wight',
  'Ghast', 'Wraith', 'Mummy', 'Spectre', 'Vampire',
  'Ghost', 'Lich', 'Special',
];

// Rows indexed by cleric level (1-based). Each row maps to UNDEAD_TYPES columns.
const TURN_TABLE = {
  1:  [10, 13, 16, 19, 20, null, null, null, null, null, null, null, null],
  2:  [ 7, 10, 13, 16, 19,   20, null, null, null, null, null, null, null],
  3:  [ 4,  7, 10, 13, 16,   19,   20, null, null, null, null, null, null],
  4:  ['T',  4,  7, 10, 13,  16,   19,   20, null, null, null, null, null],
  5:  ['T','T',  4,  7, 10,  13,   16,   19,   20, null, null, null, null],
  6:  ['T','T','T',  4,  7,  10,   13,   16,   19,   20, null, null, null],
  7:  ['T','T','T','T',  4,   7,   10,   13,   16,   19,   20, null, null],
  8:  ['D','T','T','T','T',   4,    7,   10,   13,   16,   19,   20, null],
  9:  ['D','D','T','T','T',  'T',   4,    7,   10,   13,   16,   19,   20],
  10: ['D','D','D','T','T',  'T',  'T',   4,    7,   10,   13,   16,   19],
  11: ['D','D','D','D','T',  'T',  'T',  'T',   4,    7,   10,   13,   16],
  12: ['D','D','D','D','D',  'T',  'T',  'T',  'T',   4,    7,   10,   13],
  13: ['D','D','D','D','D',  'D',  'T',  'T',  'T',  'T',   4,    7,   10],
  14: ['D','D','D','D','D',  'D',  'D',  'T',  'T',  'T',  'T',   4,    7],
};

/**
 * Get the turn undead row for a given class and level.
 * Paladins turn as cleric level - 2 (minimum 1).
 * @param {string} classKey - 'cleric' or 'paladin'
 * @param {number} level
 * @returns {{ types: string[], values: (number|string|null)[] } | null}
 */
export function getTurnUndeadRow(classKey, level) {
  let effectiveLevel;
  if (classKey === 'paladin') {
    effectiveLevel = Math.max(1, level - 2);
    if (level < 3) return null; // Paladins can't turn until level 3
  } else if (classKey === 'cleric') {
    effectiveLevel = level;
  } else {
    return null;
  }

  const clamped = Math.min(14, Math.max(1, effectiveLevel));
  const values = TURN_TABLE[clamped];

  // Find last non-null index to trim trailing nulls
  let lastIdx = values.length - 1;
  while (lastIdx >= 0 && values[lastIdx] === null) lastIdx--;

  if (lastIdx < 0) return null;

  return {
    types: UNDEAD_TYPES.slice(0, lastIdx + 1),
    values: values.slice(0, lastIdx + 1),
  };
}

/**
 * Format a turn undead cell value for display.
 */
export function formatTurnResult(value) {
  if (value === null) return '\u2014'; // em dash
  if (value === 'T') return 'T';
  if (value === 'D') return 'D*';
  return String(value);
}
