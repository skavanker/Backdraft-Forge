/**
 * AD&D 2nd Edition Class Features by Level
 * Notable abilities and milestones gained at each level
 */

const classFeatureTable = {
  fighter: {
    7: ['Extra attack: 3/2 attacks per round'],
    13: ['Extra attack: 2 attacks per round'],
  },
  paladin: {
    3: ['Turn undead as cleric level 1'],
    4: ['Turn undead as cleric level 2'],
    9: ['Gain priest spellcasting (1st level spells)'],
    13: ['Extra attack: 2 attacks per round'],
  },
  ranger: {
    8: ['Gain priest spellcasting (druid list)'],
    9: ['Gain wizard spellcasting (limited)'],
    13: ['Extra attack: 2 attacks per round'],
  },
  mage: {
    // Mages gain mostly spell access
    12: ['Can create minor magical items'],
  },
  specialist: {
    12: ['Can create minor magical items'],
  },
  cleric: {
    9: ['Can build a place of worship, attract followers'],
  },
  druid: {
    7: ['Shapechange to reptile, bird, or mammal (3x/day)'],
    12: ['Immune to natural poisons'],
  },
  thief: {
    4: ['Read Languages unlocked — allocate points to use'],
    10: ['Use wizard scrolls (75% chance, with mishap risk)'],
  },
  bard: {
    2: ['Gain wizard spellcasting (1st level spells)'],
    4: ['Read Languages unlocked — allocate points to use'],
    10: ['Use wizard scrolls'],
  },
};

/**
 * Get new features gained at a specific level for a class
 * @param {string} classKey
 * @param {number} level
 * @returns {string[]} Array of feature descriptions
 */
export function getNewFeaturesAtLevel(classKey, level) {
  return classFeatureTable[classKey]?.[level] || [];
}

/**
 * Get all features up to a given level
 * @param {string} classKey
 * @param {number} level
 * @returns {Array<{ level: number, features: string[] }>}
 */
export function getAllFeaturesUpToLevel(classKey, level) {
  const table = classFeatureTable[classKey] || {};
  return Object.entries(table)
    .filter(([lvl]) => parseInt(lvl) <= level)
    .map(([lvl, features]) => ({ level: parseInt(lvl), features }))
    .sort((a, b) => a.level - b.level);
}

/**
 * Check if a class gains a new weapon proficiency slot at this level
 * @param {string} classGroup - warrior/wizard/priest/rogue
 * @param {number} level - New level
 * @returns {boolean}
 */
export function gainsWeaponProficiency(classGroup, level) {
  const freq = { warrior: 3, wizard: 6, priest: 4, rogue: 4 };
  const f = freq[classGroup] || 4;
  // Gain at level 1 (initial) + every f levels after
  return level > 1 && (level - 1) % f === 0;
}

/**
 * Check if a class gains a new non-weapon proficiency slot at this level
 * @param {string} classGroup
 * @param {number} level
 * @returns {boolean}
 */
export function gainsNonWeaponProficiency(classGroup, level) {
  const freq = { warrior: 3, wizard: 3, priest: 3, rogue: 4 };
  const f = freq[classGroup] || 3;
  return level > 1 && (level - 1) % f === 0;
}
