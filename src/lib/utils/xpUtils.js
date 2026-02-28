/**
 * XP (Experience Points) utilities for character progression.
 * Centralizes all XP-related logic to eliminate duplication.
 * Future: Will handle multi-class XP splitting and calculations.
 */

import { xpTables } from '../../data/levelTables.js';
import { getClassKey, getCharacterLevel } from './characterAccessors.js';

/**
 * Get XP required for next level.
 * Future: Will handle multi-class XP splits.
 *
 * @param {Object} character - Character object
 * @returns {number|null} XP needed for next level, or null if at max level
 */
export function getXPForNextLevel(character) {
  const classKey = getClassKey(character);
  const level = getCharacterLevel(character);
  const table = xpTables[classKey];

  if (!table || level >= table.length) return null;
  return table[level];
}

/**
 * Get XP required for specific level.
 *
 * @param {Object} character - Character object
 * @param {number} targetLevel - Target level
 * @returns {number|null} XP needed for target level
 */
export function getXPForLevel(character, targetLevel) {
  const classKey = getClassKey(character);
  const table = xpTables[classKey];

  if (!table || targetLevel >= table.length || targetLevel < 1) return null;
  return table[targetLevel - 1]; // Tables are 0-indexed
}

/**
 * Check if character is at their level limit.
 * Demi-humans have racial level limits (e.g., dwarf fighter max level 15).
 *
 * @param {Object} character - Character object
 * @returns {boolean} True if at level limit
 */
export function isAtLevelLimit(character) {
  const level = getCharacterLevel(character);
  return character.levelLimit !== null && level >= character.levelLimit;
}

/**
 * Check if character can level up.
 * Requires sufficient XP and not at level limit.
 *
 * @param {Object} character - Character object
 * @returns {boolean} True if character has enough XP and not at level limit
 */
export function canLevelUp(character) {
  if (isAtLevelLimit(character)) return false;

  const xpForNext = getXPForNextLevel(character);
  if (xpForNext === null) return false;

  return (character.xp || 0) >= xpForNext;
}

/**
 * Get XP progress percentage to next level.
 * Useful for progress bars and UI feedback.
 *
 * @param {Object} character - Character object
 * @returns {number} Progress percentage (0-100)
 */
export function getXPProgress(character) {
  const level = getCharacterLevel(character);
  const currentXP = character.xp || 0;
  const nextXP = getXPForNextLevel(character);
  const prevXP = level > 1 ? getXPForLevel(character, level) : 0;

  if (nextXP === null) return 100; // Max level

  const needed = nextXP - prevXP;
  const gained = currentXP - prevXP;

  return Math.min(100, Math.max(0, (gained / needed) * 100));
}

/**
 * Calculate XP adjusted for bonus (e.g., prime requisite bonus).
 * Future: Will handle multi-class XP splitting.
 *
 * @param {number} baseXP - Base XP earned
 * @param {number} xpBonus - XP bonus percentage (e.g., 10 for +10%)
 * @returns {number} Adjusted XP
 */
export function applyXPBonus(baseXP, xpBonus) {
  if (!xpBonus || xpBonus === 0) return baseXP;
  return Math.floor(baseXP * (1 + xpBonus / 100));
}

/**
 * Get XP needed to reach next level (convenience function).
 * Returns the difference between next level XP and current XP.
 *
 * @param {Object} character - Character object
 * @returns {number|null} XP still needed, or null if at max level
 */
export function getXPNeededForNextLevel(character) {
  const nextLevelXP = getXPForNextLevel(character);
  if (nextLevelXP === null) return null;

  const currentXP = character.xp || 0;
  return Math.max(0, nextLevelXP - currentXP);
}
