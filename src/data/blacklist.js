/**
 * Shared blacklist for name generation
 * Filters out inappropriate, pop culture, or awkward name combinations
 */

export const NAME_BLACKLIST = [
  // WoW / gaming references
  'ironforge',
  'ironhammer',
  'thunderaxe',
  'stormhammer',

  // Add more character name blacklists as needed
];

export const PLACE_BLACKLIST = [
  // Pop culture references (verified possible with current syllables)
  'ironforge',      // WoW - Iron + forge (mountain city)
  'baywatch',       // TV show - Bay + watch (coastal city)

  // Redundant/awkward combinations (verified possible)
  'clifffall',      // Cliff + fall (sounds awkward)
  'silverforest',   // Silver + forest (redundant in forest context)

  // Add more as problematic combinations are discovered
];

/**
 * Check if a name contains blacklisted terms
 *
 * @param {string} name - Name to check
 * @param {string[]} blacklist - Blacklist array to check against
 * @returns {boolean} True if blacklisted
 */
export function isBlacklisted(name, blacklist) {
  const normalized = name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '').replace(/the/g, '');
  return blacklist.some(banned => normalized.includes(banned));
}
