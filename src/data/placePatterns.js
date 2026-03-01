/**
 * Name patterns for taverns, shops, and other establishments.
 *
 * Used for pattern-based generation (e.g., "The [Adjective] [Noun]")
 */

/**
 * Tavern/Inn name patterns
 * 70% use descriptive pattern: "The [Adjective] [Noun]"
 * 30% use owner pattern: "The [Surname] Inn/Tavern"
 */
export const tavernPatterns = {
  adjectives: [
    'Prancing', 'Dancing', 'Golden', 'Silver', 'Rusty', 'Drunken',
    'Slumbering', 'Roaring', 'Crimson', 'Jolly', 'Wayward', 'Broken',
    'Sleeping', 'Laughing', 'Weeping', 'Howling', 'Singing', 'Silent',
    'Merry', 'Lucky', 'Unlucky', 'Cursed', 'Blessed', 'Haunted',
    'Wandering', 'Lost', 'Found', 'Hidden', 'Open', 'Closed',
    'First', 'Last', 'Old', 'New', 'Ancient', 'Young'
  ],

  nouns: {
    coastal: [
      'Anchor', 'Sail', 'Mermaid', 'Kraken', 'Wave', 'Tide',
      'Ship', 'Sailor', 'Captain', 'Lighthouse', 'Whale', 'Dolphin',
      'Gull', 'Albatross', 'Compass', 'Rudder', 'Harbor', 'Reef'
    ],
    mountain: [
      'Mug', 'Stone', 'Hammer', 'Anvil', 'Peak', 'Hearth',
      'Dwarf', 'Beard', 'Axe', 'Pickaxe', 'Forge', 'Goat',
      'Ram', 'Eagle', 'Summit', 'Cavern', 'Throne', 'Hall'
    ],
    forest: [
      'Stag', 'Oak', 'Leaf', 'Acorn', 'Fox', 'Owl',
      'Deer', 'Wolf', 'Bear', 'Squirrel', 'Rabbit', 'Badger',
      'Tree', 'Branch', 'Root', 'Vine', 'Mushroom', 'Fern'
    ],
    plains: [
      'Horse', 'Plow', 'Wheat', 'Barrel', 'Mill', 'Windmill',
      'Sheep', 'Cow', 'Hen', 'Rooster', 'Cart', 'Wagon',
      'Scarecrow', 'Haystack', 'Sickle', 'Scythe', 'Pasture', 'Field'
    ],
    swamp: [
      'Frog', 'Toad', 'Lily', 'Bog', 'Mire', 'Mist',
      'Snake', 'Crocodile', 'Heron', 'Dragonfly', 'Reed', 'Moss',
      'Mosquito', 'Leech', 'Murk', 'Slime', 'Fen', 'Marsh'
    ],
    desert: [
      'Camel', 'Scorpion', 'Serpent', 'Dune', 'Oasis', 'Mirage',
      'Cactus', 'Sand', 'Sun', 'Moon', 'Star', 'Vulture',
      'Lizard', 'Beetle', 'Palm', 'Well', 'Shade', 'Dust'
    ],
    neutral: [
      'Pony', 'Dragon', 'Lion', 'Bear', 'Crow', 'Wolf', 'Unicorn',
      'Griffin', 'Phoenix', 'Serpent', 'Wyvern', 'Hydra', 'Basilisk',
      'Crown', 'Sword', 'Shield', 'Throne', 'Castle', 'Tower',
      'Knight', 'King', 'Queen', 'Prince', 'Princess', 'Lord',
      'Rose', 'Lily', 'Thorn', 'Star', 'Moon', 'Sun'
    ]
  },

  suffixes: ['Inn', 'Tavern', 'Alehouse', 'Taproom']
};

/**
 * Shop name patterns
 * 50% use descriptive: "The [Adjective] [Noun]" or "[Noun] & [Noun]"
 * 50% use owner: "[Name]'s [Shop Type]"
 */
export const shopPatterns = {
  adjectives: [
    'Golden', 'Silver', 'Bronze', 'Iron', 'Copper',
    'Fine', 'Rare', 'Common', 'Exotic', 'Strange',
    'Old', 'New', 'Ancient', 'Modern', 'Antique',
    'Lucky', 'Curious', 'Mysterious', 'Enchanted', 'Mundane',
    'Grand', 'Humble', 'Noble', 'Poor', 'Rich'
  ],

  nouns: [
    'Scale', 'Coin', 'Crown', 'Sword', 'Shield',
    'Book', 'Scroll', 'Tome', 'Quill', 'Inkwell',
    'Hammer', 'Anvil', 'Forge', 'Blade', 'Edge',
    'Potion', 'Flask', 'Vial', 'Elixir', 'Brew',
    'Ring', 'Amulet', 'Gem', 'Crystal', 'Stone',
    'Boot', 'Cloak', 'Hat', 'Glove', 'Belt'
  ],

  types: [
    'Shop', 'Emporium', 'Store', 'Establishment', 'Curiosities',
    'Goods', 'Wares', 'Supplies', 'Trading Post', 'Market',
    'Smithy', 'Forge', 'Armory', 'Fletcher', 'Bowyer',
    'Apothecary', 'Alchemist', 'Herbalist', 'Healer',
    'Scribe', 'Library', 'Bookshop', 'Scriptorium',
    'Tailors', 'Clothiers', 'Weavers', 'Cobblers'
  ]
};

/**
 * Temple/Shrine patterns
 * Pattern: "Temple/Shrine/Church of [Deity/Concept]"
 */
export const templePatterns = {
  types: ['Temple', 'Shrine', 'Church', 'Cathedral', 'Chapel', 'Abbey', 'Monastery'],

  concepts: [
    'Light', 'Darkness', 'Dawn', 'Dusk', 'Sun', 'Moon',
    'Stars', 'Sky', 'Earth', 'Sea', 'Fire', 'Air',
    'Life', 'Death', 'War', 'Peace', 'Knowledge', 'Wisdom',
    'Justice', 'Mercy', 'Vengeance', 'Hope', 'Despair', 'Dreams',
    'Nature', 'Magic', 'Time', 'Fate', 'Fortune', 'Chaos'
  ]
};

/**
 * Dungeon/Ruins descriptors
 * Pattern: "The [Descriptor] [Type]" or "[Name] [Type]"
 */
export const dungeonPatterns = {
  descriptors: {
    mountain: [
      'Dark', 'Deep', 'Lost', 'Forgotten', 'Ancient', 'Sunless',
      'Abandoned', 'Cursed', 'Haunted', 'Sealed', 'Hidden', 'Secret'
    ],
    forest: [
      'Overgrown', 'Hidden', 'Lost', 'Forgotten', 'Ancient', 'Verdant',
      'Tangled', 'Thorny', 'Shadowed', 'Abandoned', 'Cursed', 'Haunted'
    ],
    swamp: [
      'Rotting', 'Drowned', 'Sunken', 'Fetid', 'Cursed', 'Abandoned',
      'Decaying', 'Murky', 'Flooded', 'Soggy', 'Dank', 'Reeking'
    ],
    desert: [
      'Buried', 'Sand-covered', 'Lost', 'Forgotten', 'Ancient', 'Scorched',
      'Windswept', 'Abandoned', 'Hidden', 'Sun-bleached', 'Dry', 'Dusty'
    ],
    underground: [
      'Sunless', 'Black', 'Endless', 'Forgotten', 'Sealed', 'Deep',
      'Hidden', 'Secret', 'Ancient', 'Lost', 'Dark', 'Abyssal'
    ],
    neutral: [
      'Forgotten', 'Lost', 'Ancient', 'Cursed', 'Haunted', 'Abandoned',
      'Ruined', 'Broken', 'Fallen', 'Shattered', 'Doomed', 'Damned'
    ]
  },

  types: [
    'Halls', 'Citadel', 'Catacombs', 'Crypts', 'Ruins', 'Vault',
    'Depths', 'Dungeon', 'Keep', 'Tower', 'Fortress', 'Stronghold',
    'Labyrinth', 'Maze', 'Warren', 'Chambers', 'Tomb', 'Barrow',
    'Sanctuary', 'Temple', 'Shrine', 'Library', 'Archive', 'Spire'
  ]
};

/**
 * Building/Landmark descriptors
 * Pattern: "The [Descriptor] [Type]"
 */
export const buildingPatterns = {
  tower: {
    adjectives: [
      'High', 'Tall', 'Ancient', 'Crumbling', 'Black', 'White',
      'Crystal', 'Iron', 'Stone', 'Ivory', 'Obsidian', 'Bone',
      'Wizard\'s', 'Mage\'s', 'Sorcerer\'s', 'Witch\'s', 'Warlock\'s'
    ],
    type: 'Tower'
  },

  castle: {
    adjectives: [
      'Grand', 'Ancient', 'Ruined', 'Abandoned', 'Haunted', 'Cursed',
      'Royal', 'Noble', 'Dark', 'White', 'Black', 'Red',
      'Stone', 'Iron', 'Silver', 'Golden', 'Crystal', 'Shadow'
    ],
    type: 'Castle'
  },

  library: {
    adjectives: [
      'Great', 'Ancient', 'Dusty', 'Forgotten', 'Lost', 'Hidden',
      'Royal', 'Arcane', 'Forbidden', 'Sacred', 'Grand', 'Old'
    ],
    type: 'Library'
  }
};

/**
 * Road/Path names
 * Pattern: "[Direction/Destination] [Type]" or "The [Adjective] [Type]"
 */
export const roadPatterns = {
  directions: ['North', 'South', 'East', 'West', 'High', 'Low', 'Old', 'New'],
  adjectives: ['King\'s', 'Queen\'s', 'Trade', 'Merchant', 'Pilgrim', 'Ancient', 'Lost', 'Hidden'],
  types: ['Road', 'Path', 'Way', 'Highway', 'Route', 'Trail']
};
