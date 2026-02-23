/**
 * AD&D 2nd Edition Class Data
 *
 * Each class has:
 * - minimums: Required minimum ability scores
 * - primeRequisite: Primary ability for XP bonus
 * - hitDie: Hit die type
 * - description: Flavor text
 * - features: Key class features
 * - group: warrior/wizard/priest/rogue
 */

export const classes = {
  fighter: {
    name: 'Fighter',
    group: 'warrior',
    minimums: { STR: 9 },
    primeRequisite: ['STR'],
    hitDie: 'd10',
    description: 'Masters of combat, fighters excel with all weapons and armor.',
    features: [
      'All weapon and armor proficiency',
      'Exceptional Strength (if 18 STR)',
      'Multiple attacks at higher levels',
      'Weapon specialization'
    ]
  },

  paladin: {
    name: 'Paladin',
    group: 'warrior',
    minimums: { STR: 12, CON: 9, WIS: 13, CHA: 17 },
    primeRequisite: ['STR', 'CHA'],
    hitDie: 'd10',
    humanOnly: true,
    description: 'Holy warriors bound by a strict code of honor and righteousness.',
    features: [
      'Detect evil at will',
      'Protection from evil 10\' radius',
      'Lay on hands (2 HP/level/day)',
      'Immune to disease',
      'Turn undead (as cleric -2)',
      'Spellcasting at level 9+'
    ]
  },

  ranger: {
    name: 'Ranger',
    group: 'warrior',
    minimums: { STR: 13, DEX: 13, CON: 14, WIS: 14 },
    primeRequisite: ['STR', 'DEX', 'WIS'],
    hitDie: 'd10',
    description: 'Skilled hunters and trackers at home in the wilderness.',
    features: [
      'Two-weapon fighting',
      'Tracking proficiency',
      'Species enemy (+4 to hit)',
      'Animal empathy',
      'Druid/Mage spells at level 8+'
    ]
  },

  mage: {
    name: 'Mage',
    group: 'wizard',
    minimums: { INT: 9 },
    primeRequisite: ['INT'],
    hitDie: 'd4',
    description: 'Wielders of arcane magic, mages command powerful spells.',
    features: [
      'Arcane spellcasting',
      'Learn spells from scrolls/spellbooks',
      'Create magic items at high level',
      'Access to all wizard schools'
    ]
  },

  illusionist: {
    name: 'Illusionist',
    group: 'wizard',
    minimums: { INT: 9, DEX: 16 },
    primeRequisite: ['INT'],
    hitDie: 'd4',
    description: 'Specialist wizards focusing on illusion and phantasm magic.',
    features: [
      'Arcane spellcasting',
      '+1 spell per level (Illusion)',
      '+15% to learn Illusion spells',
      'Bonus to saves vs Illusion',
      'Cannot cast Necromancy, Invocation, Abjuration'
    ]
  },

  cleric: {
    name: 'Cleric',
    group: 'priest',
    minimums: { WIS: 9 },
    primeRequisite: ['WIS'],
    hitDie: 'd8',
    description: 'Servants of the gods, clerics wield divine magic and turn undead.',
    features: [
      'Divine spellcasting',
      'Turn undead',
      'Armor and shield proficiency',
      'Blunt weapons only'
    ]
  },

  druid: {
    name: 'Druid',
    group: 'priest',
    minimums: { WIS: 12, CHA: 15 },
    primeRequisite: ['WIS', 'CHA'],
    hitDie: 'd8',
    description: 'Priests of nature, druids protect the balance of the natural world.',
    features: [
      'Divine spellcasting (nature)',
      'Druidic language',
      'Woodland stride',
      'Shapechange at level 7+',
      'Immune to woodland charm'
    ]
  },

  thief: {
    name: 'Thief',
    group: 'rogue',
    minimums: { DEX: 9 },
    primeRequisite: ['DEX'],
    hitDie: 'd6',
    description: 'Skilled in stealth and subterfuge, thieves excel at getting in and out.',
    features: [
      'Thief skills (Pick Pockets, Open Locks, etc.)',
      'Backstab (x2 damage, +4 to hit)',
      'Read Languages at level 4+',
      'Use Scrolls at level 10+'
    ]
  },

  bard: {
    name: 'Bard',
    group: 'rogue',
    minimums: { DEX: 12, INT: 13, CHA: 15 },
    primeRequisite: ['DEX', 'CHA'],
    hitDie: 'd6',
    description: 'Jacks of all trades, bards combine combat, magic, and thief skills.',
    features: [
      'Limited thief skills',
      'Wizard spellcasting',
      'Bardic music (charm, inspire)',
      'Legend lore',
      'All weapon proficiency'
    ]
  }
};

/**
 * Check if a character qualifies for a class based on abilities and race
 * @param {Object} abilities - Character's adjusted ability scores
 * @param {Object} race - Race object
 * @param {Object} cls - Class object
 * @param {string} classKey - Class key
 * @returns {{ qualified: boolean, failedReqs: string[] }}
 */
export function checkClassRequirements(abilities, race, cls, classKey) {
  const failedReqs = [];

  // Check ability minimums
  for (const [ability, min] of Object.entries(cls.minimums)) {
    if (abilities[ability] < min) {
      failedReqs.push(`${ability} ${abilities[ability]} < ${min} required`);
    }
  }

  // Check human-only restriction
  if (cls.humanOnly && race.name !== 'Human') {
    failedReqs.push('Human only');
  }

  // Check race class restrictions
  if (!race.classes[classKey]) {
    failedReqs.push(`${race.name} cannot be ${cls.name}`);
  }

  return {
    qualified: failedReqs.length === 0,
    failedReqs
  };
}

/**
 * Calculate XP bonus based on prime requisite scores
 * @param {Object} abilities - Character's ability scores
 * @param {Object} cls - Class object
 * @returns {number} XP bonus percentage (0, 5, or 10)
 */
export function calculateXPBonus(abilities, cls) {
  const scores = cls.primeRequisite.map(pr => abilities[pr]);
  const minScore = Math.min(...scores);

  if (minScore >= 16) return 10;
  if (minScore >= 13) return 5;
  return 0;
}

/**
 * Get level limit for a race/class combination
 * @param {Object} race - Race object
 * @param {string} classKey - Class key
 * @returns {number|null} Level limit or null for unlimited
 */
export function getLevelLimit(race, classKey) {
  return race.classes[classKey] ?? null;
}

/**
 * Get all classes with qualification status
 * @param {Object} abilities - Character's adjusted ability scores
 * @param {Object} race - Race object
 * @returns {Array<{ key: string, cls: Object, qualified: boolean, failedReqs: string[], levelLimit: number|null, xpBonus: number }>}
 */
export function getAvailableClasses(abilities, race) {
  return Object.entries(classes).map(([key, cls]) => {
    const check = checkClassRequirements(abilities, race, cls, key);
    return {
      key,
      cls,
      ...check,
      levelLimit: getLevelLimit(race, key),
      xpBonus: check.qualified ? calculateXPBonus(abilities, cls) : 0
    };
  });
}
