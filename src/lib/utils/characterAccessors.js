/**
 * Character accessor helpers to abstract direct property access.
 * Prepares codebase for multi-class/dual-class support by encapsulating
 * how we access character class-related properties.
 *
 * Future: These functions will handle multi-class characters by returning
 * primary class, arrays of classes, or computing effective values.
 */

/**
 * Get the class group for a character (warrior, wizard, priest, rogue).
 * Future: Will handle multi-class characters by returning primary class or array.
 *
 * @param {Object} character - Character object
 * @returns {string|null} Class group ('warrior', 'wizard', 'priest', 'rogue')
 */
export function getClassGroup(character) {
  return character.cls?.group || null;
}

/**
 * Get the class key for a character (fighter, mage, cleric, etc.).
 * Future: Will handle multi-class characters.
 *
 * @param {Object} character - Character object
 * @returns {string|null} Class key
 */
export function getClassKey(character) {
  return character.classKey || null;
}

/**
 * Check if character is a warrior class (fighter, paladin, ranger).
 *
 * @param {Object} character - Character object
 * @returns {boolean} True if warrior class
 */
export function isWarrior(character) {
  return getClassGroup(character) === 'warrior';
}

/**
 * Check if character is a wizard class (mage, specialist).
 *
 * @param {Object} character - Character object
 * @returns {boolean} True if wizard class
 */
export function isWizard(character) {
  return getClassGroup(character) === 'wizard';
}

/**
 * Check if character is a priest class (cleric, druid).
 *
 * @param {Object} character - Character object
 * @returns {boolean} True if priest class
 */
export function isPriest(character) {
  return getClassGroup(character) === 'priest';
}

/**
 * Check if character is a rogue class (thief, bard).
 *
 * @param {Object} character - Character object
 * @returns {boolean} True if rogue class
 */
export function isRogue(character) {
  return getClassGroup(character) === 'rogue';
}

/**
 * Get character level (abstraction for future multi-class support).
 * Future: Will handle multi-class level calculations.
 *
 * @param {Object} character - Character object
 * @returns {number} Character level (defaults to 1)
 */
export function getCharacterLevel(character) {
  return character.level || 1;
}

/**
 * Get class display name.
 * Future: Will format multi-class names (e.g., "Fighter/Mage").
 *
 * @param {Object} character - Character object
 * @returns {string} Class display name
 */
export function getClassName(character) {
  return character.cls?.name || 'Unknown';
}

/**
 * Get hit die type for character's class.
 * Future: Will handle multi-class HP averaging.
 *
 * @param {Object} character - Character object
 * @returns {number} Hit die size (4, 6, 8, 10)
 */
export function getHitDie(character) {
  return character.cls?.hitDie || 6;
}
