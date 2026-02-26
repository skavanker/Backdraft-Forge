/**
 * AD&D 2nd Edition Spell Data — Index / Helper Module
 * Re-exports from wizardSpells.js and priestSpells.js
 * Maintains backward-compatible exports
 */

// Re-export wizard spells and school data
export { wizardSpells, schoolOpposition } from './wizardSpells.js';

// Re-export priest spells, sphere access, and helpers
export { priestSpells, sphereAccess, getPriestSpellsForClass, groupByLevel } from './priestSpells.js';

// Backward-compatible derived exports
import { priestSpells } from './priestSpells.js';

/** Cleric-accessible spells (legacy compat — all priest spells, since filtering is done at selection time) */
export const clericSpells = priestSpells;

/** Druid-accessible spells (legacy compat — all priest spells) */
export const druidSpells = priestSpells;

// Re-export wizard helpers
import { wizardSpells, schoolOpposition } from './wizardSpells.js';

/**
 * Get available wizard spells (filtered by school if specialist, optionally by max level)
 * @param {string|null} schoolKey - Specialist school key, or null for mage
 * @param {number} [maxSpellLevel] - Maximum spell level to include (default: all)
 */
export function getAvailableWizardSpells(schoolKey = null, maxSpellLevel = 9) {
  let spells = wizardSpells.filter(s => s.level <= maxSpellLevel);
  if (schoolKey) {
    const opposition = schoolOpposition[schoolKey] || [];
    spells = spells.filter(spell => !opposition.includes(spell.school));
  }
  return spells;
}

/**
 * Get wizard spells at a specific level
 */
export function getWizardSpellsByLevel(spellLevel, schoolKey = null) {
  return getAvailableWizardSpells(schoolKey, spellLevel).filter(s => s.level === spellLevel);
}

/**
 * Get cleric spells at a specific level (legacy — now returns sphere-unfiltered list)
 */
export function getClericSpellsByLevel(spellLevel) {
  return priestSpells.filter(s => s.level <= spellLevel);
}

/**
 * Get druid spells at a specific level (legacy — now returns sphere-unfiltered list)
 */
export function getDruidSpellsByLevel(spellLevel) {
  return priestSpells.filter(s => s.level <= spellLevel);
}

/**
 * Get spells for a class filtered by maximum spell level
 * @param {string} classKey
 * @param {number} maxSpellLevel
 * @param {string|null} schoolKey - For specialists
 */
export function getSpellsByClassAndLevel(classKey, maxSpellLevel = 9, schoolKey = null) {
  switch (classKey) {
    case 'mage':
    case 'specialist':
    case 'bard':
      return getAvailableWizardSpells(schoolKey, maxSpellLevel);
    case 'cleric':
    case 'paladin':
      return priestSpells.filter(s => s.level <= maxSpellLevel);
    case 'druid':
    case 'ranger':
      return priestSpells.filter(s => s.level <= maxSpellLevel);
    default:
      return [];
  }
}

/**
 * Get number of starting spells for a wizard
 * Based on INT and class
 */
export function getStartingSpellCount(intelligence) {
  if (intelligence >= 19) return 9;
  if (intelligence >= 18) return 7;
  if (intelligence >= 17) return 6;
  if (intelligence >= 16) return 5;
  if (intelligence >= 15) return 4;
  if (intelligence >= 14) return 4;
  if (intelligence >= 13) return 3;
  if (intelligence >= 10) return 3;
  return 2;
}

/**
 * Get spells per day for a 1st level caster
 */
export function getSpellsPerDay(classKey, wisOrInt) {
  const base = 1;
  if (['cleric', 'druid'].includes(classKey)) {
    if (wisOrInt >= 17) return base + 2;
    if (wisOrInt >= 15) return base + 1;
    if (wisOrInt >= 13) return base + 1;
  }
  return base;
}

/**
 * Check if a class is a spellcaster at a given level
 * @param {string} classKey
 * @param {number} level
 */
export function isSpellcaster(classKey, level = 1) {
  if (['mage', 'specialist', 'cleric', 'druid'].includes(classKey)) return true;
  if (classKey === 'bard' && level >= 2) return true;
  if (classKey === 'ranger' && level >= 8) return true;
  if (classKey === 'paladin' && level >= 9) return true;
  return false;
}

/**
 * Get spell list for a class (optionally filtered by spell level)
 */
export function getSpellList(classKey, maxSpellLevel = 9) {
  switch (classKey) {
    case 'mage':
    case 'specialist':
    case 'bard':
      return wizardSpells.filter(s => s.level <= maxSpellLevel);
    case 'cleric':
    case 'paladin':
      return priestSpells.filter(s => s.level <= maxSpellLevel);
    case 'druid':
    case 'ranger':
      return priestSpells.filter(s => s.level <= maxSpellLevel);
    default:
      return [];
  }
}
