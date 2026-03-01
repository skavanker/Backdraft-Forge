/**
 * Place name generation for AD&D 2E world building.
 *
 * Generates context-aware names for settlements, landmarks, buildings, and dungeons.
 */

import { PLACE_BLACKLIST, isBlacklisted } from '../../data/blacklist.js';

import { settlementSyllables, landmarkSyllables, landmarkTypes } from '../../data/placeNames.js';
import {
  tavernPatterns,
  shopPatterns,
  templePatterns,
  dungeonPatterns,
  buildingPatterns,
  roadPatterns
} from '../../data/placePatterns.js';
import { getAdjectivesForLandmark } from '../../data/landmarkAdjectives.js';
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
    type = 'mountain' // bridge, cave, forest, river, lake, mountain, road, graveyard, ruins
  } = options;

  // Get available adjectives for this landmark type
  const availableAdjectives = getAdjectivesForLandmark(type);

  // Get type suffix
  const typeSuffix = landmarkTypes[type];
  const suffix = Array.isArray(typeSuffix) ? pick(typeSuffix) : typeSuffix;

  // Pick naming pattern
  const patternRoll = Math.random();

  if (patternRoll < 0.6) {
    // 60% - Single adjective: "Lonely Mountain"
    const adjObj = pick(availableAdjectives);
    return `${adjObj.adj} ${suffix}`;
  } else {
    // 40% - Two adjectives from different categories: "Dark Misty Peak"
    const adjObj1 = pick(availableAdjectives);

    // Filter to different category
    const differentCategory = availableAdjectives.filter(a => a.category !== adjObj1.category);

    // If we have adjectives from other categories, use one. Otherwise just use any different adjective
    let adjObj2;
    if (differentCategory.length > 0) {
      adjObj2 = pick(differentCategory);
    } else {
      // Fallback: just pick a different adjective
      adjObj2 = pick(availableAdjectives.filter(a => a.adj !== adjObj1.adj));
    }

    return `${adjObj1.adj} ${adjObj2.adj} ${suffix}`;
  }
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
    style = 'random' // 'pattern', 'adjective', or 'owner'
  } = options;

  // Determine style (40% pattern, 30% adjective, 30% owner)
  let nameStyle = style;
  if (nameStyle === 'random') {
    const roll = Math.random();
    if (roll < 0.4) {
      nameStyle = 'pattern';
    } else if (roll < 0.7) {
      nameStyle = 'adjective';
    } else {
      nameStyle = 'owner';
    }
  }

  // Handle random geography
  let geo = geography;
  if (geo === 'random') {
    const geographies = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert', 'neutral'];
    geo = pick(geographies);
  }

  if (nameStyle === 'owner') {
    // Generate owner surname
    const race = pick(['human', 'dwarf', 'elf', 'halfling']);
    const ownerNameObj = generateCharacterName(names, {
      race,
      gender: 'Male',
      geography: geo
    });
    const surname = ownerNameObj.name.split(' ')[1];
    const suffix = pick(tavernPatterns.suffixes);

    return `The ${surname} ${suffix}`;
  } else if (nameStyle === 'adjective') {
    // Adjective-based: "The [Adjective] Inn/Tavern"
    const availableAdjectives = getAdjectivesForLandmark('tavern', geo);
    const adjObj = pick(availableAdjectives);
    const suffix = pick(tavernPatterns.suffixes);

    // 90% "The", 10% "Ye"
    const article = Math.random() < 0.9 ? 'The' : 'Ye';

    return `${article} ${adjObj.adj} ${suffix}`;
  } else {
    // Pattern-based: "The [Adjective] [Noun]"
    const adjective = pick(tavernPatterns.adjectives);
    const nounList = tavernPatterns.nouns[geo] || tavernPatterns.nouns.neutral;
    const noun = pick(nounList);

    // 90% "The", 10% "Ye"
    const article = Math.random() < 0.9 ? 'The' : 'Ye';

    return `${article} ${adjective} ${noun}`;
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
    style = 'random' // 'pattern', 'adjective', or 'owner'
  } = options;

  // Handle random geography
  let geo = geography;
  if (geo === 'random') {
    const geographies = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert', 'neutral'];
    geo = pick(geographies);
  }

  // Determine style (30% pattern, 30% adjective, 40% owner)
  let nameStyle = style;
  if (nameStyle === 'random') {
    const roll = Math.random();
    if (roll < 0.3) {
      nameStyle = 'pattern';
    } else if (roll < 0.6) {
      nameStyle = 'adjective';
    } else {
      nameStyle = 'owner';
    }
  }

  if (nameStyle === 'owner') {
    // Generate owner name
    const race = pick(['human', 'dwarf', 'elf', 'gnome', 'halfling']);
    const ownerNameObj = generateCharacterName(names, {
      race,
      gender: Math.random() < 0.5 ? 'Male' : 'Female',
      geography: geo
    });

    const firstName = ownerNameObj.name.split(' ')[0];
    const shopType = pick(shopPatterns.types);

    return `${firstName}'s ${shopType}`;
  } else if (nameStyle === 'adjective') {
    // Adjective-based: "The [Adjective] Shop/Emporium"
    const availableAdjectives = getAdjectivesForLandmark('shop', geo);
    const adjObj = pick(availableAdjectives);
    const shopType = pick(shopPatterns.types);

    // 90% "The", 10% "Ye"
    const article = Math.random() < 0.9 ? 'The' : 'Ye';

    return `${article} ${adjObj.adj} ${shopType}`;
  } else {
    // Pattern-based
    const roll = Math.random();

    if (roll < 0.5) {
      // "The [Adjective] [Noun]" or "Ye [Adjective] [Noun]"
      const adjective = pick(shopPatterns.adjectives);
      const noun = pick(shopPatterns.nouns);

      // 90% "The", 10% "Ye"
      const article = Math.random() < 0.9 ? 'The' : 'Ye';

      return `${article} ${adjective} ${noun}`;
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
    geography = 'random'
  } = options;

  // Handle random geography
  let geo = geography;
  if (geo === 'random') {
    const geographies = ['mountain', 'forest', 'swamp', 'desert', 'underground', 'neutral'];
    geo = pick(geographies);
  }

  // Get available adjectives for dungeon with geography filter
  const availableAdjectives = getAdjectivesForLandmark('dungeon', geo);
  const adjObj = pick(availableAdjectives);
  const dungeonType = pick(dungeonPatterns.types);

  return `The ${adjObj.adj} ${dungeonType}`;
}

/**
 * Generate a tower name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated tower name
 */
export function generateTowerName() {
  // Get available adjectives for tower (treat like a landmark)
  const availableAdjectives = getAdjectivesForLandmark('tower');
  const adjObj = pick(availableAdjectives);
  const type = pick(buildingPatterns.tower.types);
  return `The ${adjObj.adj} ${type}`;
}

/**
 * Generate a castle name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated castle name
 */
export function generateCastleName() {
  // Get available adjectives for castle (treat like a landmark)
  const availableAdjectives = getAdjectivesForLandmark('castle');
  const adjObj = pick(availableAdjectives);
  const type = pick(buildingPatterns.castle.types);
  return `The ${adjObj.adj} ${type}`;
}

/**
 * Generate a library name
 *
 * @param {Object} options - Generation options
 * @returns {string} Generated library name
 */
export function generateLibraryName() {
  // Get available adjectives for library (treat like a landmark)
  const availableAdjectives = getAdjectivesForLandmark('library');
  const adjObj = pick(availableAdjectives);
  const type = pick(buildingPatterns.library.types);
  return `The ${adjObj.adj} ${type}`;
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
 * @returns {Object} Object with name and resolved placeType
 */
export function generatePlaceName(names, options = {}) {
  let { placeType = 'city', ...restOptions } = options;

  // Handle random-category selections
  if (placeType === 'random-settlements') {
    placeType = pick(['city', 'town', 'village']);
  } else if (placeType === 'random-landmarks') {
    placeType = pick(['bridge', 'cave', 'forest', 'river', 'lake', 'mountain', 'road', 'graveyard', 'ruins']);
  } else if (placeType === 'random-buildings') {
    placeType = pick(['tavern', 'shop', 'temple', 'tower', 'castle', 'library', 'dungeon']);
  }

  let name;

  switch (placeType) {
    // Settlements
    case 'city':
    case 'town':
    case 'village':
      name = generateSettlementName({ type: placeType, ...restOptions });
      break;

    // Landmarks
    case 'bridge':
    case 'cave':
    case 'forest':
    case 'river':
    case 'lake':
    case 'mountain':
    case 'graveyard':
    case 'ruins':
      name = generateLandmarkName({ type: placeType, ...restOptions });
      break;

    // Buildings
    case 'tavern':
      name = generateTavernName(names, restOptions);
      break;
    case 'shop':
      name = generateShopName(names, restOptions);
      break;
    case 'temple':
      name = generateTempleName(restOptions);
      break;
    case 'tower':
      name = generateTowerName(restOptions);
      break;
    case 'castle':
      name = generateCastleName(restOptions);
      break;
    case 'library':
      name = generateLibraryName(restOptions);
      break;
    case 'dungeon':
      name = generateDungeonName(restOptions);
      break;
    case 'road':
      name = generateRoadName(restOptions);
      break;

    default:
      name = 'Unknown Place';
  }

  return { name, resolvedType: placeType };
}

/**
 * Generate a safe place name (not blacklisted).
 *
 * @param {Object} names - Character names data
 * @param {Object} options - Generation options
 * @returns {Object} Generated safe place name with metadata
 */
function generateSafePlaceName(names, options = {}) {
  let attempts = 0;
  let result;

  do {
    result = generatePlaceName(names, options);
    attempts++;
  } while (isBlacklisted(result.name, PLACE_BLACKLIST) && attempts < 10);

  // Return object with name and metadata for display
  return {
    name: result.name,
    meta: {
      placeType: result.resolvedType,
      geography: options.geography || 'random'
    }
  };
}

/**
 * Generate multiple place names
 *
 * @param {Object} names - Character names data
 * @param {Object} options - Generation options
 * @param {number} count - Number of names to generate
 * @returns {Object[]} Array of generated place name objects with metadata
 */
export function generatePlaceNames(names, options = {}, count = 1) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateSafePlaceName(names, options));
  }
  return result;
}
