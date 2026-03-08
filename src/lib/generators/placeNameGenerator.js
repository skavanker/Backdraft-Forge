/**
 * Place name generation for AD&D 2E world building.
 *
 * Generates context-aware names for settlements, landmarks, buildings, and dungeons.
 *
 * Settlements now use the same Markov chains as human surnames — they were trained on
 * geography-specific compound words (Blackwood, Ironhaven, Stormcliff…) which read
 * naturally as settlement names.
 */

import { PLACE_BLACKLIST, isBlacklisted } from '../../data/blacklist.js';

import { walkChain, getLoadedChains } from './nameGenerator.js';

import { landmarkTypes } from '../../data/placeNames.js';
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
import { pick } from '../utils/randomUtils.js';

// ─── Geography helpers ─────────────────────────────────────────────────────────

const ALL_GEOS = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert'];

function resolveGeo(geography, extras = []) {
  if (geography !== 'random') return geography;
  const pool = extras.length ? [...ALL_GEOS, ...extras] : ALL_GEOS;
  return pick(pool);
}

// ─── Weighted adjective picker ─────────────────────────────────────────────────

/**
 * Pick an adjective with weighted probability based on geography.
 * Geography-matching adjectives get a bonus.
 *
 * @param {Object[]} adjectives
 * @param {string} geography
 * @returns {Object} Selected adjective object
 */
function pickWeightedAdjective(adjectives, geography) {
  const scored = adjectives.map(a => {
    let weight = 10;
    if (a.location.length > 0 && a.location.includes(geography)) {
      weight += 50;
    }
    return { ...a, finalWeight: weight };
  });

  const totalWeight = scored.reduce((sum, a) => sum + a.finalWeight, 0);
  let random = Math.random() * totalWeight;

  for (const item of scored) {
    random -= item.finalWeight;
    if (random <= 0) return item;
  }

  return scored[scored.length - 1];
}

// ─── Settlement names ──────────────────────────────────────────────────────────

// Geography-specific suffixes that make settlement names feel more like places.
// Used when generating a short stem + suffix rather than a full compound word.
const SETTLEMENT_SUFFIXES = {
  coastal:  ['port', 'haven', 'bay', 'cove', 'harbor', 'reach'],
  mountain: ['hold', 'peak', 'keep', 'forge', 'burg', 'gate'],
  forest:   ['wood', 'vale', 'glen', 'dale', 'glade', 'moor'],
  plains:   ['ford', 'wick', 'ton', 'stead', 'field', 'burgh'],
  swamp:    ['fen', 'mire', 'marsh', 'mere', 'bog', 'hollow'],
  desert:   ['oasis', 'crossing', 'post', 'well', 'gate', 'sands'],
};

/**
 * Generate a settlement name (city, town, village).
 *
 * 60% — full Markov word (Blackwood, Ironhaven…)
 * 40% — short Markov stem + geography suffix (Iron + port = Ironport)
 *
 * @param {Object} options
 * @returns {string}
 */
export function generateSettlementName(options = {}) {
  const { geography = 'random' } = options;
  const geo = resolveGeo(geography);

  const c = getLoadedChains();
  const chain = c?.surname?.human?.[geo] ?? c?.surname?.human?.plains;

  if (Math.random() < 0.6) {
    // Full compound word from chain
    return walkChain(chain, 6, 14);
  }

  // Short stem + geography suffix
  const stem = walkChain(chain, 3, 7);
  const suffixes = SETTLEMENT_SUFFIXES[geo] ?? SETTLEMENT_SUFFIXES.plains;
  return stem + pick(suffixes);
}

// ─── Landmark names ────────────────────────────────────────────────────────────

/**
 * Generate a landmark name (cave, forest, mountain, etc.)
 *
 * @param {Object} options
 * @returns {string}
 */
export function generateLandmarkName(options = {}) {
  const { type = 'mountain' } = options;

  const availableAdjectives = getAdjectivesForLandmark(type);
  const typeSuffix = landmarkTypes[type];
  const suffix = Array.isArray(typeSuffix) ? pick(typeSuffix) : typeSuffix;

  const patternRoll = Math.random();

  if (patternRoll < 0.6) {
    // 60% — Single adjective: "Lonely Mountain"
    const adjObj = pick(availableAdjectives);
    return `${adjObj.adj} ${suffix}`;
  } else {
    // 40% — Two adjectives from different categories: "Dark Misty Peak"
    const adjObj1 = pick(availableAdjectives);
    const differentCategory = availableAdjectives.filter(a => a.category !== adjObj1.category);
    const fallbackPool = availableAdjectives.filter(a => a.adj !== adjObj1.adj);
    const adjObj2Pool = differentCategory.length > 0 ? differentCategory : fallbackPool;

    if (adjObj2Pool.length === 0) return `${adjObj1.adj} ${suffix}`;

    return `${adjObj1.adj} ${pick(adjObj2Pool).adj} ${suffix}`;
  }
}

// ─── Tavern / Inn names ────────────────────────────────────────────────────────

/**
 * Generate a tavern/inn name.
 *
 * Styles: 'pattern' | 'owner' | 'random'
 * (The old 'adjective' style is folded into 'pattern'.)
 *
 * @param {Object} options
 * @returns {string}
 */
export function generateTavernName(options = {}) {
  const { geography = 'random', style = 'random' } = options;

  let nameStyle = style === 'adjective' ? 'pattern' : style;
  if (nameStyle === 'random') {
    nameStyle = Math.random() < 0.5 ? 'pattern' : 'owner';
  }

  const geo = resolveGeo(geography, ['neutral']);

  if (nameStyle === 'owner') {
    const race = pick(['human', 'dwarf', 'elf', 'halfling']);
    const gender = Math.random() < 0.5 ? 'Male' : 'Female';
    const ownerNameObj = generateCharacterName(null, { race, gender, geography: geo });
    const surname = ownerNameObj.name.split(' ')[1];
    const suffix = pick(tavernPatterns.suffixes);
    return `The ${surname} ${suffix}`;
  }

  // pattern — blend tavernPatterns.adjectives with geography-keyed landmark adjectives
  const useGeoAdj = Math.random() < 0.5;
  const adjective = useGeoAdj
    ? pick(getAdjectivesForLandmark('tavern', geo)).adj
    : pick(tavernPatterns.adjectives);
  const nounList = tavernPatterns.nouns[geo] || tavernPatterns.nouns.neutral;
  const noun = pick(nounList);
  const article = Math.random() < 0.9 ? 'The' : 'Ye';
  return `${article} ${adjective} ${noun}`;
}

// ─── Shop names ────────────────────────────────────────────────────────────────

/**
 * Generate a shop name.
 *
 * Styles: 'pattern' | 'owner' | 'random'
 * (The old 'adjective' style is folded into 'pattern'.)
 *
 * @param {Object} options
 * @returns {string}
 */
export function generateShopName(options = {}) {
  const { geography = 'random', style = 'random' } = options;

  let nameStyle = style === 'adjective' ? 'pattern' : style;
  if (nameStyle === 'random') {
    nameStyle = Math.random() < 0.5 ? 'pattern' : 'owner';
  }

  const geo = resolveGeo(geography, ['neutral']);

  if (nameStyle === 'owner') {
    const race = pick(['human', 'dwarf', 'elf', 'gnome', 'halfling']);
    const ownerNameObj = generateCharacterName(null, {
      race,
      gender: Math.random() < 0.5 ? 'Male' : 'Female',
      geography: geo
    });
    const firstName = ownerNameObj.name.split(' ')[0];
    const shopType = pick(shopPatterns.types);
    return `${firstName}'s ${shopType}`;
  }

  // pattern
  const roll = Math.random();

  if (roll < 0.4) {
    // "[Adjective] [Noun]" using geography-flavoured adjectives
    const adjObj = pick(getAdjectivesForLandmark('shop', geo));
    const shopType = pick(shopPatterns.types);
    const article = Math.random() < 0.9 ? 'The' : 'Ye';
    return `${article} ${adjObj.adj} ${shopType}`;
  } else if (roll < 0.7) {
    // "The [Adjective] [Noun]"
    const adjective = pick(shopPatterns.adjectives);
    const noun = pick(shopPatterns.nouns);
    const article = Math.random() < 0.9 ? 'The' : 'Ye';
    return `${article} ${adjective} ${noun}`;
  } else {
    // "[Noun] & [Noun]"
    const noun1 = pick(shopPatterns.nouns);
    let noun2 = pick(shopPatterns.nouns);
    let attempts = 0;
    while (noun2 === noun1 && shopPatterns.nouns.length > 1 && attempts < 10) {
      noun2 = pick(shopPatterns.nouns);
      attempts++;
    }
    return `${noun1} & ${noun2}`;
  }
}

// ─── Temple names ──────────────────────────────────────────────────────────────

/**
 * Generate a temple/shrine name.
 *
 * @param {Object} options
 * @returns {string}
 */
export function generateTempleName(options = {}) {
  const { deityName = null } = options;
  const type = pick(templePatterns.types);
  if (deityName) return `${type} of ${deityName}`;
  return `${type} of ${pick(templePatterns.concepts)}`;
}

// ─── Building / Dungeon names ──────────────────────────────────────────────────

/**
 * Generate a building/dungeon name with geography-weighted adjectives.
 * 60% single adjective, 40% two adjectives from different categories.
 *
 * @param {string} buildingType
 * @param {Object} options
 * @returns {string}
 */
function generateBuildingName(buildingType, options = {}) {
  const geo = resolveGeo(options.geography ?? 'random', ['underground', 'neutral']);

  const availableAdjectives = getAdjectivesForLandmark(buildingType, geo);
  const types = buildingType === 'dungeon' ? dungeonPatterns.types : buildingPatterns[buildingType].types;
  const type = pick(types);

  const patternRoll = Math.random();

  if (patternRoll < 0.6) {
    const adjObj = pickWeightedAdjective(availableAdjectives, geo);
    return `The ${adjObj.adj} ${type}`;
  } else {
    const locationAdjs = availableAdjectives.filter(a => a.location.length > 0 && a.location.includes(geo));
    const adjObj1 = locationAdjs.length > 0
      ? pick(locationAdjs)
      : pickWeightedAdjective(availableAdjectives, geo);
    const differentCategory = availableAdjectives.filter(a => a.category !== adjObj1.category && a.adj !== adjObj1.adj);
    const fallbackPool = availableAdjectives.filter(a => a.adj !== adjObj1.adj);
    const adjObj2Pool = differentCategory.length > 0 ? differentCategory : fallbackPool;

    if (adjObj2Pool.length === 0) return `The ${adjObj1.adj} ${type}`;

    return `The ${adjObj1.adj} ${pickWeightedAdjective(adjObj2Pool, geo).adj} ${type}`;
  }
}

export function generateTowerName(options = {})   { return generateBuildingName('tower',   options); }
export function generateCastleName(options = {})  { return generateBuildingName('castle',  options); }
export function generateLibraryName(options = {}) { return generateBuildingName('library', options); }
export function generateDungeonName(options = {}) { return generateBuildingName('dungeon', options); }

// ─── Road names ────────────────────────────────────────────────────────────────

/**
 * Generate a road/path name.
 *
 * @param {Object} options
 * @returns {string}
 */
export function generateRoadName(options = {}) {
  if (Math.random() < 0.5) {
    return `${pick(roadPatterns.directions)} ${pick(roadPatterns.types)}`;
  }
  return `The ${pick(roadPatterns.adjectives)} ${pick(roadPatterns.types)}`;
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate a place name based on type.
 *
 * @param {Object} options
 * @returns {{ name: string, resolvedType: string }}
 */
export function generatePlaceName(options = {}) {
  let { placeType = 'city', ...restOptions } = options;

  if (placeType === 'random-settlements') {
    placeType = pick(['city', 'town', 'village']);
  } else if (placeType === 'random-landmarks') {
    placeType = pick(['bridge', 'cave', 'forest', 'river', 'lake', 'mountain', 'road', 'graveyard', 'ruins']);
  } else if (placeType === 'random-buildings') {
    placeType = pick(['tavern', 'shop', 'temple', 'tower', 'castle', 'library', 'dungeon']);
  }

  let name;

  switch (placeType) {
    case 'city':
    case 'town':
    case 'village':
      name = generateSettlementName({ type: placeType, ...restOptions });
      break;
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
    case 'tavern':  name = generateTavernName(restOptions);  break;
    case 'shop':    name = generateShopName(restOptions);    break;
    case 'temple':  name = generateTempleName(restOptions);  break;
    case 'tower':   name = generateTowerName(restOptions);   break;
    case 'castle':  name = generateCastleName(restOptions);  break;
    case 'library': name = generateLibraryName(restOptions); break;
    case 'dungeon': name = generateDungeonName(restOptions); break;
    case 'road':    name = generateRoadName(restOptions);    break;
    default:        name = 'Unknown Place';
  }

  return { name, resolvedType: placeType };
}

function generateSafePlaceName(options = {}) {
  let attempts = 0;
  let result;

  do {
    result = generatePlaceName(options);
    attempts++;
  } while (isBlacklisted(result.name, PLACE_BLACKLIST) && attempts < 10);

  return {
    name: result.name,
    meta: {
      placeType: result.resolvedType,
      geography: options.geography || 'random'
    }
  };
}

/**
 * Generate multiple place names.
 *
 * @param {Object} options
 * @param {number} count
 * @returns {Object[]}
 */
export function generatePlaceNames(options = {}, count = 1) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateSafePlaceName(options));
  }
  return result;
}
