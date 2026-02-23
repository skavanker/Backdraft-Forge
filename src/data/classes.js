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

  specialist: {
    name: 'Specialist Wizard',
    group: 'wizard',
    minimums: { INT: 9 },
    primeRequisite: ['INT'],
    hitDie: 'd4',
    description: 'Wizards who focus on a single school of magic for greater power.',
    features: [
      'Arcane spellcasting',
      '+1 spell per level (chosen school)',
      '+15% to learn spells of chosen school',
      'Bonus to saves vs chosen school',
      'Cannot cast spells from opposition schools'
    ],
    requiresSchool: true
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

  // Check race class restrictions (null means unlimited, undefined means not allowed)
  if (!(classKey in race.classes)) {
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

/**
 * Specialist Wizard Schools
 * Each school has ability requirements and opposition schools
 */
export const wizardSchools = {
  abjurer: {
    name: 'Abjurer',
    school: 'Abjuration',
    minimums: { WIS: 15 },
    description: 'Specialists in protective and warding magic.',
    oppositionSchools: ['Alteration', 'Illusion'],
    allowedRaces: ['human']
  },
  conjurer: {
    name: 'Conjurer',
    school: 'Conjuration/Summoning',
    minimums: { CON: 15 },
    description: 'Masters of summoning creatures and creating objects.',
    oppositionSchools: ['Greater Divination', 'Invocation'],
    allowedRaces: ['human', 'halfElf']
  },
  diviner: {
    name: 'Diviner',
    school: 'Divination',
    minimums: { WIS: 16 },
    description: 'Seers who specialize in knowledge and foresight.',
    oppositionSchools: ['Conjuration'],
    allowedRaces: ['human', 'elf', 'halfElf']
  },
  enchanter: {
    name: 'Enchanter',
    school: 'Enchantment/Charm',
    minimums: { CHA: 16 },
    description: 'Specialists in influencing minds and emotions.',
    oppositionSchools: ['Invocation', 'Necromancy'],
    allowedRaces: ['human', 'elf', 'halfElf']
  },
  illusionist: {
    name: 'Illusionist',
    school: 'Illusion/Phantasm',
    minimums: { DEX: 16 },
    description: 'Masters of deception and phantom magic.',
    oppositionSchools: ['Necromancy', 'Invocation', 'Abjuration'],
    allowedRaces: ['human', 'gnome']
  },
  invoker: {
    name: 'Invoker',
    school: 'Invocation/Evocation',
    minimums: { CON: 16 },
    description: 'Wielders of raw elemental and energy magic.',
    oppositionSchools: ['Enchantment', 'Conjuration'],
    allowedRaces: ['human']
  },
  necromancer: {
    name: 'Necromancer',
    school: 'Necromancy',
    minimums: { WIS: 16 },
    description: 'Students of death, life force, and undeath.',
    oppositionSchools: ['Illusion', 'Enchantment'],
    allowedRaces: ['human']
  },
  transmuter: {
    name: 'Transmuter',
    school: 'Alteration',
    minimums: { DEX: 15 },
    description: 'Specialists in changing and transforming matter.',
    oppositionSchools: ['Abjuration', 'Necromancy'],
    allowedRaces: ['human', 'halfElf']
  }
};

/**
 * Get available wizard schools for a character
 * @param {Object} abilities - Character's ability scores
 * @param {string} raceKey - Race key
 * @returns {Array} Schools with qualification status
 */
export function getAvailableSchools(abilities, raceKey) {
  return Object.entries(wizardSchools).map(([key, school]) => {
    const failedReqs = [];

    // Check ability requirements
    for (const [ability, min] of Object.entries(school.minimums)) {
      if (abilities[ability] < min) {
        failedReqs.push(`${ability} ${abilities[ability]} < ${min} required`);
      }
    }

    // Check race restriction
    if (!school.allowedRaces.includes(raceKey)) {
      failedReqs.push('Not available to your race');
    }

    return {
      key,
      ...school,
      qualified: failedReqs.length === 0,
      failedReqs
    };
  });
}
