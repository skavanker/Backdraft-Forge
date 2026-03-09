/**
 * Shared blacklist for name generation.
 * Filters out inappropriate, pop culture, or IP-infringing name combinations.
 *
 * NOTE: Tolkien names are present in the training data (halfling, elf, dwarf)
 * because they informed the phonaesthetic model. These blacklist entries
 * prevent exact Tolkien names appearing in output without requiring a retrain.
 */

export const NAME_BLACKLIST = [
  // ── Tolkien halfling (hobbit) first names ──────────────────────────────────
  'bilbo', 'frodo', 'samwise', 'pippin', 'peregrin', 'meriadoc', 'hamfast',
  'drogo', 'fosco', 'lotho', 'bingo', 'bungo', 'folco', 'fatty',
  'hildibrand', 'largo', 'marcho', 'merimac', 'mosco', 'odo', 'odovacar',
  'paladin', 'polo', 'posco', 'rorimac', 'saradoc',

  // ── Tolkien halfling surnames ──────────────────────────────────────────────
  'baggins', 'took', 'brandybuck', 'gamgee', 'proudfoot',
  'hornblower', 'goodbody', 'bolger', 'longbottom',

  // ── Tolkien elf first names (male) ────────────────────────────────────────
  'legolas', 'elrond', 'glorfindel', 'thranduil', 'celeborn',
  'haldir', 'maedhros', 'fingon', 'orodreth',

  // ── Tolkien elf first names (female) ──────────────────────────────────────
  'galadriel', 'arwen', 'luthien', 'celebrian', 'idril',
  'varda', 'melian', 'morwen', 'nerdanel', 'nienor', 'nimrodel',

  // ── Tolkien dwarf first names (The Hobbit company) ────────────────────────
  'thorin', 'balin', 'dwalin', 'fili', 'kili', 'dori', 'nori', 'ori',
  'oin', 'gloin', 'bifur', 'bofur', 'bombur', 'gimli',
  'dain', 'thrain', 'thror',

  // ── Famous D&D NPC references ─────────────────────────────────────────────
  'battlehammer',

  // ── WoW / gaming references ───────────────────────────────────────────────
  'ironforge', 'ironhammer', 'thunderaxe', 'stormhammer',
];

export const PLACE_BLACKLIST = [
  // Pop culture references
  'ironforge',    // WoW
  'baywatch',     // TV show

  // Redundant/awkward combinations
  'clifffall',
  'silverforest',
];

/**
 * Check if a name contains blacklisted terms.
 * Strips leading articles and whitespace before matching,
 * but does NOT strip 'the' from inside words (e.g. "Greythorne" stays intact).
 *
 * @param {string} name
 * @param {string[]} blacklist
 * @returns {boolean}
 */
export function isBlacklisted(name, blacklist) {
  const normalized = name
    .toLowerCase()
    .replace(/^the\s+/i, '')   // strip leading article only
    .replace(/\s+/g, '')       // collapse spaces
    .replace(/'/g, '');        // strip apostrophes

  return blacklist.some(banned =>
    normalized.includes(banned.toLowerCase().replace(/\s+/g, ''))
  );
}
