/**
 * Markov chain name generator for AD&D 2E characters and NPCs.
 *
 * Drop-in replacement for the syllable-based generator.
 * Public API is identical — callers require no changes.
 *
 * First names: chains.first[race][gender]     (racial phonetic identity)
 * Surnames:    chains.surname[race]            (non-human races)
 *              chains.surname.human[geography] (humans vary by region)
 */

import { NAME_BLACKLIST, isBlacklisted } from '../../data/blacklist.js';

// ─── Lazy chain loading ────────────────────────────────────────────────────────

let _chains = null;

/**
 * Load Markov chains from the data file (once, then cached).
 * Call this on component mount so chains are ready before the user clicks Generate.
 */
export async function initNameGen() {
  if (_chains) return;
  const mod = await import('../../data/markovChains.js');
  _chains = mod.chains;
}

/** Internal accessor — throws if chains not yet loaded. */
function chains() {
  if (!_chains) throw new Error('[nameGen] Chains not loaded — call initNameGen() first');
  return _chains;
}

/** Expose loaded chains for other generators (e.g. placeNameGenerator). */
export function getLoadedChains() { return _chains; }

// ─── Constants ────────────────────────────────────────────────────────────────

const FIRST_MIN = 4;
const FIRST_MAX = 12;
const SURNAME_MIN = 4;
const SURNAME_MAX = 14;
const MAX_WALK_STEPS = 50;  // hard cap — prevents infinite loops
const MAX_ATTEMPTS = 20;    // retries if output is too short

const ALL_RACES = ['human', 'elf', 'dwarf', 'gnome', 'halfling', 'halfElf'];
const ALL_GEOS  = ['coastal', 'mountain', 'forest', 'plains', 'desert', 'swamp'];
// ─── Core Walker ──────────────────────────────────────────────────────────────

/**
 * Weighted random pick from a frequency object.
 * e.g. { "a": 5, "b": 2, "END": 1 } → picks "a" ~5/8 of the time
 *
 * @param {Object.<string, number>} obj
 * @returns {string}
 */
function pickWeightedKey(obj) {
  const total = Object.values(obj).reduce((sum, w) => sum + w, 0);
  let rand = Math.random() * total;
  for (const [key, weight] of Object.entries(obj)) {
    rand -= weight;
    if (rand <= 0) return key;
  }
  // Fallback — floating point edge case
  return Object.keys(obj)[Object.keys(obj).length - 1];
}

/**
 * Walk a Markov chain to produce a single capitalized name string.
 *
 * @param {{ starters: Object, transitions: Object }} chain
 * @param {number} minLen
 * @param {number} maxLen
 * @returns {string}
 */
export function walkChain(chain, minLen = FIRST_MIN, maxLen = FIRST_MAX) {
  let best = '';

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let result = pickWeightedKey(chain.starters);
    let gram = result;

    for (let step = 0; step < MAX_WALK_STEPS; step++) {
      const nexts = chain.transitions[gram];
      if (!nexts) break;

      const next = pickWeightedKey(nexts);
      if (next === 'END') break;
      if (result.length >= maxLen) break;

      result += next;
      gram = result.slice(-2);
    }

    if (result.length >= minLen) {
      return capitalize(result);
    }

    // Keep the longest result seen so far as fallback
    if (result.length > best.length) best = result;
  }

  return capitalize(best || 'Unnamed');
}

/**
 * Capitalize first letter, lowercase the rest.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── Chain Lookup ─────────────────────────────────────────────────────────────

/**
 * Look up a first-name chain, with fallback to human male.
 * @param {string} race
 * @param {string} gender  'male' | 'female'
 * @returns {Object} chain
 */
function getFirstChain(race, gender) {
  const c = chains();
  const chain = c.first?.[race]?.[gender];
  if (chain) return chain;

  console.warn(`[nameGen] Missing first chain for ${race}/${gender} — falling back to human/male`);
  return c.first.human.male;
}

/**
 * Look up a surname chain, with fallback to human/plains.
 * @param {string} race
 * @param {string} geography
 * @returns {Object} chain
 */
function getSurnameChain(race, geography) {
  const c = chains();
  if (race === 'human' || race === 'halfElf') {
    const chain = c.surname?.human?.[geography];
    if (chain) return chain;
    console.warn(`[nameGen] Missing surname chain for human/${geography} — falling back to plains`);
    return c.surname.human.plains;
  }

  const chain = c.surname?.[race];
  if (chain) return chain;

  console.warn(`[nameGen] Missing surname chain for ${race} — falling back to human/plains`);
  return c.surname.human.plains;
}

// ─── Style Application ────────────────────────────────────────────────────────

/**
 * Format a raw chain-generated surname based on naming style, race, and social class.
 *
 * @param {string} rawSurname   - Output of walkChain on a surname chain
 * @param {string} race
 * @param {string} gender       'Male' | 'Female'
 * @param {string} style  'standard' | 'patronymic' | 'lineage' | 'clan' | 'house'
 * @returns {string}
 */
function applyStyle(rawSurname, race, gender, style) {
  switch (style) {
    case 'patronymic':
      return buildPatronymic(race, gender);

    case 'lineage':
    case 'clan':
    case 'house':
      if (race === 'dwarf')                      return `of Clan ${rawSurname}`;
      if (race === 'elf' || race === 'halfElf') {
        const prefix = Math.random() < 0.5 ? "Tel'" : "Quel'";
        return `${prefix}${rawSurname}`;
      }
      if (race === 'human')                      return `of House ${rawSurname}`;
      // Other races fall through to standard
      return rawSurname;

    case 'standard':
    default:
      return rawSurname;
  }
}

/**
 * Generate a patronymic surname (father's first name + race/gender suffix).
 * @param {string} race
 * @param {string} gender  'Male' | 'Female'
 * @returns {string}
 */
function buildPatronymic(race, gender) {
  const fatherChain = getFirstChain(race, 'male');
  const fatherName = walkChain(fatherChain, FIRST_MIN, FIRST_MAX);
  const isFemale = gender === 'Female';

  switch (race) {
    case 'dwarf':
      return isFemale ? `${fatherName}dottir` : `${fatherName}son`;
    case 'elf':
      return isFemale ? `${fatherName}iel` : `${fatherName}ion`;
    case 'gnome':
      return isFemale ? `${fatherName}gin` : `${fatherName}kin`;
    case 'halfling':
      return isFemale ? `${fatherName}daughter` : `${fatherName}son`;
    case 'human':
    default: {
      const maleSuffixes = ['son', 'sen', 's'];
      const femaleSuffixes = ['daughter', 'dottir'];
      const suffixes = isFemale ? femaleSuffixes : maleSuffixes;
      return fatherName + suffixes[Math.floor(Math.random() * suffixes.length)];
    }
  }
}

// ─── Style Resolution ─────────────────────────────────────────────────────────

const LINEAGE_RACES = new Set(['human', 'elf', 'dwarf', 'halfElf']);

/**
 * Pick a random naming style, respecting which races support lineage names.
 * @param {string} race
 * @returns {string}
 */
function resolveStyle(race) {
  const available = LINEAGE_RACES.has(race)
    ? ['standard', 'patronymic', 'lineage']
    : ['standard', 'patronymic'];
  return available[Math.floor(Math.random() * available.length)];
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a single character name.
 * The `_names` parameter is kept for backward compatibility but is not used —
 * all data now comes from the baked Markov chains.
 *
 * @param {Object} _names     - Ignored (legacy syllable data)
 * @param {Object} options
 * @returns {{ name: string, meta: Object }}
 */
export function generateCharacterName(_names, options = {}) {
  let {
    race       = 'human',
    gender     = 'Male',
    geography  = 'random',
    style      = 'random',
  } = options;

  // Normalize kebab-case keys from form emitters
  if (race === 'half-elf') race = 'halfElf';

  // Resolve randoms
  if (race        === 'random') race        = ALL_RACES[Math.floor(Math.random() * ALL_RACES.length)];
  if (gender      === 'random') gender      = Math.random() < 0.5 ? 'Male' : 'Female';
  if (geography === 'random') geography = ALL_GEOS[Math.floor(Math.random() * ALL_GEOS.length)];
  if (style === 'random') style = resolveStyle(race);

  // Half-elf: resolve once and use consistently for both first name and applyStyle
  const nameRace = race === 'halfElf'
    ? (Math.random() < 0.5 ? 'elf' : 'human')
    : race;

  const genderKey = gender.toLowerCase();

  // Generate first name
  const firstChain = getFirstChain(nameRace, genderKey);
  const firstName = walkChain(firstChain, FIRST_MIN, FIRST_MAX);

  // Generate raw surname from chain
  const surnameChain = getSurnameChain(race, geography);
  const rawSurname = walkChain(surnameChain, SURNAME_MIN, SURNAME_MAX);

  // Apply style formatting (pass nameRace so half-elf uses same resolved race)
  const surname = applyStyle(rawSurname, nameRace, gender, style);

  const geoUsed = race === 'human' || race === 'halfElf';

  return {
    name: `${firstName} ${surname}`,
    meta: { race, gender, geography: geoUsed ? geography : null, style }
  };
}

/**
 * Generate multiple character names.
 *
 * @param {Object} _names   - Ignored (legacy)
 * @param {Object} options
 * @param {number} count
 * @returns {Array<{ name: string, meta: Object }>}
 */
export function generateCharacterNames(_names, options = {}, count = 1) {
  const results = [];
  let attempts = 0;

  while (results.length < count && attempts < count * 10) {
    const nameObj = generateCharacterName(_names, options);
    attempts++;

    if (!isBlacklisted(nameObj.name, NAME_BLACKLIST)) {
      results.push(nameObj);
    }
  }

  return results;
}
