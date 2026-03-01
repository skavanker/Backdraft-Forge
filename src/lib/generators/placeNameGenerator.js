/**
 * Place name generation for AD&D 2E world building.
 *
 * Generates context-aware names for settlements, landmarks, buildings, and dungeons.
 */

/**
 * Blacklist of inappropriate place name combinations
 */
const PLACE_BLACKLIST = [
  // Pop culture references
  'baywatch', 'starwars', 'ironman', 'batman', 'superman',
  'gotham', 'metropolis', 'wakanda', 'narnia', 'hogwarts',
  'mordor', 'rivendell', 'gondor', 'rohan',

  // Modern/inappropriate terms
  'butthead', 'asshat', 'shithead',

  // Add more as needed
];

/**
 * Check if a place name contains blacklisted terms
 *
 * @param {string} name - Name to check
 * @returns {boolean} True if blacklisted
 */
function isBlacklisted(name) {
  const normalized = name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '').replace(/the/g, '');
  return PLACE_BLACKLIST.some(banned => normalized.includes(banned));
}

import { settlementSyllables, landmarkSyllables, landmarkTypes } from '../../data/placeNames.js';
import {
  tavernPatterns,
  shopPatterns,
  templePatterns,
  dungeonPatterns,
  buildingPatterns,
  roadPatterns
} from '../../data/placePatterns.js';
import { generateCharacterName } from './nameGenerator.js';

/**
 * Pick a random item from an array
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a settlement name (city, town, village)
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated settlement name
 */
export function generateSettlementName(options = {}) {
  const {
    type = 'city', // city, town, village
    geography = 'random'
  } = options;

  // Handle random geography
  let geo = geography;
  if (geo === 'random') {
    const geographies = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert'];
    geo = pick(geographies);
  }

  const syllables = settlementSyllables[type]?.[geo];
  if (!syllables) {
    return 'Unknown Settlement';
  }

  const prefix = pick(syllables.prefix);
  const suffix = pick(syllables.suffix);

  return prefix + suffix;
}

/**
 * Generate a landmark name (cave, forest, mountain, etc.)
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated landmark name
 */
export function generateLandmarkName(options = {}) {
  const {
    type = 'mountain', // bridge, cave, forest, river, lake, mountain, road, graveyard, ruins
    geography = 'random'
  } = options;

  // Handle random geography
  let geo = geography;
  if (geo === 'random') {
    // Pick geography based on landmark type
    const typeGeoMap = {
      bridge: ['coastal', 'forest', 'plains'],
      cave: ['mountain', 'underground'],
      forest: ['forest'],
      river: ['forest', 'plains'],
      lake: ['forest', 'plains'],
      mountain: ['mountain'],
      road: ['plains', 'forest'],
      graveyard: ['plains', 'swamp'],
      ruins: ['mountain', 'forest', 'desert']
    };
    const validGeos = typeGeoMap[type] || ['mountain', 'forest', 'plains'];
    geo = pick(validGeos);
  }

  // Get prefix from landmark syllables
  const prefixList = landmarkSyllables[geo] || landmarkSyllables['mountain'];
  const prefix = pick(prefixList);

  // Get type suffix
  const typeSuffix = landmarkTypes[type];
  const suffix = Array.isArray(typeSuffix) ? pick(typeSuffix) : typeSuffix;

  return `${prefix} ${suffix}`;
}

/**
 * Generate a tavern/inn name
 *
 * @param {Object} names - Character names data (for owner-based names)
 * @param {Object} options - Generation options
 * @returns {string} Generated tavern name
 */
export function generateTavernName(names, options = {}) {
  const {
    geography = 'random',
    style = 'random' // 'pattern' or 'owner'
  } = options;

  // Determine style (70% pattern, 30% owner)
  let nameStyle = style;
  if (nameStyle === 'random') {
    nameStyle = Math.random() < 0.7 ? 'pattern' : 'owner';
  }

  if (nameStyle === 'owner') {
    // Generate owner surname
    const race = pick(['human', 'dwarf', 'elf', 'halfling']);
    const ownerName = generateCharacterName(names, {
      race,
      gender: 'Male',
      geography: geography === 'random' ? 'random' : geography
    });
    const surname = ownerName.split(' ')[1];
    const suffix = pick(tavernPatterns.suffixes);

    return `The ${surname} ${suffix}`;
  } else {
    // Pattern-based: "The [Adjective] [Noun]"
    const adjective = pick(tavernPatterns.adjectives);

    // Pick nouns based on geography
    let geo = geography;
    if (geo === 'random') {
      const geographies = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert', 'neutral'];
      geo = pick(geographies);
    }

    const nounList = tavernPatterns.nouns[geo] || tavernPatterns.nouns.neutral;
    const noun = pick(nounList);

    return `The ${adjective} ${noun}`;
  }
}

/**
 * Generate a shop name
 *
 * @param {Object} names - Character names data (for owner-based names)
 * @param {Object} options - Generation options
 * @returns {string} Generated shop name
 */
export function generateShopName(names, options = {}) {
  const {
    geography = 'random',
    style = 'random' // 'pattern' or 'owner'
  } = options;

  // Determine style (50% pattern, 50% owner)
  let nameStyle = style;
  if (nameStyle === 'random') {
    nameStyle = Math.random() < 0.5 ? 'pattern' : 'owner';
  }

  if (nameStyle === 'owner') {
    // Generate owner name
    const race = pick(['human', 'dwarf', 'elf', 'gnome', 'halfling']);
    const ownerName = generateCharacterName(names, {
      race,
      gender: Math.random() < 0.5 ? 'Male' : 'Female',
      geography: geography === 'random' ? 'random' : geography
    });

    const shopType = pick(shopPatterns.types);

    return `${ownerName}'s ${shopType}`;
  } else {
    // Pattern-based
    const roll = Math.random();

    if (roll < 0.5) {
      // "The [Adjective] [Noun]"
      const adjective = pick(shopPatterns.adjectives);
      const noun = pick(shopPatterns.nouns);
      return `The ${adjective} ${noun}`;
    } else {
      // "[Noun] & [Noun]"
      const noun1 = pick(shopPatterns.nouns);
      let noun2 = pick(shopPatterns.nouns);
      // Avoid duplicates (with safety counter)
      let attempts = 0;
      while (noun2 === noun1 && shopPatterns.nouns.length > 1 && attempts < 10) {
        noun2 = pick(shopPatterns.nouns);
        attempts++;
      }
      return `${noun1} & ${noun2}`;
    }
  }
}

/**
 * Generate a temple/shrine name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated temple name
 */
export function generateTempleName(options = {}) {
  const {
    deityName = null // Optional: specific deity name
  } = options;

  const type = pick(templePatterns.types);

  if (deityName) {
    return `${type} of ${deityName}`;
  } else {
    const concept = pick(templePatterns.concepts);
    return `${type} of ${concept}`;
  }
}

/**
 * Generate a dungeon/ruins name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated dungeon name
 */
export function generateDungeonName(options = {}) {
  const {
    geography = 'random',
    style = 'random' // 'descriptive' or 'named'
  } = options;

  // Handle random geography
  let geo = geography;
  if (geo === 'random') {
    const geographies = ['mountain', 'forest', 'swamp', 'desert', 'underground', 'neutral'];
    geo = pick(geographies);
  }

  // Determine style (80% descriptive, 20% named)
  let nameStyle = style;
  if (nameStyle === 'random') {
    nameStyle = Math.random() < 0.8 ? 'descriptive' : 'named';
  }

  const dungeonType = pick(dungeonPatterns.types);

  if (nameStyle === 'descriptive') {
    // "The [Descriptor] [Type]"
    const descriptorList = dungeonPatterns.descriptors[geo] || dungeonPatterns.descriptors.neutral;
    const descriptor = pick(descriptorList);

    return `The ${descriptor} ${dungeonType}`;
  } else {
    // "[Name] [Type]" - use settlement prefix for name
    let nameGeo = geo === 'underground' ? 'mountain' : geo;

    // If neutral, randomly select a geography for variety
    if (nameGeo === 'neutral' || nameGeo === 'random') {
      const geographies = ['mountain', 'forest', 'swamp', 'desert', 'coastal', 'plains'];
      nameGeo = pick(geographies);
    }

    const prefixList = settlementSyllables.city?.[nameGeo]?.prefix || ['Dark'];
    const name = pick(prefixList);

    return `${name}${dungeonType === 'Halls' || dungeonType === 'Depths' ? '' : ' '}${dungeonType}`;
  }
}

/**
 * Generate a tower name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated tower name
 */
export function generateTowerName(options = {}) {
  const adjective = pick(buildingPatterns.tower.adjectives);
  return `The ${adjective} ${buildingPatterns.tower.type}`;
}

/**
 * Generate a castle name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated castle name
 */
export function generateCastleName(options = {}) {
  const adjective = pick(buildingPatterns.castle.adjectives);
  return `The ${adjective} ${buildingPatterns.castle.type}`;
}

/**
 * Generate a library name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated library name
 */
export function generateLibraryName(options = {}) {
  const adjective = pick(buildingPatterns.library.adjectives);
  return `The ${adjective} ${buildingPatterns.library.type}`;
}

/**
 * Generate a road/path name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated road name
 */
export function generateRoadName(options = {}) {
  const roll = Math.random();

  if (roll < 0.5) {
    // "[Direction] [Type]"
    const direction = pick(roadPatterns.directions);
    const type = pick(roadPatterns.types);
    return `${direction} ${type}`;
  } else {
    // "The [Adjective] [Type]"
    const adjective = pick(roadPatterns.adjectives);
    const type = pick(roadPatterns.types);
    return `The ${adjective} ${type}`;
  }
}

/**
 * Generate a place name based on type
 *
 * @param {Object} names - Character names data
 * @param {Object} options - Generation options
 * @returns {string} Generated place name
 */
export function generatePlaceName(names, options = {}) {
  const { placeType = 'city', ...restOptions } = options;

  switch (placeType) {
    // Settlements
    case 'city':
    case 'town':
    case 'village':
      return generateSettlementName({ type: placeType, ...restOptions });

    // Landmarks
    case 'bridge':
    case 'cave':
    case 'forest':
    case 'river':
    case 'lake':
    case 'mountain':
    case 'graveyard':
    case 'ruins':
      return generateLandmarkName({ type: placeType, ...restOptions });

    // Buildings
    case 'tavern':
      return generateTavernName(names, restOptions);
    case 'shop':
      return generateShopName(names, restOptions);
    case 'temple':
      return generateTempleName(restOptions);
    case 'tower':
      return generateTowerName(restOptions);
    case 'castle':
      return generateCastleName(restOptions);
    case 'library':
      return generateLibraryName(restOptions);
    case 'dungeon':
      return generateDungeonName(restOptions);
    case 'road':
      return generateRoadName(restOptions);

    default:
      return 'Unknown Place';
  }
}

/**
 * Generate a safe place name (not blacklisted).
 *
 * @param {Object} names - Character names data
 * @param {Object} options - Generation options
 * @returns {string} Generated safe place name
 */
function generateSafePlaceName(names, options = {}) {
  let attempts = 0;
  let name;

  do {
    name = generatePlaceName(names, options);
    attempts++;
  } while (isBlacklisted(name) && attempts < 10);

  // If still blacklisted after 10 attempts, return anyway
  return name;
}

/**
 * Generate multiple place names
 *
 * @param {Object} names - Character names data
 * @param {Object} options - Generation options
 * @param {number} count - Number of names to generate
 * @returns {string[]} Array of generated place names
 */
export function generatePlaceNames(names, options = {}, count = 1) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateSafePlaceName(names, options));
  }
  return result;
}
