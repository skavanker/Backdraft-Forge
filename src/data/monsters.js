/**
 * Monster Bestiary Data
 * AD&D 2nd Edition Monster Manual stat blocks
 */

export const monsters = [
  {
    key: 'goblin',
    name: 'Goblin',
    type: 'humanoid',
    size: 'Small',

    // Combat Stats
    hitDice: '1d8',
    hp: 4,
    ac: 6,
    thac0: 19,

    // Attacks
    numAttacks: 1,
    attacks: ['by weapon'],
    damage: '1d6 (weapon)',

    // Movement
    movement: '6',

    // Special
    specialAbilities: [
      'Infravision 60\'',
      '-1 to hit in sunlight'
    ],
    morale: 'Average (8-10)',
    intelligence: 'Low (5-7)',
    alignment: 'Lawful Evil',

    // XP & Treasure
    xp: 35,
    treasureType: 'K',

    // Abilities
    abilities: {
      STR: 10, DEX: 11, CON: 10,
      INT: 8, WIS: 9, CHA: 6
    },

    // Metadata
    description: 'Small, wicked humanoids who live in dark caves and abandoned ruins. Goblins are cowardly but dangerous in numbers.',
    habitat: 'Underground, ruins, forests',
  },

  {
    key: 'orc',
    name: 'Orc',
    type: 'humanoid',
    size: 'Medium',

    hitDice: '1d8',
    hp: 4,
    ac: 6,
    thac0: 19,

    numAttacks: 1,
    attacks: ['by weapon'],
    damage: '1d8 (weapon)',

    movement: '9',

    specialAbilities: [
      'Infravision 60\'',
      '-1 to hit in sunlight'
    ],
    morale: 'Average (8-10)',
    intelligence: 'Low (5-7)',
    alignment: 'Lawful Evil',

    xp: 35,
    treasureType: 'D',

    abilities: {
      STR: 14, DEX: 10, CON: 12,
      INT: 8, WIS: 9, CHA: 7
    },

    description: 'Savage raiders and marauders who hate elves and prefer to operate in darkness. Orcs are brutal fighters who respect strength above all.',
    habitat: 'Underground, mountains, ruins',
  },

  {
    key: 'skeleton',
    name: 'Skeleton',
    type: 'undead',
    size: 'Medium',

    hitDice: '1d8',
    hp: 4,
    ac: 7,
    thac0: 19,

    numAttacks: 1,
    attacks: ['weapon or claw'],
    damage: '1d6 (weapon) or 1d4 (claw)',

    movement: '12',

    specialAbilities: [
      'Immune to sleep, charm, hold',
      'Half damage from edged weapons',
      'Turned as 1 HD undead'
    ],
    morale: 'Fearless (20)',
    intelligence: 'Non- (0)',
    alignment: 'Neutral',

    xp: 65,
    treasureType: null,

    description: 'Animated skeletal remains bound to serve through necromancy. Skeletons mindlessly obey their creator\'s commands.',
    habitat: 'Crypts, dungeons, ruins',
  },

  {
    key: 'zombie',
    name: 'Zombie',
    type: 'undead',
    size: 'Medium',

    hitDice: '2d8',
    hp: 9,
    ac: 8,
    thac0: 19,

    numAttacks: 1,
    attacks: ['strike'],
    damage: '1d8 (crushing blow)',

    movement: '6',

    specialAbilities: [
      'Immune to sleep, charm, hold, cold',
      'Always act last in initiative',
      'Turned as 2 HD undead'
    ],
    morale: 'Fearless (20)',
    intelligence: 'Non- (0)',
    alignment: 'Neutral',

    xp: 65,
    treasureType: null,

    description: 'Slow-moving animated corpses. Zombies are relentless but unintelligent, pursuing their targets with mindless determination.',
    habitat: 'Crypts, graveyards, dungeons',
  },

  {
    key: 'giant-rat',
    name: 'Giant Rat',
    type: 'beast',
    size: 'Small',

    hitDice: '1d4',
    hp: 2,
    ac: 7,
    thac0: 20,

    numAttacks: 1,
    attacks: ['bite'],
    damage: '1d3 + disease',

    movement: '12, Sw 6',

    specialAbilities: [
      '5% chance of disease per bite',
      'Attack in packs (2d10 rats)',
      'Excellent swimmers'
    ],
    morale: 'Unsteady (5-7)',
    intelligence: 'Animal (1)',
    alignment: 'Neutral',

    xp: 15,
    treasureType: 'C',

    description: 'Rats grown to the size of small dogs. They nest in sewers and dungeons, attacking in overwhelming numbers.',
    habitat: 'Sewers, dungeons, ruins',
  },

  {
    key: 'kobold',
    name: 'Kobold',
    type: 'humanoid',
    size: 'Small',

    hitDice: '1d4',
    hp: 2,
    ac: 7,
    thac0: 20,

    numAttacks: 1,
    attacks: ['by weapon'],
    damage: '1d4 (weapon)',

    movement: '6',

    specialAbilities: [
      'Infravision 60\'',
      '-1 to hit in sunlight',
      'Set traps and ambushes'
    ],
    morale: 'Poor (6-8)',
    intelligence: 'Average (8-10)',
    alignment: 'Lawful Evil',

    xp: 15,
    treasureType: 'J',

    abilities: {
      STR: 8, DEX: 12, CON: 9,
      INT: 9, WIS: 8, CHA: 6
    },

    description: 'Small reptilian humanoids who rely on cunning traps and overwhelming numbers. Kobolds are cowardly individually but dangerous in groups.',
    habitat: 'Underground, mines, forests',
  },

  {
    key: 'ogre',
    name: 'Ogre',
    type: 'giant',
    size: 'Large',

    hitDice: '4d8+1',
    hp: 19,
    ac: 5,
    thac0: 17,

    numAttacks: 1,
    attacks: ['weapon or fist'],
    damage: '1d10 (weapon) or 2d4 (fist)',

    movement: '9',

    specialAbilities: [
      'Infravision 60\'',
      '+2 to damage (Strength bonus)'
    ],
    morale: 'Steady (11-12)',
    intelligence: 'Low (5-7)',
    alignment: 'Chaotic Evil',

    xp: 175,
    treasureType: 'C + 1000 gp',

    abilities: {
      STR: 18, DEX: 8, CON: 16,
      INT: 6, WIS: 7, CHA: 5
    },

    description: 'Large, brutish humanoids who prize physical strength and enjoy eating humans. Ogres are dim-witted but extremely dangerous.',
    habitat: 'Mountains, caves, forests',
  },

  {
    key: 'wyvern',
    name: 'Wyvern',
    type: 'dragon',
    size: 'Huge',

    hitDice: '7d8',
    hp: 31,
    ac: 3,
    thac0: 13,

    numAttacks: 2,
    attacks: ['bite', 'sting'],
    damage: '2d8 (bite), 1d6 + poison (sting)',

    movement: '6, Fl 24 (E)',

    specialAbilities: [
      'Poison sting: save vs. poison or die',
      'Flight (E = excellent maneuverability)',
      'Can attack with bite and sting in same round'
    ],
    morale: 'Elite (13-14)',
    intelligence: 'Low (5-7)',
    alignment: 'Neutral Evil',

    xp: 975,
    treasureType: 'E',

    description: 'Dragon-kin with a venomous tail stinger. Wyverns are aggressive predators that hunt from the air, using their deadly poison to kill prey.',
    habitat: 'Mountains, hills, forests',
  },

  {
    key: 'lich',
    name: 'Lich',
    type: 'undead',
    size: 'Medium',

    hitDice: '11d8+3',
    hp: 52,
    ac: 0,
    thac0: 9,

    numAttacks: 1,
    attacks: ['touch'],
    damage: '1d10 + paralysis',

    movement: '6',

    specialAbilities: [
      'Paralysis touch: save vs. paralysis or paralyzed 1d4 turns',
      'Immune to charm, sleep, fear, cold, poison, paralysis',
      'Casts spells as 11th+ level wizard',
      'Turned as 18 HD undead',
      'Fear aura: 5\' radius, save vs. spell or flee'
    ],
    morale: 'Fearless (20)',
    intelligence: 'Genius (17-18)',
    alignment: 'Chaotic Evil',

    xp: 8000,
    treasureType: 'A',

    abilities: {
      STR: 10, DEX: 14, CON: 16,
      INT: 18, WIS: 16, CHA: 16
    },

    description: 'Powerful undead spellcasters who achieved immortality through dark rituals. Liches are among the most dangerous creatures in existence.',
    habitat: 'Hidden lairs, ancient tombs, towers',
  },

  {
    key: 'red-dragon-young',
    name: 'Red Dragon (Young)',
    type: 'dragon',
    size: 'Huge',

    hitDice: '10d8',
    hp: 45,
    ac: 1,
    thac0: 11,

    numAttacks: 3,
    attacks: ['bite', 'claw', 'claw'],
    damage: '1d8 (bite), 1d6 (claw), 1d6 (claw)',

    movement: '9, Fl 24 (C)',

    specialAbilities: [
      'Breath weapon: 90\' cone of fire, 8d10+10 damage',
      'Save vs. breath weapon for half damage',
      'Immune to fire',
      'Casts spells as 3rd level wizard',
      'Fear aura: dragons cause fear in creatures < 1 HD'
    ],
    morale: 'Fearless (19-20)',
    intelligence: 'Exceptional (15-16)',
    alignment: 'Chaotic Evil',

    xp: 4000,
    treasureType: 'H',

    abilities: {
      STR: 20, DEX: 10, CON: 18,
      INT: 15, WIS: 13, CHA: 16
    },

    description: 'Young red dragons are already formidable predators. They are vain, greedy, and supremely confident in their power.',
    habitat: 'Mountains, volcanic regions, deep caverns',
  },
];

/**
 * Get unique monster types for filtering
 */
export function getMonsterTypes() {
  const types = new Set(monsters.map(m => m.type));
  return [
    { key: 'all', name: 'All Types' },
    ...Array.from(types).sort().map(type => ({
      key: type,
      name: type.charAt(0).toUpperCase() + type.slice(1)
    }))
  ];
}
