/**
 * Place name syllables for AD&D 2E world generation.
 *
 * Organized by place type and geography for context-aware generation.
 */

/**
 * Settlement syllables (cities, towns, villages)
 * Pattern: [Prefix] + [Suffix]
 */
export const settlementSyllables = {
  city: {
    coastal: {
      prefix: [
        'Storm', 'Bay', 'Wave', 'Tide', 'Harbor', 'Port', 'Sea',
        'Salt', 'Coral', 'Pearl', 'Shell', 'Reef', 'Anchor', 'Sail'
      ],
      suffix: [
        'haven', 'port', 'crest', 'guard', 'watch', 'gate', 'hold',
        'bay', 'shore', 'rest', 'fall', 'cove', 'break', 'tide'
      ]
    },
    mountain: {
      prefix: [
        'Iron', 'Stone', 'Deep', 'High', 'Rock', 'Peak', 'Granite',
        'Steel', 'Anvil', 'Forge', 'Thunder', 'Summit', 'Cliff', 'Crag'
      ],
      suffix: [
        'forge', 'peak', 'delve', 'hold', 'crest', 'gate', 'fall',
        'helm', 'keep', 'spire', 'hall', 'citadel', 'watch', 'guard'
      ]
    },
    forest: {
      prefix: [
        'Oak', 'Green', 'Silver', 'Wood', 'Leaf', 'Elder', 'Shadow',
        'Elm', 'Willow', 'Cedar', 'Pine', 'Moss', 'Fern', 'Briar'
      ],
      suffix: [
        'wood', 'vale', 'haven', 'grove', 'glade', 'leaf', 'deep',
        'rest', 'shade', 'green', 'bourne', 'hollow', 'reach', 'song'
      ]
    },
    plains: {
      prefix: [
        'Wind', 'Grass', 'Meadow', 'Field', 'High', 'Far', 'Golden',
        'Wheat', 'Grain', 'Harvest', 'Summer', 'Fair', 'Green', 'Swift'
      ],
      suffix: [
        'field', 'reach', 'haven', 'mark', 'shire', 'moor', 'vale',
        'land', 'hold', 'watch', 'rest', 'gate', 'crest', 'bourne'
      ]
    },
    swamp: {
      prefix: [
        'Bog', 'Marsh', 'Mist', 'Mire', 'Reed', 'Dark', 'Rot',
        'Moss', 'Fen', 'Murk', 'Dreg', 'Dank', 'Gloom', 'Shadow'
      ],
      suffix: [
        'marsh', 'mere', 'mire', 'gate', 'hold', 'haven', 'deep',
        'rest', 'watch', 'fen', 'bog', 'murk', 'fall', 'shade'
      ]
    },
    desert: {
      prefix: [
        'Sun', 'Sand', 'Dust', 'Dune', 'Dry', 'Scorch', 'Waste',
        'Gold', 'Flame', 'Heat', 'Amber', 'Mirage', 'Oasis', 'Salt'
      ],
      suffix: [
        'reach', 'hold', 'rest', 'gate', 'spire', 'haven', 'mark',
        'watch', 'fall', 'keep', 'crest', 'guard', 'fort', 'citadel'
      ]
    }
  },

  town: {
    coastal: {
      prefix: [
        'Fish', 'Salt', 'Tide', 'Shell', 'Bay', 'Dock', 'Reef',
        'Gull', 'Nets', 'Boat', 'Crab', 'Kelp', 'Wharf', 'Marina'
      ],
      suffix: [
        'port', 'bay', 'cove', 'creek', 'ford', 'mouth', 'bridge',
        'ton', 'wick', 'ham', 'rest', 'watch', 'cross', 'landing'
      ]
    },
    mountain: {
      prefix: [
        'High', 'Rock', 'Stone', 'Hill', 'Iron', 'Cold', 'Gray',
        'Ridge', 'Crag', 'Copper', 'Silver', 'Flint', 'Coal', 'Ore'
      ],
      suffix: [
        'ton', 'gate', 'fall', 'ridge', 'cliff', 'ham', 'wick',
        'hold', 'keep', 'rest', 'ford', 'bridge', 'cross', 'watch'
      ]
    },
    forest: {
      prefix: [
        'Green', 'Leaf', 'Wood', 'Oak', 'Birch', 'Willow', 'Elm',
        'Maple', 'Branch', 'Root', 'Thorn', 'Berry', 'Nut', 'Deer'
      ],
      suffix: [
        'wood', 'grove', 'vale', 'ton', 'ham', 'wick', 'rest',
        'hollow', 'bridge', 'ford', 'cross', 'gate', 'watch', 'green'
      ]
    },
    plains: {
      prefix: [
        'Wheat', 'Corn', 'Barley', 'Hay', 'Mill', 'Market', 'Fair',
        'Green', 'West', 'East', 'South', 'North', 'Middle', 'New'
      ],
      suffix: [
        'ton', 'field', 'ford', 'bridge', 'cross', 'ham', 'wick',
        'market', 'dale', 'vale', 'gate', 'rest', 'watch', 'mill'
      ]
    },
    swamp: {
      prefix: [
        'Mire', 'Bog', 'Moss', 'Reed', 'Murk', 'Dank', 'Wet',
        'Mud', 'Slough', 'Fen', 'Marsh', 'Pond', 'Rot', 'Dreg'
      ],
      suffix: [
        'ton', 'rest', 'watch', 'bridge', 'cross', 'ham', 'wick',
        'ford', 'gate', 'landing', 'marsh', 'fen', 'mere', 'bog'
      ]
    },
    desert: {
      prefix: [
        'Sand', 'Dust', 'Dry', 'Red', 'White', 'Yellow', 'Sun',
        'Shade', 'Palm', 'Well', 'Spring', 'Oasis', 'Dune', 'Mesa'
      ],
      suffix: [
        'rest', 'well', 'spring', 'gate', 'watch', 'ford', 'cross',
        'ton', 'hold', 'fort', 'post', 'pass', 'way', 'rock'
      ]
    }
  },

  village: {
    coastal: {
      prefix: [
        'Salt', 'Fish', 'Tide', 'Shell', 'Bay', 'Dock', 'Reef',
        'Crab', 'Nets', 'Gull', 'Kelp', 'Sand', 'Pebble', 'Clam'
      ],
      suffix: [
        'brook', 'pond', 'creek', 'field', 'ton', 'wick', 'ham',
        'cove', 'bay', 'landing', 'beach', 'shore', 'mouth', 'end'
      ]
    },
    mountain: {
      prefix: [
        'High', 'Rock', 'Stone', 'Hill', 'Cold', 'Gray', 'Snow',
        'Ice', 'Peak', 'Crag', 'Ridge', 'Cliff', 'Boulder', 'Flint'
      ],
      suffix: [
        'ton', 'ham', 'wick', 'field', 'ridge', 'cliff', 'peak',
        'rest', 'end', 'side', 'top', 'head', 'foot', 'pass'
      ]
    },
    forest: {
      prefix: [
        'Green', 'Wood', 'Oak', 'Elm', 'Birch', 'Maple', 'Pine',
        'Fern', 'Moss', 'Berry', 'Nut', 'Leaf', 'Thorn', 'Briar'
      ],
      suffix: [
        'wood', 'grove', 'hollow', 'ton', 'ham', 'wick', 'field',
        'green', 'end', 'side', 'rest', 'glen', 'vale', 'glade'
      ]
    },
    plains: {
      prefix: [
        'Wheat', 'Corn', 'Hay', 'Barley', 'Oat', 'Mill', 'Farm',
        'Sheep', 'Cow', 'Plow', 'Meadow', 'Green', 'Fair', 'New'
      ],
      suffix: [
        'ton', 'field', 'ham', 'wick', 'ford', 'bridge', 'cross',
        'mill', 'farm', 'end', 'side', 'rest', 'dale', 'vale'
      ]
    },
    swamp: {
      prefix: [
        'Bog', 'Moss', 'Reed', 'Mire', 'Mud', 'Wet', 'Dank',
        'Murk', 'Fen', 'Marsh', 'Pond', 'Slough', 'Rot', 'Dreg'
      ],
      suffix: [
        'ton', 'ham', 'wick', 'rest', 'end', 'side', 'marsh',
        'fen', 'bog', 'mere', 'pond', 'mire', 'landing', 'ford'
      ]
    },
    desert: {
      prefix: [
        'Sand', 'Dust', 'Dry', 'Hot', 'Red', 'Sun', 'Shade',
        'Well', 'Spring', 'Palm', 'Oasis', 'Dune', 'Mesa', 'Rock'
      ],
      suffix: [
        'well', 'spring', 'rest', 'end', 'ton', 'ham', 'rock',
        'shade', 'post', 'way', 'pass', 'ford', 'cross', 'oasis'
      ]
    }
  }
};

/**
 * Landmark syllables (natural features and monuments)
 * Pattern: [Prefix] + [Type]
 */
export const landmarkSyllables = {
  coastal: [
    'Storm', 'Wave', 'Tide', 'Bay', 'Salt', 'Coral', 'Pearl',
    'Shell', 'Reef', 'Anchor', 'Sail', 'Gull', 'Kraken', 'Mist'
  ],
  mountain: [
    'Iron', 'Stone', 'High', 'Deep', 'Rock', 'Peak', 'Thunder',
    'Steel', 'Granite', 'Snow', 'Ice', 'Crag', 'Summit', 'Cliff'
  ],
  forest: [
    'Oak', 'Green', 'Silver', 'Shadow', 'Elder', 'Willow', 'Cedar',
    'Leaf', 'Moss', 'Fern', 'Thorn', 'Briar', 'Ivy', 'Root'
  ],
  plains: [
    'Wind', 'Grass', 'Meadow', 'Golden', 'Swift', 'Far', 'Wild',
    'Harvest', 'Summer', 'Fair', 'Free', 'Open', 'Broad', 'Long'
  ],
  swamp: [
    'Mist', 'Bog', 'Marsh', 'Dark', 'Rot', 'Murk', 'Reed', 'Fen',
    'Gloom', 'Shadow', 'Dank', 'Dreg', 'Slime', 'Mire'
  ],
  desert: [
    'Sun', 'Sand', 'Dust', 'Scorch', 'Flame', 'Gold', 'Amber',
    'Heat', 'Dry', 'Waste', 'Mirage', 'Dune', 'Red', 'Pale'
  ],
  underground: [
    'Dark', 'Deep', 'Black', 'Sunless', 'Endless', 'Forgotten',
    'Lost', 'Ancient', 'Sealed', 'Hidden', 'Shadow', 'Echo'
  ]
};

/**
 * Landmark types by category
 */
export const landmarkTypes = {
  bridge: 'Bridge',
  cave: ['Cave', 'Caverns', 'Grotto'],
  forest: ['Wood', 'Forest', 'Grove'],
  river: 'River',
  lake: ['Lake', 'Mere', 'Pool'],
  mountain: ['Mountain', 'Peak', 'Mount'],
  road: ['Road', 'Path', 'Way'],
  graveyard: ['Graveyard', 'Cemetery', 'Burial Ground'],
  ruins: ['Ruins', 'Wreck', 'Remnants']
};
