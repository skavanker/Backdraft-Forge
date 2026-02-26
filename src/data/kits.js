/**
 * AD&D 2nd Edition Class Kits
 *
 * Kits modify base classes with special abilities, restrictions, and proficiency/equipment changes.
 * Kits are OPTIONAL - players can skip and use vanilla classes.
 */

/**
 * Kit definitions by class
 *
 * Each kit has:
 * - name: Display name
 * - baseClass: The class this kit modifies (fighter, thief, mage, cleric, etc.)
 * - description: Flavor text
 * - requirements: { minimums: { ability scores }, races: [] } - additional requirements beyond base class
 * - proficiencyMods: Modifications to weapon/non-weapon proficiencies
 * - equipmentMods: Armor/weapon/gold restrictions
 * - specialAbilities: Array of special abilities granted
 * - restrictions: Array of restrictions/requirements
 */
export const kits = {
  // Fighter Kits
  berserker: {
    name: 'Berserker',
    baseClass: 'fighter',
    description: 'Fierce warriors who enter battle rage, gaining incredible strength but losing tactical control.',
    requirements: {
      minimums: { STR: 15, CON: 15 },
      races: ['human', 'dwarf', 'halfOrc']
    },
    proficiencyMods: {
      weaponBonus: 0,
      nonWeaponBonus: 0,
      freeNonWeapon: ['survival', 'endurance'],
      restrictedWeapons: ['lightCrossbow', 'heavyCrossbow']
    },
    equipmentMods: {
      allowedArmor: null, // null = use class default
      restrictedWeapons: ['lightCrossbow', 'heavyCrossbow'],
      startingGoldMod: -50
    },
    specialAbilities: [
      'Battle Rage: +2 to hit, +2 damage, -2 AC (lasts full battle)',
      'Immune to charm and fear while raging',
      'Cannot retreat or withdraw while raging'
    ],
    restrictions: [
      'Must be Chaotic alignment',
      'Cannot use crossbows (dishonorable)',
      'Must enter rage when encountering enemy'
    ]
  },

  swashbuckler: {
    name: 'Swashbuckler',
    baseClass: 'fighter',
    description: 'Dashing, lightly-armored warriors who rely on speed and panache rather than brute force.',
    requirements: {
      minimums: { DEX: 13, INT: 13, CHA: 13 },
      races: ['human', 'elf', 'halfElf']
    },
    proficiencyMods: {
      weaponBonus: 0,
      nonWeaponBonus: 1, // +1 initial non-weapon slot
      freeNonWeapon: ['jumpTumble'],
      restrictedWeapons: []
    },
    equipmentMods: {
      allowedArmor: ['leather', 'studdedLeather'],
      restrictedWeapons: [],
      startingGoldMod: 50 // More stylish, more gold
    },
    specialAbilities: [
      'AC Bonus: -1 AC in light armor (improved by 1 every 5 levels)',
      'Improved Initiative: +1 to individual initiative',
      'Parry: Can sacrifice attacks to parry opponent attacks'
    ],
    restrictions: [
      'Cannot wear armor heavier than studded leather',
      'Must maintain stylish appearance (costs more)',
      'Prefers finesse weapons (rapiers, short swords)'
    ]
  },

  // Thief Kits
  assassin: {
    name: 'Assassin',
    baseClass: 'thief',
    description: 'Cold-blooded killers who combine stealth with poison and improved backstab capabilities.',
    requirements: {
      minimums: { STR: 12, DEX: 12, INT: 11 },
      races: ['human', 'halfElf', 'halfOrc']
    },
    proficiencyMods: {
      weaponBonus: 0,
      nonWeaponBonus: 0,
      freeNonWeapon: ['disguise'],
      restrictedWeapons: []
    },
    equipmentMods: {
      allowedArmor: null, // Use thief default
      restrictedWeapons: [],
      startingGoldMod: 0
    },
    specialAbilities: [
      'Enhanced Backstab: x3 damage at 1st level (increases faster)',
      'Poison Use: Can create and apply poisons without risk',
      'Assassination: Special attack that can kill instantly (high level)',
      'Thief Skill Adjustments: +10% Move Silently, +5% Hide in Shadows, -10% Pick Pockets'
    ],
    restrictions: [
      'Must be Evil alignment',
      'Must kill target within agreed time or lose honor among guild',
      'Cannot openly use thief abilities (maintain cover)'
    ]
  },

  acrobat: {
    name: 'Acrobat',
    baseClass: 'thief',
    description: 'Nimble performers who trade stealth skills for incredible athletic prowess.',
    requirements: {
      minimums: { DEX: 15, STR: 12 },
      races: ['human', 'elf', 'halfling', 'halfElf']
    },
    proficiencyMods: {
      weaponBonus: 0,
      nonWeaponBonus: 0,
      freeNonWeapon: ['jumpTumble', 'tightropeWalk'],
      restrictedWeapons: []
    },
    equipmentMods: {
      allowedArmor: null,
      restrictedWeapons: [],
      startingGoldMod: 0
    },
    specialAbilities: [
      'Special Climb Walls: 99% base climbing ability (not modified by armor)',
      'Special Jump: Can pole vault and make amazing jumps',
      'Falling: Reduce falling damage (as if fell 10 feet less per level)',
      'Thief Skill Adjustments: +15% Climb Walls, -10% Pick Locks, -15% Move Silently, -10% Hide in Shadows'
    ],
    restrictions: [
      'Poor stealth skills compared to normal thieves',
      'Must perform to maintain skills'
    ]
  },

  // Wizard Kits
  wildMage: {
    name: 'Wild Mage',
    baseClass: 'mage',
    description: 'Chaotic wizards who tap into raw, unpredictable magical forces.',
    requirements: {
      minimums: { INT: 9, WIS: 6, CHA: 15 }, // WIS 6 or less preferred (less cautious)
      races: ['human', 'elf', 'halfElf']
    },
    proficiencyMods: {
      weaponBonus: 0,
      nonWeaponBonus: 0,
      freeNonWeapon: [],
      restrictedWeapons: []
    },
    equipmentMods: {
      allowedArmor: null,
      restrictedWeapons: [],
      startingGoldMod: 0
    },
    specialAbilities: [
      'Wild Surge: Each spell has chance of wild surge (unpredictable effects)',
      'Chaos Magic: Can cast spells at +1 or -1 level (risk of wild surge)',
      'Detect Wild Magic: Can sense areas of wild magic',
      'Access to Wild Magic spells (Nahal\'s Reckless Dweomer, Hornung\'s Random Dispatcher)'
    ],
    restrictions: [
      'Cannot specialize in a school (incompatible with ordered magic)',
      'Must make wild surge check for each spell (d20)',
      'Wild surges can have dangerous consequences'
    ]
  },

  // Priest Kits
  battlePriest: {
    name: 'Battle Priest',
    baseClass: 'cleric',
    description: 'Warrior-priests devoted to gods of war, combining martial prowess with divine magic.',
    requirements: {
      minimums: { STR: 12, WIS: 12 },
      races: ['human', 'dwarf', 'halfOrc']
    },
    proficiencyMods: {
      weaponBonus: 1, // +1 initial weapon slot
      nonWeaponBonus: 0,
      freeNonWeapon: [],
      restrictedWeapons: []
    },
    equipmentMods: {
      allowedArmor: null, // All armor (cleric default)
      restrictedWeapons: [], // Can use all weapons (override cleric restriction)
      startingGoldMod: 0
    },
    specialAbilities: [
      'All Weapons: Can use any weapon (not just blunt)',
      'Warrior THAC0: Use warrior THAC0 progression',
      'Weapon Specialization: Can specialize in one weapon of deity',
      'Inspire Troops: Can grant +1 morale to allies in battle'
    ],
    restrictions: [
      'Must worship war deity (specific deity required)',
      'Reduced spell access: -1 spell per level',
      'Must participate in battles and crusades',
      'Cannot Turn Undead'
    ]
  }
};

/**
 * Get available kits for a class
 * @param {string} classKey - The selected class key
 * @param {Object} abilities - Character's ability scores
 * @param {string} raceKey - Character's race key
 * @returns {Array} Kits available for this class with qualification status
 */
export function getAvailableKits(classKey, abilities, raceKey) {
  // Get all kits for this base class
  const classKits = Object.entries(kits).filter(([key, kit]) => kit.baseClass === classKey);

  if (classKits.length === 0) return [];

  return classKits.map(([key, kit]) => {
    const failedReqs = [];

    // Check ability requirements
    if (kit.requirements.minimums) {
      for (const [ability, min] of Object.entries(kit.requirements.minimums)) {
        if (abilities[ability] < min) {
          failedReqs.push(`${ability} ${abilities[ability]} < ${min} required`);
        }
      }
    }

    // Check race restrictions
    if (kit.requirements.races && !kit.requirements.races.includes(raceKey)) {
      failedReqs.push(`Not available to ${raceKey}`);
    }

    return {
      key,
      ...kit,
      qualified: failedReqs.length === 0,
      failedReqs
    };
  });
}

/**
 * Check if a class has any kits available
 * @param {string} classKey - The class key
 * @returns {boolean} True if this class has kits
 */
export function classHasKits(classKey) {
  return Object.values(kits).some(kit => kit.baseClass === classKey);
}

/**
 * Get a specific kit by key
 * @param {string} kitKey - The kit key
 * @returns {Object|null} The kit object or null if not found
 */
export function getKit(kitKey) {
  return kits[kitKey] || null;
}
