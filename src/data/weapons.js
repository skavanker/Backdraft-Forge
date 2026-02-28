/**
 * AD&D 2nd Edition Unified Weapon Definitions
 *
 * Single source of truth for weapon statistics across equipment and proficiency systems.
 * Stats based on AD&D 2E Player's Handbook Table 44 & 45.
 *
 * Damage: Simplified to single value (vs S-M creatures) rather than S-M/L split
 * Type: S (slashing), P (piercing), B (bludgeoning), or combinations
 * Speed: Weapon speed factor (0-20 scale, lower is faster)
 * Size: S (small), M (medium), L (large)
 * Range: For ranged/thrown weapons { short, medium, long } in feet
 */

export const weaponDefinitions = {
  // Simple Weapons
  club: {
    key: 'club',
    name: 'Club',
    damage: '1d6',
    type: 'B',
    speed: 4,
    size: 'M',
    range: null,
    price: { gp: 0 },
    weight: 3,
    category: 'simple',
    group: 'simple',
    ranged: false
  },

  dagger: {
    key: 'dagger',
    name: 'Dagger',
    damage: '1d4',
    type: 'P',
    speed: 2,
    size: 'S',
    range: { short: 10, medium: 20, long: 30 }, // Can be thrown
    price: { gp: 2 },
    weight: 1,
    category: 'simple',
    group: 'simple',
    ranged: false // Primarily melee, but throwable
  },

  dart: {
    key: 'dart',
    name: 'Dart (5)',
    damage: '1d3',
    type: 'P',
    speed: 2,
    size: 'S',
    range: { short: 10, medium: 20, long: 40 },
    price: { sp: 5 },
    weight: 1,
    category: 'simple',
    group: 'simple',
    ranged: true
  },

  sling: {
    key: 'sling',
    name: 'Sling',
    damage: '1d4',
    type: 'B',
    speed: 6,
    size: 'S',
    range: { short: 40, medium: 80, long: 160 },
    price: { sp: 5 },
    weight: 0,
    category: 'simple',
    group: 'simple',
    ranged: true
  },

  staff: {
    key: 'staff',
    name: 'Quarterstaff',
    damage: '1d6',
    type: 'B',
    speed: 4,
    size: 'L',
    range: null,
    price: { gp: 0 },
    weight: 4,
    category: 'simple',
    group: 'simple',
    ranged: false
  },

  // Swords
  shortSword: {
    key: 'shortSword',
    name: 'Short Sword',
    damage: '1d6',
    type: 'P',
    speed: 3,
    size: 'S',
    range: null,
    price: { gp: 10 },
    weight: 3,
    category: 'sword',
    group: 'sword',
    ranged: false
  },

  longSword: {
    key: 'longSword',
    name: 'Long Sword',
    damage: '1d8',
    type: 'S',
    speed: 5,
    size: 'M',
    range: null,
    price: { gp: 15 },
    weight: 4,
    category: 'sword',
    group: 'sword',
    ranged: false
  },

  broadsword: {
    key: 'broadsword',
    name: 'Broadsword',
    damage: '2d4',
    type: 'S',
    speed: 5,
    size: 'M',
    range: null,
    price: { gp: 10 },
    weight: 4,
    category: 'sword',
    group: 'sword',
    ranged: false
  },

  bastardSword: {
    key: 'bastardSword',
    name: 'Bastard Sword',
    damage: '1d8/1d10',
    type: 'S',
    speed: 6,
    size: 'M', // M one-handed, L two-handed
    range: null,
    price: { gp: 25 },
    weight: 6,
    category: 'sword',
    group: 'sword',
    ranged: false
  },

  twoHandedSword: {
    key: 'twoHandedSword',
    name: 'Two-Handed Sword',
    damage: '1d10',
    type: 'S',
    speed: 10,
    size: 'L',
    range: null,
    price: { gp: 50 },
    weight: 10,
    category: 'sword',
    group: 'sword',
    ranged: false
  },

  scimitar: {
    key: 'scimitar',
    name: 'Scimitar',
    damage: '1d8',
    type: 'S',
    speed: 5,
    size: 'M',
    range: null,
    price: { gp: 15 },
    weight: 4,
    category: 'sword',
    group: 'sword',
    ranged: false
  },

  // Axes
  handAxe: {
    key: 'handAxe',
    name: 'Hand Axe',
    damage: '1d6',
    type: 'S',
    speed: 4,
    size: 'M',
    range: { short: 10, medium: 20, long: 30 }, // Can be thrown
    price: { gp: 1 },
    weight: 5,
    category: 'axe',
    group: 'axe',
    ranged: false // Primarily melee, but throwable
  },

  battleAxe: {
    key: 'battleAxe',
    name: 'Battle Axe',
    damage: '1d8',
    type: 'S',
    speed: 7,
    size: 'M',
    range: null,
    price: { gp: 5 },
    weight: 7,
    category: 'axe',
    group: 'axe',
    ranged: false
  },

  greatAxe: {
    key: 'greatAxe',
    name: 'Great Axe',
    damage: '1d10',
    type: 'S',
    speed: 9,
    size: 'L',
    range: null,
    price: { gp: 15 },
    weight: 10,
    category: 'axe',
    group: 'axe',
    ranged: false
  },

  // Blunt Weapons
  mace: {
    key: 'mace',
    name: 'Mace',
    damage: '1d6+1',
    type: 'B',
    speed: 7,
    size: 'M',
    range: null,
    price: { gp: 8 },
    weight: 8,
    category: 'blunt',
    group: 'blunt',
    ranged: false
  },

  morningstar: {
    key: 'morningstar',
    name: 'Morning Star',
    damage: '2d4',
    type: 'B/P',
    speed: 7,
    size: 'M',
    range: null,
    price: { gp: 10 },
    weight: 12,
    category: 'blunt',
    group: 'blunt',
    ranged: false
  },

  flail: {
    key: 'flail',
    name: 'Flail',
    damage: '1d6+1',
    type: 'B',
    speed: 7,
    size: 'M',
    range: null,
    price: { gp: 15 },
    weight: 15,
    category: 'blunt',
    group: 'blunt',
    ranged: false
  },

  warhammer: {
    key: 'warhammer',
    name: 'Warhammer',
    damage: '1d4+1',
    type: 'B',
    speed: 4,
    size: 'M',
    range: null,
    price: { gp: 2 },
    weight: 6,
    category: 'blunt',
    group: 'blunt',
    ranged: false
  },

  // Polearms
  spear: {
    key: 'spear',
    name: 'Spear',
    damage: '1d6',
    type: 'P',
    speed: 6,
    size: 'M',
    range: { short: 10, medium: 20, long: 30 }, // Can be thrown
    price: { gp: 1 },
    weight: 5,
    category: 'polearm',
    group: 'polearm',
    ranged: false // Primarily melee, but throwable
  },

  javelin: {
    key: 'javelin',
    name: 'Javelin',
    damage: '1d6',
    type: 'P',
    speed: 4,
    size: 'M',
    range: { short: 20, medium: 40, long: 60 },
    price: { gp: 1 },
    weight: 2,
    category: 'polearm',
    group: 'polearm',
    ranged: true
  },

  halberd: {
    key: 'halberd',
    name: 'Halberd',
    damage: '1d10',
    type: 'P/S',
    speed: 9,
    size: 'L',
    range: null,
    price: { gp: 10 },
    weight: 15,
    category: 'polearm',
    group: 'polearm',
    ranged: false
  },

  pike: {
    key: 'pike',
    name: 'Pike',
    damage: '1d6',
    type: 'P',
    speed: 13,
    size: 'L',
    range: null,
    price: { gp: 5 },
    weight: 8,
    category: 'polearm',
    group: 'polearm',
    ranged: false
  },

  trident: {
    key: 'trident',
    name: 'Trident',
    damage: '1d6+1',
    type: 'P',
    speed: 7,
    size: 'M',
    range: { short: 10, medium: 20, long: 30 }, // Can be thrown
    price: { gp: 15 },
    weight: 5,
    category: 'polearm',
    group: 'polearm',
    ranged: false // Primarily melee, but throwable
  },

  // Exotic Weapons
  whip: {
    key: 'whip',
    name: 'Whip',
    damage: '1d2',
    type: 'S',
    speed: 8,
    size: 'M',
    range: null,
    price: { gp: 1 },
    weight: 2,
    category: 'exotic',
    group: 'exotic',
    ranged: false
  },

  net: {
    key: 'net',
    name: 'Net',
    damage: '—',
    type: 'S',
    speed: 10,
    size: 'M',
    range: { short: 10, medium: 20, long: 30 },
    price: { gp: 5 },
    weight: 10,
    category: 'exotic',
    group: 'exotic',
    ranged: true
  },

  // Bows
  shortBow: {
    key: 'shortBow',
    name: 'Short Bow',
    damage: '1d6',
    type: 'P',
    speed: 7,
    size: 'M',
    range: { short: 50, medium: 100, long: 150 },
    price: { gp: 30 },
    weight: 2,
    category: 'bow',
    group: 'bow',
    ranged: true
  },

  longBow: {
    key: 'longBow',
    name: 'Long Bow',
    damage: '1d8',
    type: 'P',
    speed: 8,
    size: 'L',
    range: { short: 70, medium: 140, long: 210 },
    price: { gp: 75 },
    weight: 3,
    category: 'bow',
    group: 'bow',
    ranged: true
  },

  compositeBow: {
    key: 'compositeBow',
    name: 'Composite Bow',
    damage: '1d8',
    type: 'P',
    speed: 7,
    size: 'M',
    range: { short: 60, medium: 120, long: 180 },
    price: { gp: 100 },
    weight: 2,
    category: 'bow',
    group: 'bow',
    ranged: true
  },

  // Crossbows
  lightCrossbow: {
    key: 'lightCrossbow',
    name: 'Light Crossbow',
    damage: '1d4',
    type: 'P',
    speed: 7,
    size: 'M',
    range: { short: 60, medium: 120, long: 180 },
    price: { gp: 35 },
    weight: 7,
    category: 'crossbow',
    group: 'crossbow',
    ranged: true
  },

  heavyCrossbow: {
    key: 'heavyCrossbow',
    name: 'Heavy Crossbow',
    damage: '1d4+1',
    type: 'P',
    speed: 10,
    size: 'L',
    range: { short: 80, medium: 160, long: 240 },
    price: { gp: 50 },
    weight: 14,
    category: 'crossbow',
    group: 'crossbow',
    ranged: true
  }
};

/**
 * Helper to format weapon tooltip showing all combat stats
 */
export function formatWeaponTooltip(weapon) {
  const parts = [];

  // Damage with type
  if (weapon.damage && weapon.type) {
    const typeNames = {
      S: 'slashing',
      P: 'piercing',
      B: 'bludgeoning',
      'B/P': 'blunt/piercing',
      'P/S': 'piercing/slashing'
    };
    const typeName = typeNames[weapon.type] || weapon.type;
    parts.push(`${weapon.damage} ${typeName}`);
  } else if (weapon.damage) {
    parts.push(`${weapon.damage} damage`);
  }

  // Speed
  if (weapon.speed !== undefined) {
    parts.push(`Speed ${weapon.speed}`);
  }

  // Range or Size
  if (weapon.range) {
    parts.push(`Range ${weapon.range.short}/${weapon.range.medium}/${weapon.range.long}`);
  } else if (weapon.size) {
    parts.push(`Size ${weapon.size}`);
  }

  // Weight
  if (weapon.weight !== undefined) {
    parts.push(`${weapon.weight} lbs`);
  }

  return parts.join(', ');
}

/**
 * Get damage type display name
 */
export function getDamageTypeName(type) {
  const names = {
    S: 'slashing',
    P: 'piercing',
    B: 'bludgeoning',
    'B/P': 'blunt',
    'P/S': 'piercing'
  };
  return names[type] || 'dmg';
}
