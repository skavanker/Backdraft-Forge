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

import { races } from './races.js';

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
export function checkClassRequirements(abilities, race, raceKey, cls, classKey) {
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

  // Check race class restrictions — specialist is derived from wizardSchools.allowedRaces
  const raceHasClass = classKey === 'specialist'
    ? raceCanBeSpecialist(raceKey)
    : classKey in race.classes;

  if (!raceHasClass) {
    const allowed = Object.entries(races)
      .filter(([rk, r]) => classKey === 'specialist' ? raceCanBeSpecialist(rk) : classKey in r.classes)
      .map(([, r]) => r.name);
    failedReqs.push(`${race.name} cannot be ${cls.name} (available to ${allowed.join(', ')})`);
  }

  // For specialist wizards, check if at least one school is available
  if (classKey === 'specialist' && raceHasClass) {
    const availableSchools = getAvailableSchools(abilities, raceKey);
    const hasQualifiedSchool = availableSchools.some(s => s.qualified);

    if (!hasQualifiedSchool) {
      const racialSchools = Object.entries(wizardSchools)
        .filter(([, s]) => s.allowedRaces.includes(raceKey))
        .map(([, s]) => s.name);

      failedReqs.push(`No specialist schools available (needs higher abilities for ${racialSchools.join(', ')})`);
    }
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
  // Specialist shares the mage level limit for that race
  if (classKey === 'specialist') return race.classes['mage'] ?? null;
  return race.classes[classKey] ?? null;
}

/**
 * Get all classes with qualification status
 * @param {Object} abilities - Character's adjusted ability scores
 * @param {Object} race - Race object
 * @returns {Array<{ key: string, cls: Object, qualified: boolean, failedReqs: string[], levelLimit: number|null, xpBonus: number }>}
 */
export function getAvailableClasses(abilities, race, raceKey) {
  return Object.entries(classes).map(([key, cls]) => {
    const check = checkClassRequirements(abilities, race, raceKey, cls, key);
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
 * Derives specialist wizard access from wizardSchools.allowedRaces
 * so we don't have to manually maintain 'specialist' in each race's class list.
 */
function raceCanBeSpecialist(raceKey) {
  return Object.values(wizardSchools).some(s => s.allowedRaces.includes(raceKey));
}

/**
 * Generate advisory warnings for a character's class/ability combination.
 * These are non-blocking — the player can proceed, but should know the trade-offs.
 *
 * @param {Object} abilities - Adjusted ability scores
 * @param {Object} cls - Class object
 * @param {string} classKey - Class key
 * @returns {Array<{ severity: 'caution'|'concern', message: string }>}
 */
export function getCharacterWarnings(abilities, cls, classKey) {
  const warnings = [];
  const group = cls.group;

  // Prime requisite warnings (no XP bonus)
  const primeScores = cls.primeRequisite.map(pr => abilities[pr]);
  const minPrime = Math.min(...primeScores);
  if (minPrime < 13) {
    const low = cls.primeRequisite.filter(pr => abilities[pr] < 13);
    warnings.push({
      severity: minPrime <= 10 ? 'concern' : 'caution',
      message: `Low ${low.join('/')} for a ${cls.name} — no XP bonus`
    });
  }

  // Wizard-specific: INT affects spell learning chance and max spells per level
  if (group === 'wizard') {
    const int = abilities.INT;
    if (int <= 9) {
      warnings.push({
        severity: 'concern',
        message: `INT ${int} gives only 35% chance to learn each spell (max 6 per level)`
      });
    } else if (int <= 11) {
      warnings.push({
        severity: 'caution',
        message: `INT ${int} gives ${int === 10 ? '40' : '45'}% chance to learn spells (max 7 per level)`
      });
    } else if (int <= 12) {
      warnings.push({
        severity: 'caution',
        message: `INT ${int} gives 50% chance to learn spells (max 7 per level)`
      });
    }
  }

  // Priest-specific: WIS affects bonus spells
  if (group === 'priest') {
    const wis = abilities.WIS;
    if (wis < 13) {
      warnings.push({
        severity: 'concern',
        message: `WIS ${wis} grants no bonus priest spells`
      });
    } else if (wis <= 14) {
      warnings.push({
        severity: 'caution',
        message: `WIS ${wis} grants only one bonus 1st-level spell`
      });
    }
  }

  // Low CON on fragile classes (d4/d6 hit die)
  if (abilities.CON <= 6 && (cls.hitDie === 'd4' || cls.hitDie === 'd6')) {
    warnings.push({
      severity: 'concern',
      message: `CON ${abilities.CON} with ${cls.hitDie} hit die — very fragile`
    });
  }

  // Warriors missing out on CON HP bonus
  if (group === 'warrior' && abilities.CON < 15) {
    warnings.push({
      severity: 'caution',
      message: `CON ${abilities.CON} — warriors benefit greatly from CON 15+ for bonus HP`
    });
  }

  // Thief with low DEX affects thief skills
  if ((classKey === 'thief' || classKey === 'bard') && abilities.DEX <= 11) {
    warnings.push({
      severity: 'caution',
      message: `Low DEX penalizes thief skill percentages`
    });
  }

  // Low WIS saving throw penalty — affects ALL classes
  // 2E: WIS 1=-6, 2=-4, 3=-3, 4=-2, 5=-1, 6=-1, 7=0, 8+=0+
  const wis = abilities.WIS;
  if (wis <= 5) {
    const penalty = { 1: -6, 2: -4, 3: -3, 4: -2, 5: -1 }[wis];
    warnings.push({
      severity: 'concern',
      message: `WIS ${wis} gives ${penalty} penalty to saves vs mind-affecting spells (charm, fear, etc.)`
    });
  } else if (wis === 6) {
    warnings.push({
      severity: 'caution',
      message: `WIS 6 gives -1 penalty to saves vs mind-affecting spells`
    });
  }

  // Non-warrior with high CON — bonus HP caps at +2
  if (group !== 'warrior' && abilities.CON >= 17) {
    warnings.push({
      severity: 'caution',
      message: `Non-warriors only get +2 HP/level from CON, even with CON ${abilities.CON}`
    });
  }

  return warnings;
}

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
