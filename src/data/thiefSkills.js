/**
 * AD&D 2e Thief Skills — PHB Tables 26, 27, 28
 */

// Base thief skill percentages at level 1 (PHB Table 26)
const BASE_THIEF_SKILLS = {
  pickPockets:    15,
  openLocks:      10,
  findTraps:       5,
  moveSilently:   10,
  hideInShadows:   5,
  detectNoise:    15,
  climbWalls:     60,
  readLanguages:   0,
};

// Bard base values (slightly different)
const BASE_BARD_SKILLS = {
  pickPockets:    10,
  openLocks:       0,
  findTraps:       0,
  moveSilently:    0,
  hideInShadows:   5,
  detectNoise:    20,
  climbWalls:     50,
  readLanguages:   5,
};

// Racial adjustments (PHB Table 27)
const RACIAL_ADJUSTMENTS = {
  dwarf:     { pickPockets:  0, openLocks: 10, findTraps: 15, moveSilently:  0, hideInShadows:  0, detectNoise:  0, climbWalls: -10, readLanguages: -5 },
  elf:       { pickPockets:  5, openLocks: -5, findTraps:  0, moveSilently:  5, hideInShadows: 10, detectNoise:  5, climbWalls:   0, readLanguages:  0 },
  gnome:     { pickPockets:  0, openLocks:  5, findTraps: 10, moveSilently:  5, hideInShadows:  5, detectNoise: 10, climbWalls: -15, readLanguages:  0 },
  halfelf:   { pickPockets: 10, openLocks:  0, findTraps:  0, moveSilently:  0, hideInShadows:  5, detectNoise:  0, climbWalls:   0, readLanguages:  0 },
  halfling:  { pickPockets:  5, openLocks:  5, findTraps:  5, moveSilently: 10, hideInShadows: 15, detectNoise:  5, climbWalls: -15, readLanguages: -5 },
  human:     { pickPockets:  0, openLocks:  0, findTraps:  0, moveSilently:  0, hideInShadows:  0, detectNoise:  0, climbWalls:   0, readLanguages:  0 },
};

// DEX adjustments (PHB Table 28)
const DEX_ADJUSTMENTS = {
  9:  { pickPockets: -15, openLocks: -10, findTraps: -10, moveSilently: -20, hideInShadows: -10 },
  10: { pickPockets: -10, openLocks:  -5, findTraps: -10, moveSilently: -15, hideInShadows:  -5 },
  11: { pickPockets:  -5, openLocks:   0, findTraps:  -5, moveSilently: -10, hideInShadows:   0 },
  12: { pickPockets:   0, openLocks:   0, findTraps:   0, moveSilently:  -5, hideInShadows:   0 },
  13: { pickPockets:   0, openLocks:   0, findTraps:   0, moveSilently:   0, hideInShadows:   0 },
  14: { pickPockets:   0, openLocks:   0, findTraps:   0, moveSilently:   0, hideInShadows:   0 },
  15: { pickPockets:   0, openLocks:   0, findTraps:   0, moveSilently:   0, hideInShadows:   0 },
  16: { pickPockets:   0, openLocks:   5, findTraps:   0, moveSilently:   0, hideInShadows:   0 },
  17: { pickPockets:   5, openLocks:  10, findTraps:   0, moveSilently:   5, hideInShadows:   5 },
  18: { pickPockets:  10, openLocks:  15, findTraps:   5, moveSilently:  10, hideInShadows:  10 },
  19: { pickPockets:  15, openLocks:  20, findTraps:  10, moveSilently:  15, hideInShadows:  15 },
};

// Skill caps and points per level
export const THIEF_SKILL_CAP = 95;
export const THIEF_INITIAL_POINTS = 60;
export const THIEF_POINTS_PER_LEVEL = 30;

// Skill display labels
export const SKILL_LABELS = {
  pickPockets:   'Pick Pockets',
  openLocks:     'Open Locks',
  findTraps:     'Find/Remove Traps',
  moveSilently:  'Move Silently',
  hideInShadows: 'Hide in Shadows',
  detectNoise:   'Detect Noise',
  climbWalls:    'Climb Walls',
  readLanguages: 'Read Languages',
};

/**
 * Get breakdown of thief skill adjustments.
 * @param {string} raceKey - e.g. 'elf', 'human'
 * @param {number} dex - adjusted DEX score
 * @param {string} classKey - 'thief', 'bard', etc.
 * @param {number} [level=1] - character level (affects Read Languages)
 * @returns {Object} { base, racial, dex, total } - each is an object of skill → percentage
 */
export function getThiefSkillBreakdown(raceKey, dex, classKey, level = 1) {
  const baseSkills = classKey === 'bard' ? { ...BASE_BARD_SKILLS } : { ...BASE_THIEF_SKILLS };
  const racial = RACIAL_ADJUSTMENTS[raceKey] || RACIAL_ADJUSTMENTS.human;
  const dexAdj = DEX_ADJUSTMENTS[Math.min(19, Math.max(9, dex))] || {};

  const total = { ...baseSkills };
  for (const skill of Object.keys(total)) {
    total[skill] += racial[skill] || 0;
    if (dexAdj[skill]) total[skill] += dexAdj[skill];
    total[skill] = Math.max(0, total[skill]);
  }

  // Read Languages is only available at level 4+ for thieves (PHB p. 39)
  if (level < 4) {
    total.readLanguages = 0;
  }

  return {
    base: baseSkills,
    racial,
    dex: dexAdj,
    total
  };
}

/**
 * Get base thief skills adjusted for race, DEX, and level.
 * @param {string} raceKey - e.g. 'elf', 'human'
 * @param {number} dex - adjusted DEX score
 * @param {string} classKey - 'thief', 'bard', etc.
 * @param {number} [level=1] - character level (affects Read Languages)
 * @returns {Object} skill key → percentage
 */
export function getBaseThiefSkills(raceKey, dex, classKey, level = 1) {
  return getThiefSkillBreakdown(raceKey, dex, classKey, level).total;
}

/**
 * Apply distributed points on top of base skills.
 * @param {Object} base - from getBaseThiefSkills
 * @param {Object} distributed - skill key → extra points allocated
 * @returns {Object} merged totals
 */
export function applyDistributedPoints(base, distributed) {
  const result = { ...base };
  if (distributed) {
    for (const [skill, pts] of Object.entries(distributed)) {
      if (result[skill] !== undefined) {
        result[skill] = Math.min(95, result[skill] + pts);
      }
    }
  }
  return result;
}
