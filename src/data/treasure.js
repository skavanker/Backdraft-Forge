/**
 * AD&D 2nd Edition Treasure Data
 * Based on DMG treasure tables
 */

// Gem values and types (DMG p. 134-135)
export const gemTypes = {
  ornamental: {
    value: 10,
    types: [
      'Azurite (opaque mottled deep blue)',
      'Banded Agate (translucent striped brown, blue, white, or red)',
      'Blue Quartz (transparent pale blue)',
      'Eye Agate (translucent circles of gray, white, brown, blue, or green)',
      'Hematite (opaque gray-black)',
      'Lapis Lazuli (opaque light and dark blue with yellow flecks)',
      'Malachite (opaque striated light and dark green)',
      'Moss Agate (translucent pink or yellow-white with mossy gray or green markings)',
      'Obsidian (opaque black)',
      'Rhodochrosite (opaque light pink)',
      'Tiger Eye (translucent brown with golden center)',
      'Turquoise (opaque light blue-green)'
    ]
  },
  semiprecious: {
    value: 50,
    types: [
      'Bloodstone (opaque dark gray with red flecks)',
      'Carnelian (opaque orange to red-brown)',
      'Chalcedony (opaque white)',
      'Chrysoprase (translucent green)',
      'Citrine (transparent pale yellow-brown)',
      'Jasper (opaque blue, black, or brown)',
      'Moonstone (translucent white with pale blue glow)',
      'Onyx (opaque bands of black and white, or pure black or white)',
      'Rock Crystal (transparent clear)',
      'Sardonyx (opaque bands of red and white)',
      'Smoky Quartz (transparent brown)',
      'Star Rose Quartz (translucent rosy stone with white star center)',
      'Zircon (transparent pale blue-green)'
    ]
  },
  fancy: {
    value: 100,
    types: [
      'Amber (transparent watery gold to rich gold)',
      'Alexandrite (transparent dark green)',
      'Amethyst (transparent deep purple)',
      'Aquamarine (transparent pale blue-green)',
      'Chrysoberyl (transparent yellow-green to pale green)',
      'Coral (opaque crimson)',
      'Garnet (transparent red, brown-green, or violet)',
      'Jade (translucent light green, deep green, or white)',
      'Jet (opaque deep black)',
      'Pearl (opaque lustrous white, yellowish, or pink)',
      'Spinel (transparent red, red-brown, deep green, or deep blue)',
      'Tourmaline (transparent pale green, blue, brown, or red)'
    ]
  },
  precious: {
    value: 500,
    types: [
      'Topaz (transparent golden yellow)',
      'Opal (translucent pale blue with green and golden mottling)',
      'Star Sapphire (translucent blue sapphire with white star center)',
      'Emerald (transparent bright green)',
      'Fire Opal (translucent fiery red)',
      'Sapphire (transparent clear blue to black)',
      'Black Sapphire (translucent lustrous black with glowing highlights)',
      'Star Ruby (translucent ruby with white star center)'
    ]
  },
  gem: {
    value: 1000,
    types: [
      'Jacinth (transparent fiery orange)',
      'Ruby (transparent clear red to deep crimson)'
    ]
  },
  jewel: {
    value: 5000,
    types: [
      'Black Opal (translucent dark green with black and gold mottling)',
      'Diamond (transparent clear pale blue, canary, pink, brown, or blue-white)',
      'Oriental Amethyst (transparent rich purple)',
      'Oriental Emerald (transparent brilliant green)',
      'Oriental Topaz (transparent fiery yellow)'
    ]
  }
};

// Art objects (DMG p. 135-136)
export const artObjectTypes = {
  minor: {
    valueRange: [10, 100],
    types: [
      'Silver ewer',
      'Carved bone statuette',
      'Small gold bracelet',
      'Cloth-of-gold vestments',
      'Black velvet mask stitched with silver thread',
      'Copper chalice with silver filigree',
      'Pair of engraved bone dice',
      'Small mirror set in painted wooden frame',
      'Embroidered silk handkerchief',
      'Gold locket with painted portrait'
    ]
  },
  medium: {
    valueRange: [100, 500],
    types: [
      'Gold ring set with bloodstones',
      'Carved ivory statuette',
      'Large gold bracelet',
      'Silver necklace with gemstone pendant',
      'Bronze crown',
      'Silk robe with gold embroidery',
      'Large well-made tapestry',
      'Brass mug with jade inlay',
      'Box of turquoise animal figurines',
      'Gold bird cage with electrum filigree'
    ]
  },
  major: {
    valueRange: [500, 2000],
    types: [
      'Silver chalice set with moonstones',
      'Silver-plated steel longsword with jet set in hilt',
      'Carved harp of exotic wood with ivory inlay and zircon gems',
      'Small gold idol',
      'Gold dragon comb set with red garnets as eyes',
      'Gold and topaz bottle stopper cork',
      'Ceremonial electrum dagger with black pearl pommel',
      'Silver and gold brooch',
      'Obsidian statuette with gold fittings and inlay',
      'Painted gold war mask'
    ]
  },
  masterwork: {
    valueRange: [2000, 10000],
    types: [
      'Fine gold chain set with a fire opal',
      'Old masterpiece painting',
      'Embroidered silk and velvet mantle set with numerous moonstones',
      'Platinum bracelet set with sapphires',
      'Embroidered glove set with jewel chips',
      'Jeweled anklet',
      'Gold music box',
      'Gold circlet set with four aquamarines',
      'Eye patch with a mock eye set in blue sapphire and moonstone',
      'A necklace string of small pink pearls'
    ]
  }
};

// Treasure Types (DMG p. 133)
export const treasureTypes = {
  A: {
    name: 'Large treasure (dragon hoard)',
    copper: { chance: 25, amount: '1d6×1000' },
    silver: { chance: 30, amount: '1d6×1000' },
    electrum: { chance: 20, amount: '1d4×1000' },
    gold: { chance: 35, amount: '2d6×1000' },
    platinum: { chance: 25, amount: '1d2×1000' },
    gems: { chance: 50, amount: '4d10' },
    art: { chance: 40, amount: '1d10' },
    magic: { chance: 30, amount: '3 any' }
  },
  B: {
    name: 'Average treasure',
    copper: { chance: 50, amount: '1d8×1000' },
    silver: { chance: 25, amount: '1d6×1000' },
    electrum: { chance: 25, amount: '1d4×1000' },
    gold: { chance: 25, amount: '1d3×1000' },
    platinum: null,
    gems: { chance: 25, amount: '1d6' },
    art: { chance: 25, amount: '1d3' },
    magic: { chance: 10, amount: '1 sword, armor, or weapon' }
  },
  C: {
    name: 'Small treasure',
    copper: { chance: 20, amount: '1d12×1000' },
    silver: { chance: 30, amount: '1d4×1000' },
    electrum: { chance: 10, amount: '1d4×1000' },
    gold: null,
    platinum: null,
    gems: { chance: 25, amount: '1d4' },
    art: { chance: 20, amount: '1d3' },
    magic: { chance: 10, amount: '2 any' }
  },
  D: {
    name: 'Small treasure with less magic',
    copper: { chance: 10, amount: '1d8×1000' },
    silver: { chance: 15, amount: '1d12×1000' },
    electrum: null,
    gold: { chance: 60, amount: '1d6×1000' },
    platinum: null,
    gems: { chance: 30, amount: '1d8' },
    art: { chance: 25, amount: '1d4' },
    magic: { chance: 15, amount: '2 any + 1 potion' }
  },
  E: {
    name: 'Small treasure with potions',
    copper: { chance: 5, amount: '1d10×1000' },
    silver: { chance: 25, amount: '1d12×1000' },
    electrum: { chance: 25, amount: '1d4×1000' },
    gold: { chance: 25, amount: '1d8×1000' },
    platinum: null,
    gems: { chance: 10, amount: '1d10' },
    art: { chance: 25, amount: '1d4' },
    magic: { chance: 25, amount: '3 potions' }
  },
  F: {
    name: 'Large treasure with less magic',
    copper: null,
    silver: { chance: 10, amount: '2d10×1000' },
    electrum: { chance: 20, amount: '1d8×1000' },
    gold: { chance: 45, amount: '1d12×1000' },
    platinum: { chance: 30, amount: '1d3×1000' },
    gems: { chance: 20, amount: '2d12' },
    art: { chance: 10, amount: '1d8' },
    magic: { chance: 30, amount: '3 any except weapons' }
  },
  G: {
    name: 'Very large treasure with magic',
    copper: null,
    silver: null,
    electrum: null,
    gold: { chance: 50, amount: '10d4×1000' },
    platinum: { chance: 50, amount: '1d6×1000' },
    gems: { chance: 25, amount: '3d6' },
    art: { chance: 25, amount: '1d10' },
    magic: { chance: 35, amount: '4 any + 1 scroll' }
  },
  H: {
    name: 'Very large treasure with scrolls',
    copper: { chance: 25, amount: '3d8×1000' },
    silver: { chance: 50, amount: '1d100×1000' },
    electrum: { chance: 50, amount: '10d4×1000' },
    gold: { chance: 50, amount: '10d6×1000' },
    platinum: { chance: 25, amount: '5d4×1000' },
    gems: { chance: 50, amount: '1d100' },
    art: { chance: 50, amount: '10d4' },
    magic: { chance: 15, amount: '4 any + 1d4 potions + 1 scroll' }
  },
  I: {
    name: 'Gem-heavy treasure',
    copper: null,
    silver: null,
    electrum: null,
    gold: null,
    platinum: { chance: 30, amount: '1d8×1000' },
    gems: { chance: 50, amount: '2d10' },
    art: { chance: 50, amount: '2d10' },
    magic: { chance: 15, amount: '1 any' }
  },
  J: {
    name: 'Coin-only treasure',
    copper: { chance: 25, amount: '1d4×1000' },
    silver: { chance: 10, amount: '1d3×1000' },
    electrum: null,
    gold: null,
    platinum: null,
    gems: null,
    art: null,
    magic: null
  },
  K: {
    name: 'Silver and electrum',
    copper: null,
    silver: { chance: 30, amount: '1d6×1000' },
    electrum: { chance: 10, amount: '1d2×1000' },
    gold: null,
    platinum: null,
    gems: null,
    art: null,
    magic: null
  },
  L: {
    name: 'Gems only',
    copper: null,
    silver: null,
    electrum: null,
    gold: null,
    platinum: null,
    gems: { chance: 50, amount: '1d4' },
    art: null,
    magic: null
  },
  M: {
    name: 'Gold and platinum',
    copper: null,
    silver: null,
    electrum: null,
    gold: { chance: 40, amount: '2d4×1000' },
    platinum: { chance: 50, amount: '5d6×100' },
    gems: { chance: 55, amount: '5d4' },
    art: null,
    magic: null
  },
  N: {
    name: 'Small magical treasure',
    copper: null,
    silver: null,
    electrum: null,
    gold: null,
    platinum: null,
    gems: null,
    art: null,
    magic: { chance: 40, amount: '2d4 potions' }
  },
  O: {
    name: 'Large magical treasure',
    copper: null,
    silver: null,
    electrum: null,
    gold: null,
    platinum: null,
    gems: null,
    art: null,
    magic: { chance: 50, amount: '1d4 scrolls' }
  }
};

// Magic item categories (simplified placeholders)
export const magicItemCategories = [
  'Potion',
  'Scroll',
  'Ring',
  'Rod/Staff/Wand',
  'Weapon',
  'Armor',
  'Miscellaneous Magic'
];

// Common magic items (simplified for now)
export const commonMagicItems = [
  'Potion of Healing',
  'Potion of Extra Healing',
  'Scroll of Protection',
  'Ring of Protection +1',
  'Wand of Magic Detection',
  '+1 Sword',
  '+1 Shield',
  'Bag of Holding',
  'Boots of Elvenkind',
  'Cloak of Elvenkind',
  'Potion of Speed',
  'Scroll of Magic Missile',
  'Ring of Fire Resistance',
  '+1 Dagger',
  'Wand of Illumination',
  'Bracers of Defense AC 6',
  'Rope of Climbing',
  'Dust of Disappearance',
  'Elixir of Health',
  'Potion of Invisibility'
];

// Mundane items and interesting finds
export const mundaneItems = {
  tools: [
    'Set of thieves\' tools (masterwork)',
    'Healer\'s kit with rare herbs',
    'Navigator\'s tools with brass sextant',
    'Mason\'s tools (well-used)',
    'Cartographer\'s tools and blank maps',
    'Alchemist\'s portable kit',
    'Jeweler\'s loupe and tools',
    'Blacksmith\'s hammer (family heirloom)',
    'Carpenter\'s tools (complete set)',
    'Locksmith\'s precision tools'
  ],

  tradeGoods: [
    'Bolt of fine silk (50 yards)',
    'Cask of aged wine (10 gallons)',
    'Jar of rare spices (saffron, pepper)',
    'Barrel of premium ale',
    'Bolt of velvet cloth',
    'Sack of fine tea leaves',
    'Crate of exotic incense',
    'Bundle of rare furs',
    'Case of fine tobacco',
    'Amphora of perfumed oil'
  ],

  documents: [
    'Treasure map (partially legible)',
    'Deed to a small property',
    'Letter of credit (50-500 gp)',
    'Noble\'s sealed letter',
    'Old journal with cryptic notes',
    'Shipping manifest',
    'Wanted poster (bounty listed)',
    'Religious text (illuminated)',
    'Spell scroll (non-magical, instructions only)',
    'Land survey map'
  ],

  trinkets: [
    'Silver pocket watch (non-magical)',
    'Ivory chess set',
    'Crystal decanter',
    'Music box (plays a haunting melody)',
    'Ornate hand mirror',
    'Smoking pipe (carved meerschaum)',
    'Brass telescope',
    'Leather-bound book (poetry)',
    'Set of loaded dice',
    'Deck of cards (fortune telling)'
  ],

  gear: [
    '50 ft. of silk rope',
    'Grappling hook (folding)',
    'Bullseye lantern (engraved)',
    'Set of signal whistles',
    'Hooded lantern with oil',
    'Block and tackle (quality)',
    'Climbing pitons (dozen)',
    'Tent (4-person, waterproof)',
    'Winter blankets (pair)',
    'Waterskin (large, treated leather)'
  ],

  containers: [
    'Ornate wooden chest',
    'Iron lockbox (locked)',
    'Leather map case',
    'Velvet jewelry box',
    'Ceramic urn (sealed)',
    'Silver flask (engraved)',
    'Brass coffer',
    'Wooden scroll tube (ivory caps)',
    'Stone sarcophagus (small)',
    'Metal strongbox (trapped)'
  ]
};

/**
 * Get random mundane item
 * @returns {string} Item description
 */
export function getRandomMundaneItem() {
  const categories = Object.values(mundaneItems);
  const category = categories[Math.floor(Math.random() * categories.length)];
  return category[Math.floor(Math.random() * category.length)];
}
