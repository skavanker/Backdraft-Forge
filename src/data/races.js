/**
 * AD&D 2nd Edition Race Data
 *
 * Each race has:
 * - minimums: Required minimum ability scores
 * - maximums: Maximum ability scores (racial caps)
 * - adjustments: Ability score modifiers applied after assignment
 * - classes: Allowed classes and their level limits (null = unlimited)
 * - namingStyles: Available naming styles for name generation
 * - description: Flavor text
 */

/**
 * Naming style availability by race
 */
export const namingStyles = {
  human: ['standard', 'patronymic', 'house'],
  elf: ['standard', 'patronymic', 'house'],
  dwarf: ['standard', 'patronymic', 'clan'],
  gnome: ['standard', 'patronymic'],
  halfling: ['standard', 'patronymic'],
  halfElf: ['standard', 'patronymic', 'house']
};

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
    traits: ['No level limits', 'Can be any class', 'Can dual-class'],
    multiClassCombos: [], // Humans cannot multi-class (PHB p.44)
    canDualClass: true,
    dualClassRules: [
      'Must have 15+ in prime requisite of original class',
      'Must have 17+ in prime requisite of new class',
      'Abandon all abilities of original class until new class level exceeds old class level',
      'Can never advance in original class again',
      'When new class level exceeds old, can use abilities of both classes'
    ]
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
    ],
    multiClassCombos: [
      {
        classes: ['fighter', 'thief'],
        levelLimits: { fighter: 15, thief: 12 },
        description: 'Fighter/Thief combines martial prowess with stealth and cunning'
      }
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
    ],
    multiClassCombos: [
      {
        classes: ['fighter', 'mage'],
        levelLimits: { fighter: 12, mage: 15 },
        description: 'Fighter/Mage: warrior-wizard combining martial skill with arcane magic'
      },
      {
        classes: ['fighter', 'thief'],
        levelLimits: { fighter: 12, thief: 12 },
        description: 'Fighter/Thief: stealthy warrior blending combat and stealth'
      },
      {
        classes: ['mage', 'thief'],
        levelLimits: { mage: 15, thief: 12 },
        description: 'Mage/Thief: arcane trickster combining magic with roguish skills'
      },
      {
        classes: ['fighter', 'mage', 'thief'],
        levelLimits: { fighter: 12, mage: 15, thief: 12 },
        description: 'Triple-class: versatile adventurer (warrior, wizard, rogue)'
      }
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
    ],
    multiClassCombos: [
      {
        classes: ['fighter', 'mage'],
        levelLimits: { fighter: 11, mage: 12 },
        description: 'Fighter/Illusionist: warrior with illusion magic'
      },
      {
        classes: ['fighter', 'thief'],
        levelLimits: { fighter: 11, thief: 13 },
        description: 'Fighter/Thief: cunning combatant'
      },
      {
        classes: ['mage', 'thief'],
        levelLimits: { mage: 12, thief: 13 },
        description: 'Illusionist/Thief: master of deception'
      }
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
    ],
    multiClassCombos: [
      {
        classes: ['fighter', 'cleric'],
        levelLimits: { fighter: 14, cleric: 14 },
        description: 'Fighter/Cleric: holy warrior'
      },
      {
        classes: ['fighter', 'thief'],
        levelLimits: { fighter: 14, thief: 12 },
        description: 'Fighter/Thief: versatile adventurer'
      },
      {
        classes: ['fighter', 'mage'],
        levelLimits: { fighter: 14, mage: 12 },
        description: 'Fighter/Mage: spellsword'
      },
      {
        classes: ['cleric', 'mage'],
        levelLimits: { cleric: 14, mage: 12 },
        description: 'Cleric/Mage: divine and arcane caster'
      },
      {
        classes: ['cleric', 'ranger'],
        levelLimits: { cleric: 14, ranger: 16 },
        description: 'Cleric/Ranger: nature priest-warrior'
      },
      {
        classes: ['fighter', 'mage', 'cleric'],
        levelLimits: { fighter: 14, mage: 12, cleric: 14 },
        description: 'Triple-class: ultimate versatility'
      }
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
    ],
    multiClassCombos: [
      {
        classes: ['fighter', 'thief'],
        levelLimits: { fighter: 9, thief: 15 },
        description: 'Fighter/Thief: nimble warrior-scout'
      }
    ]
  }
};

/**
 * Check if a character qualifies for a race based on ability scores
 * @param {Object} abilities - Character's ability scores
 * @param {Object} race - Race object from races
 * @returns {{ qualified: boolean, failedReqs: string[] }}
 */
export function checkRaceRequirements(abilities, race, { lenient = false } = {}) {
  const failedReqs = [];

  // Check minimums
  for (const [ability, min] of Object.entries(race.minimums)) {
    if (abilities[ability] < min) {
      failedReqs.push(`Need ${ability} ${min}`);
    }
  }

  // Check maximums (post-adjustment caps)
  for (const [ability, max] of Object.entries(race.maximums)) {
    const adjusted = abilities[ability] + (race.adjustments[ability] || 0);
    if (adjusted > max) {
      failedReqs.push(`${ability} exceeds ${max} max`);
    }
  }

  return {
    qualified: lenient || failedReqs.length === 0,
    failedReqs
  };
}

/**
 * Apply racial adjustments to ability scores.
 *
 * AD&D 2E Rule: Racial modifiers apply to base scores, but the final adjusted
 * ability score cannot exceed 19 (except for Strength, which can go up to 18/00).
 * This is a hard cap in the core rules (PHB p.14-15).
 *
 * Example: A dwarf (+1 CON) with rolled CON 18 gets adjusted to 19 (not 19+).
 * The minimum of 3 prevents modifiers from reducing scores below humanoid baseline.
 *
 * @param {Object} abilities - Character's base ability scores
 * @param {Object} race - Race object
 * @returns {Object} Adjusted ability scores (clamped between 3 and 19)
 */
export function applyRacialAdjustments(abilities, race) {
  const adjusted = { ...abilities };
  for (const [ability, mod] of Object.entries(race.adjustments)) {
    // AD&D 2E: Ability scores capped at 19 after racial adjustments (PHB p.14-15)
    // Min of 3 ensures no ability drops below humanoid baseline
    adjusted[ability] = Math.max(3, Math.min(19, adjusted[ability] + mod));
  }
  return adjusted;
}

/**
 * Get all races the character qualifies for
 * @param {Object} abilities - Character's ability scores
 * @returns {Array<{ key: string, race: Object, qualified: boolean, failedReqs: string[] }>}
 */
export function getAvailableRaces(abilities, { lenient = false } = {}) {
  return Object.entries(races).map(([key, race]) => {
    const check = checkRaceRequirements(abilities, race, { lenient });
    return {
      key,
      race,
      ...check
    };
  });
}

/**
 * Get available naming styles for a race
 * @param {string} raceKey - Race key (human, elf, dwarf, etc.)
 * @returns {string[]} Array of available naming style keys
 */
export function getAvailableNamingStyles(raceKey) {
  // Random race has all styles available
  if (raceKey === 'random') {
    return ['random', 'standard', 'patronymic', 'clan', 'house'];
  }

  // Return race-specific styles, with 'random' always available
  return ['random', ...(namingStyles[raceKey] || ['standard', 'patronymic'])];
}
