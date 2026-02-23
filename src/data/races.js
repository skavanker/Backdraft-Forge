/**
 * AD&D 2nd Edition Race Data
 *
 * Each race has:
 * - minimums: Required minimum ability scores
 * - maximums: Maximum ability scores (racial caps)
 * - adjustments: Ability score modifiers applied after assignment
 * - classes: Allowed classes and their level limits (null = unlimited)
 * - description: Flavor text
 */

export const races = {
  human: {
    name: 'Human',
    minimums: {},
    maximums: {},
    adjustments: {},
    classes: {
      fighter: null,
      paladin: null,
      ranger: null,
      mage: null,
      cleric: null,
      druid: null,
      thief: null,
      bard: null
    },
    description: 'Versatile and ambitious, humans can pursue any class without level limits.',
    traits: ['No level limits', 'Can be any class', 'Can dual-class']
  },

  dwarf: {
    name: 'Dwarf',
    minimums: { CON: 11 },
    maximums: { CHA: 17 },
    adjustments: { CON: 1, CHA: -1 },
    classes: {
      fighter: 15,
      cleric: 10,
      thief: 12
    },
    description: 'Stout and sturdy, dwarves are master craftsmen and fierce warriors.',
    traits: [
      '+1 CON, -1 CHA',
      'Infravision 60\'',
      '+1 to hit vs orcs/goblins',
      'Saving throw bonuses vs magic',
      'Detect stonework anomalies'
    ]
  },

  elf: {
    name: 'Elf',
    minimums: { DEX: 6, CON: 7, INT: 8, CHA: 8 },
    maximums: { CON: 17 },
    adjustments: { DEX: 1, CON: -1 },
    classes: {
      fighter: 12,
      mage: 15,
      thief: 12,
      cleric: 12,
      ranger: 15
    },
    description: 'Graceful and long-lived, elves are attuned to magic and nature.',
    traits: [
      '+1 DEX, -1 CON',
      'Infravision 60\'',
      '90% resistance to sleep/charm',
      '+1 to hit with bows/swords',
      'Detect secret doors'
    ]
  },

  gnome: {
    name: 'Gnome',
    minimums: { INT: 6, CON: 8 },
    maximums: { WIS: 17 },
    adjustments: { INT: 1, WIS: -1 },
    classes: {
      fighter: 11,
      cleric: 9,
      thief: 13
    },
    description: 'Curious and inventive, gnomes have a natural affinity for illusion magic.',
    traits: [
      '+1 INT, -1 WIS',
      'Infravision 60\'',
      '+1 to hit vs kobolds/goblins',
      'Saving throw bonuses vs magic',
      '+1 attack bonus with illusions'
    ]
  },

  halfElf: {
    name: 'Half-Elf',
    minimums: { DEX: 6, CON: 6, INT: 4 },
    maximums: {},
    adjustments: {},
    classes: {
      fighter: 14,
      mage: 12,
      cleric: 14,
      thief: 12,
      ranger: 16,
      druid: 13,
      bard: null
    },
    description: 'Bridging two worlds, half-elves combine human ambition with elven grace.',
    traits: [
      'Infravision 60\'',
      '30% resistance to sleep/charm',
      'Detect secret doors (1-in-6)'
    ]
  },

  halfling: {
    name: 'Halfling',
    minimums: { DEX: 7, CON: 10, STR: 7 },
    maximums: { STR: 17, WIS: 17 },
    adjustments: { DEX: 1, STR: -1 },
    classes: {
      fighter: 9,
      cleric: 8,
      thief: 15
    },
    description: 'Small but brave, halflings are nimble and surprisingly resilient.',
    traits: [
      '+1 DEX, -1 STR',
      'Infravision 30\'',
      '+1 to hit with slings/thrown',
      'Saving throw bonuses',
      '+1 AC vs large creatures'
    ]
  }
};

/**
 * Check if a character qualifies for a race based on ability scores
 * @param {Object} abilities - Character's ability scores
 * @param {Object} race - Race object from races
 * @returns {{ qualified: boolean, failedReqs: string[] }}
 */
export function checkRaceRequirements(abilities, race) {
  const failedReqs = [];

  // Check minimums
  for (const [ability, min] of Object.entries(race.minimums)) {
    if (abilities[ability] < min) {
      failedReqs.push(`${ability} ${abilities[ability]} < ${min} required`);
    }
  }

  // Check maximums (post-adjustment caps)
  for (const [ability, max] of Object.entries(race.maximums)) {
    const adjusted = abilities[ability] + (race.adjustments[ability] || 0);
    if (adjusted > max) {
      failedReqs.push(`${ability} would exceed ${max} maximum`);
    }
  }

  return {
    qualified: failedReqs.length === 0,
    failedReqs
  };
}

/**
 * Apply racial adjustments to ability scores
 * @param {Object} abilities - Character's base ability scores
 * @param {Object} race - Race object
 * @returns {Object} Adjusted ability scores
 */
export function applyRacialAdjustments(abilities, race) {
  const adjusted = { ...abilities };
  for (const [ability, mod] of Object.entries(race.adjustments)) {
    adjusted[ability] = Math.max(3, Math.min(19, adjusted[ability] + mod));
  }
  return adjusted;
}

/**
 * Get all races the character qualifies for
 * @param {Object} abilities - Character's ability scores
 * @returns {Array<{ key: string, race: Object, qualified: boolean, failedReqs: string[] }>}
 */
export function getAvailableRaces(abilities) {
  return Object.entries(races).map(([key, race]) => {
    const check = checkRaceRequirements(abilities, race);
    return {
      key,
      race,
      ...check
    };
  });
}
