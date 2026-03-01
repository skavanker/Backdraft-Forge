/**
 * Weighted name generation for AD&D 2E characters and NPCs.
 *
 * Generates context-aware names using weighted syllable selection based on:
 * - Class (warrior, scholar, rogue, neutral)
 * - Settlement type (urban, rural, nomadic)
 * - Geography (coastal, mountain, forest, plains, swamp, desert)
 * - Social class (noble, wealthy, common, poor)
 * - Naming style (standard, patronymic, clan, house)
 */

import { NAME_BLACKLIST, isBlacklisted } from '../../data/blacklist.js';

/**
 * Class categories for weighting
 */
const classCategories = {
  warrior: ['fighter', 'ranger', 'paladin', 'barbarian'],
  scholar: ['wizard', 'cleric', 'druid'],
  rogue: ['thief', 'bard', 'assassin'],
  neutral: ['monk']
};

/**
 * Settlement type categories for origin weighting
 */
const settlementCategories = {
  urban: ['city'],
  moderate: ['town'],
  rural: ['village'],
  nomadic: ['nomadic']
};

/**
 * Dwarf clan names (for clan-style naming)
 */
const dwarfClans = [
  'Ironforge', 'Stonehelm', 'Battlehammer', 'Firebeard', 'Deepdelve',
  'Thunderaxe', 'Bronzefist', 'Steelshield', 'Granitefoot', 'Hammerfell',
  'Oreseeker', 'Goldvein', 'Mithrilhand', 'Stonefist', 'Anviltop'
];

/**
 * Elf house names (for house-style naming)
 */
const elfHouses = [
  'Aerandir', 'Celebrian', 'Elenath', 'Galadhrim', 'Mithlond',
  'Silmarien', 'Laurelin', 'Calandria', 'Thalion', 'Anarion',
  'Miriel', 'Eldamar', 'Valandil', 'Earendil', 'Finwarin'
];

/**
 * Human noble house names (for house-style naming)
 */
const humanHouses = [
  'Blackwood', 'Greystone', 'Redmane', 'Whitehall', 'Goldenthorn',
  'Silveroak', 'Ironhold', 'Ravenwood', 'Dragonfall', 'Lionheart',
  'Stormcrest', 'Winterbourne', 'Summervale', 'Thornbury', 'Ashford'
];

/**
 * Get class category from specific class name
 */
function getClassCategory(className) {
  if (!className || className === 'random') return 'neutral';

  const lower = className.toLowerCase();
  for (const [category, classes] of Object.entries(classCategories)) {
    if (classes.includes(lower)) {
      return category;
    }
  }
  return 'neutral';
}

/**
 * Get origin category from settlement type
 */
function getOriginCategory(settlement) {
  if (!settlement || settlement === 'random') return 'neutral';

  const lower = settlement.toLowerCase();
  for (const [category, types] of Object.entries(settlementCategories)) {
    if (types.includes(lower)) {
      return category;
    }
  }
  return 'neutral';
}

/**
 * Select a syllable from an array with weighted probability based on context.
 *
 * @param {Array} syllables - Array of syllable objects or strings
 * @param {Object} context - Context for weighting (class, origin, geography, social)
 * @returns {string} Selected syllable
 */
function selectWeightedSyllable(syllables, context = {}) {
  // Handle legacy format (array of strings)
  if (typeof syllables[0] === 'string') {
    return syllables[Math.floor(Math.random() * syllables.length)];
  }

  const { class: cls, origin, geography, social } = context;

  // Calculate weight for each syllable
  const scored = syllables.map(s => {
    let weight = s.weight || 10; // Base weight

    // Class match bonus
    if (s.class) {
      if (s.class.includes(cls)) {
        weight += 70;
      }
      if (s.class.includes('neutral')) {
        weight += 20;
      }
    }

    // Origin match bonus (for first names)
    if (s.origin) {
      if (s.origin.includes(origin)) {
        weight += 50;
      }
      if (s.origin.includes('neutral')) {
        weight += 20;
      }
    }

    // Geography match bonus (for surnames)
    if (s.geo) {
      if (s.geo.includes(geography)) {
        weight += 50;
      }
      if (s.geo.includes('neutral')) {
        weight += 20;
      }
    }

    // Social class match bonus
    if (s.social) {
      if (s.social.includes(social)) {
        weight += 70;
      }
      if (s.social.includes('neutral')) {
        weight += 20;
      }
    }

    return { ...s, finalWeight: weight };
  });

  // Weighted random selection
  const totalWeight = scored.reduce((sum, s) => sum + s.finalWeight, 0);
  let random = Math.random() * totalWeight;

  for (const item of scored) {
    random -= item.finalWeight;
    if (random <= 0) {
      return item.syl;
    }
  }

  // Fallback to last item
  return scored[scored.length - 1].syl;
}

/**
 * Generate a patronymic surname (father's name + suffix).
 *
 * @param {Object} names - The names data object
 * @param {string} race - Race key
 * @param {string} gender - Gender
 * @param {Object} context - Weighting context
 * @returns {string} Patronymic surname
 */
function generatePatronymic(names, race, gender, context) {
  // Generate father's first name (always Male for patronymics)
  const fatherData = names[race]?.['Male'];

  if (!fatherData) return '';

  const prefix = selectWeightedSyllable(fatherData.first.prefix, context);
  const middle = fatherData.first.middle && Math.random() < 0.2
    ? selectWeightedSyllable(fatherData.first.middle, context)
    : '';
  const suffix = selectWeightedSyllable(fatherData.first.suffix, context);
  const fatherName = prefix + middle + suffix;

  // Race-specific patronymic patterns
  if (race === 'dwarf') {
    // Norse-style: -son, -dottir
    return gender === 'Male' ? `${fatherName}son` : `${fatherName}dottir`;
  } else if (race === 'elf' || race === 'halfElf') {
    // Elven style: prefix with "child of" descriptor
    return gender === 'Male' ? `${fatherName}ion` : `${fatherName}iel`;
  } else if (race === 'human') {
    // English-style: -son for both (or variant endings)
    const suffixes = gender === 'Male'
      ? ['son', 'sen', 's']
      : ['daughter', 'sdottir', 'dottir'];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${fatherName}${randomSuffix}`;
  } else if (race === 'gnome') {
    // Gnomish: -kin, -gin
    return gender === 'Male' ? `${fatherName}kin` : `${fatherName}gin`;
  } else if (race === 'halfling') {
    // Halfling: simple -son/-daughter
    return gender === 'Male' ? `${fatherName}son` : `${fatherName}daughter`;
  }

  // Default fallback
  return gender === 'Male' ? `${fatherName}son` : `${fatherName}daughter`;
}

/**
 * Generate a clan-style surname.
 *
 * @param {string} race - Race key
 * @returns {string} Clan surname
 */
function generateClanName(race) {
  if (race === 'dwarf') {
    const clan = dwarfClans[Math.floor(Math.random() * dwarfClans.length)];
    return `of Clan ${clan}`;
  }
  // Other races don't use clan names by default
  return '';
}

/**
 * Generate a house-style surname.
 *
 * @param {string} race - Race key
 * @returns {string} House surname
 */
function generateHouseName(race) {
  let houses;

  if (race === 'elf' || race === 'halfElf') {
    houses = elfHouses;
    const house = houses[Math.floor(Math.random() * houses.length)];
    // Use elvish prefix (Tel' = house of, Quel' = exalted/high)
    const prefix = Math.random() < 0.5 ? 'Tel\'' : 'Quel\'';
    return `${prefix}${house}`;
  } else if (race === 'human') {
    houses = humanHouses;
    const house = houses[Math.floor(Math.random() * houses.length)];
    return `of House ${house}`;
  } else {
    // Other races don't typically use house names
    return '';
  }
}

/**
 * Generate a character name with context-aware weighting.
 *
 * @param {Object} names - The names data object
 * @param {Object} options - Generation options
 * @returns {string} Generated name
 */
export function generateCharacterName(names, options = {}) {
  let {
    race = 'human',
    gender = 'Male',
    class: cls = 'random',
    settlement = 'random',
    geography = 'random',
    socialClass = 'random',
    style = 'standard'
  } = options;

  // Handle random race
  if (race === 'random') {
    const availableRaces = ['human', 'elf', 'dwarf', 'gnome', 'halfling', 'halfElf'];
    race = availableRaces[Math.floor(Math.random() * availableRaces.length)];
  }

  // Handle random gender
  if (gender === 'random') {
    gender = Math.random() < 0.5 ? 'Male' : 'Female';
  }

  // Handle half-elf (use elf or human name data, but preserve race for style selection)
  let nameRace = race;
  if (race === 'halfElf') {
    nameRace = Math.random() < 0.5 ? 'elf' : 'human';
  }

  // Handle random social class
  if (socialClass === 'random') {
    const classes = ['noble', 'wealthy', 'common', 'poor'];
    socialClass = classes[Math.floor(Math.random() * classes.length)];
  }

  // Handle random style (pick from styles available for this race)
  // Social class influences style selection
  if (style === 'random') {
    const availableStyles = ['standard', 'patronymic'];

    // Only nobles/wealthy can have clan names (poor/common characters don't have clan lineage)
    if (race === 'dwarf' && socialClass !== 'poor' && socialClass !== 'common') {
      availableStyles.push('clan');
    }

    // Only nobles/wealthy can have house names (poor/common characters don't have noble houses)
    if ((race === 'elf' || race === 'human' || race === 'halfElf') &&
        socialClass !== 'poor' && socialClass !== 'common') {
      availableStyles.push('house');
    }

    // Weight style selection by social class
    const weights = availableStyles.map(s => {
      if (s === 'house' && (socialClass === 'noble' || socialClass === 'wealthy')) return 2;
      if (s === 'clan' && (socialClass === 'noble' || socialClass === 'wealthy')) return 2;
      if (s === 'patronymic' && (socialClass === 'poor' || socialClass === 'common')) return 2;
      return 1;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < availableStyles.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        style = availableStyles[i];
        break;
      }
    }
  }

  const raceData = names[nameRace]?.[gender];
  if (!raceData) {
    // Fallback for missing data with details
    console.error(`Missing name data for race: ${nameRace}, gender: ${gender}`);
    return `[Missing ${nameRace} ${gender} data]`;
  }

  // Get shared surname data (at race level, not gender level)
  const surnameData = names[nameRace]?.surname || raceData.surname;
  if (!surnameData) {
    console.error(`Missing surname data for race: ${nameRace}`);
    return `[Missing ${nameRace} surname data]`;
  }

  // Get categories for weighting
  const classCategory = getClassCategory(cls);
  const origin = getOriginCategory(settlement);

  // Generate first name
  const context = { class: classCategory, origin, geography, social: socialClass };
  const prefix = selectWeightedSyllable(raceData.first.prefix, context);
  const middle = raceData.first.middle && Math.random() < 0.3
    ? selectWeightedSyllable(raceData.first.middle, context)
    : '';
  const suffix = selectWeightedSyllable(raceData.first.suffix, context);

  const firstName = prefix + middle + suffix;

  // Generate surname based on naming style
  let surname;

  // House/Clan names imply noble lineage - use noble weighting for surnames
  const surnameContext = (style === 'house' || style === 'clan')
    ? { ...context, social: 'noble' }
    : context;

  switch (style) {
    case 'patronymic':
      surname = generatePatronymic(names, race, gender, surnameContext);
      break;

    case 'clan':
      surname = generateClanName(race);
      // Fallback to standard if race doesn't use clans
      if (!surname) {
        const surnamePrefix = selectWeightedSyllable(surnameData.prefix, surnameContext);
        const surnameSuffix = selectWeightedSyllable(surnameData.suffix, surnameContext);
        surname = surnamePrefix + surnameSuffix;
      }
      break;

    case 'house':
      surname = generateHouseName(race);
      // Fallback to standard if race doesn't use houses
      if (!surname) {
        const surnamePrefix = selectWeightedSyllable(surnameData.prefix, surnameContext);
        const surnameSuffix = selectWeightedSyllable(surnameData.suffix, surnameContext);
        surname = surnamePrefix + surnameSuffix;
      }
      break;

    case 'standard':
    default:
      const surnamePrefix = selectWeightedSyllable(surnameData.prefix, surnameContext);

      // Poor characters sometimes get single-word surnames (bastard-style)
      if (socialClass === 'poor' && Math.random() < 0.4) {
        surname = surnamePrefix; // Just "Stone", "Snow", "Waters"
      } else {
        const surnameSuffix = selectWeightedSyllable(surnameData.suffix, surnameContext);
        surname = surnamePrefix + surnameSuffix; // "Stonefield", "Snowhaven"
      }
      break;
  }

  const fullName = `${firstName} ${surname}`;

  // Return object with name and metadata for display
  return {
    name: fullName,
    meta: {
      race,
      gender,
      class: classCategory, // Show the resolved class category used for generation
      settlement,
      geography,
      socialClass,
      style
    }
  };
}

/**
 * Generate a safe character name (not blacklisted).
 *
 * @param {Object} names - The names data object
 * @param {Object} options - Same as generateCharacterName
 * @returns {string} Generated safe name
 */
function generateSafeCharacterName(names, options = {}) {
  let attempts = 0;
  let nameObj;

  do {
    nameObj = generateCharacterName(names, options);
    attempts++;
  } while (isBlacklisted(nameObj.name, NAME_BLACKLIST) && attempts < 10);

  // If still blacklisted after 10 attempts, return anyway
  // (extremely unlikely with our syllable pool)
  return nameObj;
}

/**
 * Generate multiple character names.
 *
 * @param {Object} names - The names data object
 * @param {Object} options - Same as generateCharacterName
 * @param {number} count - Number of names to generate
 * @returns {string[]} Array of generated names
 */
export function generateCharacterNames(names, options = {}, count = 1) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(generateSafeCharacterName(names, options));
  }
  return result;
}
