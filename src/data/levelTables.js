/**
 * AD&D 2nd Edition Level Progression Tables
 * XP requirements, spell slots, hit dice, attacks per round
 * Based on Player's Handbook tables
 */

/**
 * XP required to reach each level, per class
 * PHB Tables 14-22
 */
export const xpTables = {
  fighter:    [0, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 750000, 1000000, 1250000, 1500000, 1750000, 2000000, 2250000, 2500000, 2750000, 3000000],
  paladin:    [0, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 750000, 1000000, 1250000, 1500000, 1750000, 2000000, 2250000, 2500000, 2750000, 3000000],
  ranger:     [0, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 750000, 1000000, 1250000, 1500000, 1750000, 2000000, 2250000, 2500000, 2750000, 3000000],
  mage:       [0, 2500, 5000, 10000, 20000, 40000, 60000, 90000, 135000, 250000, 375000, 750000, 1125000, 1500000, 1875000, 2250000, 2625000, 3000000, 3375000, 3750000],
  specialist: [0, 2500, 5000, 10000, 20000, 40000, 60000, 90000, 135000, 250000, 375000, 750000, 1125000, 1500000, 1875000, 2250000, 2625000, 3000000, 3375000, 3750000],
  cleric:     [0, 1500, 3000, 6000, 13000, 27500, 55000, 110000, 225000, 450000, 675000, 900000, 1125000, 1350000, 1575000, 1800000, 2025000, 2250000, 2475000, 2700000],
  druid:      [0, 2000, 4000, 7500, 12500, 20000, 35000, 60000, 90000, 125000, 200000, 300000, 750000, 1500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000],
  thief:      [0, 1250, 2500, 5000, 10000, 20000, 40000, 70000, 110000, 160000, 220000, 440000, 660000, 880000, 1100000, 1320000, 1540000, 1760000, 1980000, 2200000],
  bard:       [0, 1250, 2500, 5000, 10000, 20000, 40000, 70000, 110000, 160000, 220000, 440000, 660000, 880000, 1100000, 1320000, 1540000, 1760000, 1980000, 2200000],
};

/**
 * Level at which classes stop gaining hit dice and get fixed HP instead
 * (the "name level" or "title level")
 */
export const nameLevels = {
  fighter: 9,   // +3 HP/level after 9
  paladin: 9,   // +3 HP/level after 9
  ranger: 9,    // +3 HP/level after 9
  mage: 10,     // +1 HP/level after 10
  specialist: 10,
  cleric: 9,    // +2 HP/level after 9
  druid: 14,    // +1 HP/level after 14
  thief: 10,    // +2 HP/level after 10
  bard: 10,     // +2 HP/level after 10
};

/**
 * Fixed HP per level after name level (no CON bonus)
 */
export const postNameHP = {
  fighter: 3,
  paladin: 3,
  ranger: 3,
  mage: 1,
  specialist: 1,
  cleric: 2,
  druid: 1,
  thief: 2,
  bard: 2,
};

/**
 * Wizard spell slots by level (PHB Table 21)
 * Index 0 = level 1, value array = [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
 */
export const wizardSpellSlots = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0], // Level 1
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // Level 2
  [2, 1, 0, 0, 0, 0, 0, 0, 0], // Level 3
  [3, 2, 0, 0, 0, 0, 0, 0, 0], // Level 4
  [4, 2, 1, 0, 0, 0, 0, 0, 0], // Level 5
  [4, 2, 2, 0, 0, 0, 0, 0, 0], // Level 6
  [4, 3, 2, 1, 0, 0, 0, 0, 0], // Level 7
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // Level 8
  [4, 3, 3, 2, 1, 0, 0, 0, 0], // Level 9
  [4, 4, 3, 2, 2, 0, 0, 0, 0], // Level 10
  [4, 4, 4, 3, 3, 0, 0, 0, 0], // Level 11
  [4, 4, 4, 4, 4, 1, 0, 0, 0], // Level 12
  [5, 5, 5, 4, 4, 2, 0, 0, 0], // Level 13
  [5, 5, 5, 4, 4, 2, 1, 0, 0], // Level 14
  [5, 5, 5, 5, 5, 2, 1, 0, 0], // Level 15
  [5, 5, 5, 5, 5, 3, 2, 1, 0], // Level 16
  [5, 5, 5, 5, 5, 3, 3, 2, 0], // Level 17
  [5, 5, 5, 5, 5, 3, 3, 2, 1], // Level 18
  [5, 5, 5, 5, 5, 3, 3, 3, 1], // Level 19
  [5, 5, 5, 5, 5, 4, 3, 3, 2], // Level 20
];

/**
 * Priest spell slots by level (PHB Table 24)
 * Index 0 = level 1, value array = [1st, 2nd, 3rd, 4th, 5th, 6th, 7th]
 */
export const priestSpellSlots = [
  [1, 0, 0, 0, 0, 0, 0], // Level 1
  [2, 0, 0, 0, 0, 0, 0], // Level 2
  [2, 1, 0, 0, 0, 0, 0], // Level 3
  [3, 2, 0, 0, 0, 0, 0], // Level 4
  [3, 3, 1, 0, 0, 0, 0], // Level 5
  [3, 3, 2, 0, 0, 0, 0], // Level 6
  [3, 3, 2, 1, 0, 0, 0], // Level 7
  [3, 3, 3, 2, 0, 0, 0], // Level 8
  [4, 4, 3, 2, 1, 0, 0], // Level 9
  [4, 4, 3, 3, 2, 0, 0], // Level 10
  [5, 4, 4, 3, 2, 1, 0], // Level 11
  [6, 5, 5, 3, 2, 2, 0], // Level 12
  [6, 6, 6, 4, 2, 2, 0], // Level 13
  [6, 6, 6, 5, 3, 2, 1], // Level 14
  [6, 6, 6, 6, 3, 3, 1], // Level 15
  [7, 7, 7, 6, 4, 3, 1], // Level 16
  [7, 7, 7, 7, 5, 3, 2], // Level 17
  [8, 8, 8, 8, 6, 4, 2], // Level 18
  [9, 9, 8, 8, 6, 4, 2], // Level 19
  [9, 9, 9, 8, 7, 5, 2], // Level 20
];

/**
 * Bard spell slots (wizard progression, delayed to level 2)
 * Bards cast as wizards but don't gain spells until level 2
 * PHB Table 32
 */
export const bardSpellSlots = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // Level 1 (no spells)
  [1, 0, 0, 0, 0, 0, 0, 0, 0], // Level 2
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // Level 3
  [2, 1, 0, 0, 0, 0, 0, 0, 0], // Level 4
  [3, 2, 0, 0, 0, 0, 0, 0, 0], // Level 5
  [3, 2, 1, 0, 0, 0, 0, 0, 0], // Level 6
  [3, 3, 2, 0, 0, 0, 0, 0, 0], // Level 7
  [3, 3, 2, 1, 0, 0, 0, 0, 0], // Level 8
  [3, 3, 3, 2, 0, 0, 0, 0, 0], // Level 9
  [3, 3, 3, 2, 1, 0, 0, 0, 0], // Level 10
  [3, 3, 3, 3, 2, 0, 0, 0, 0], // Level 11
  [4, 4, 4, 3, 2, 1, 0, 0, 0], // Level 12
  [4, 4, 4, 3, 3, 2, 0, 0, 0], // Level 13
  [4, 4, 4, 4, 3, 2, 0, 0, 0], // Level 14
  [4, 4, 4, 4, 3, 2, 1, 0, 0], // Level 15
  [5, 5, 5, 4, 3, 3, 2, 0, 0], // Level 16
  [5, 5, 5, 5, 4, 3, 2, 0, 0], // Level 17
  [5, 5, 5, 5, 4, 3, 2, 1, 0], // Level 18
  [5, 5, 5, 5, 5, 4, 3, 1, 0], // Level 19
  [5, 5, 5, 5, 5, 4, 3, 2, 0], // Level 20
];

/**
 * Paladin priest spell slots (gained at level 9+)
 * PHB Table 25
 */
export const paladinSpellSlots = [
  null, null, null, null, null, null, null, null, // Levels 1-8: no spells
  [1, 0, 0, 0],         // Level 9
  [2, 0, 0, 0],         // Level 10
  [2, 1, 0, 0],         // Level 11
  [2, 2, 0, 0],         // Level 12
  [2, 2, 1, 0],         // Level 13
  [3, 2, 1, 0],         // Level 14
  [3, 2, 1, 1],         // Level 15
  [3, 3, 2, 1],         // Level 16
  [3, 3, 3, 1],         // Level 17
  [3, 3, 3, 2],         // Level 18
  [3, 3, 3, 3],         // Level 19
  [3, 3, 3, 3],         // Level 20
];

/**
 * Ranger priest spell slots (gained at level 8+)
 * Rangers cast priest spells from Plant and Animal spheres only
 * PHB Table 19 (Ranger)
 * Note: AD&D 2E rangers do NOT get wizard spells (that was 1st edition)
 */
export const rangerPriestSlots = [
  null, null, null, null, null, null, null, // Levels 1-7: no spells
  [1, 0, 0],           // Level 8
  [2, 0, 0],           // Level 9
  [2, 1, 0],           // Level 10
  [2, 2, 0],           // Level 11
  [2, 2, 1],           // Level 12
  [3, 2, 1],           // Level 13
  [3, 2, 2],           // Level 14
  [3, 3, 2],           // Level 15
  [3, 3, 3],           // Level 16
  [3, 3, 3],           // Level 17
  [3, 3, 3],           // Level 18
  [3, 3, 3],           // Level 19
  [3, 3, 3],           // Level 20
];

// ─── Helper Functions ───────────────────────────────────────────────

/**
 * Get the character's level based on their XP and class
 * @param {string} classKey - Class key (fighter, mage, etc.)
 * @param {number} xp - Current XP total
 * @returns {number} Character level (1-20)
 */
export function getLevelFromXP(classKey, xp) {
  const table = xpTables[classKey];
  if (!table) return 1;
  for (let i = table.length - 1; i >= 0; i--) {
    if (xp >= table[i]) return i + 1;
  }
  return 1;
}

/**
 * Get XP required for the next level
 * @param {string} classKey - Class key
 * @param {number} currentLevel - Current level
 * @returns {number|null} XP needed, or null if at max level
 */
export function getXPForNextLevel(classKey, currentLevel) {
  const table = xpTables[classKey];
  if (!table || currentLevel >= table.length) return null;
  return table[currentLevel]; // table[0] = level 2 XP since index 0 = level 1 threshold (0)
}

/**
 * Get spell slots for a class at a given level
 * @param {string} classKey - Class key
 * @param {number} level - Character level
 * @returns {number[]|null} Array of spell slots per spell level, or null if not a caster
 */
export function getSpellSlots(classKey, level) {
  const idx = Math.min(level, 20) - 1;

  switch (classKey) {
    case 'mage':
    case 'specialist':
      return wizardSpellSlots[idx] || wizardSpellSlots[0];
    case 'cleric':
    case 'druid':
      return priestSpellSlots[idx] || priestSpellSlots[0];
    case 'bard':
      return bardSpellSlots[idx] || bardSpellSlots[0];
    case 'paladin':
      return paladinSpellSlots[idx] || null;
    case 'ranger':
      // Rangers only get priest spells in AD&D 2E
      return rangerPriestSlots[idx] || null;
    default:
      return null;
  }
}

/**
 * Get fighter attacks per round
 * PHB: 1/1 at levels 1-6, 3/2 at levels 7-12, 2/1 at levels 13+
 * @param {string} classGroup - Must be 'warrior'
 * @param {number} level - Character level
 * @returns {string} Attacks per round as display string
 */
export function getAttacksPerRound(classGroup, level) {
  if (classGroup !== 'warrior') return '1';
  if (level >= 13) return '2';
  if (level >= 7) return '3/2';
  return '1';
}

/**
 * Check if a level is past the name level (post-title, fixed HP)
 * @param {string} classKey
 * @param {number} level
 * @returns {boolean}
 */
export function isPastNameLevel(classKey, level) {
  return level > (nameLevels[classKey] || 99);
}

/**
 * Get the fixed HP gained per level after name level
 * @param {string} classKey
 * @returns {number}
 */
export function getPostNameHP(classKey) {
  return postNameHP[classKey] || 1;
}

/**
 * Format spell slots for display
 * @param {number[]} slots - Array of slot counts per spell level
 * @returns {string} e.g. "4/3/2/1"
 */
export function formatSpellSlots(slots) {
  if (!slots) return 'None';
  // Trim trailing zeros
  let last = slots.length - 1;
  while (last > 0 && slots[last] === 0) last--;
  if (slots[0] === 0 && last === 0) return 'None';
  return slots.slice(0, last + 1).join('/');
}
