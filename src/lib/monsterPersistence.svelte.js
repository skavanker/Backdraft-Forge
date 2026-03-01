/**
 * Monster Persistence - LocalStorage utilities for saved monsters
 * Follows the same pattern as npcPersistence.svelte.js
 */

const MONSTERS_KEY = 'backdraft-forge-saved-monsters';

/**
 * Load saved monsters from localStorage
 * @returns {Array} Array of saved monster objects
 */
export function loadMonsters() {
  try {
    const raw = localStorage.getItem(MONSTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load saved monsters:', error);
    return [];
  }
}

/**
 * Save a monster to favorites
 * @param {Object} monster - Monster object to save
 * @param {Array} existingMonsters - Current array of saved monsters
 * @returns {Array} Updated array of saved monsters
 */
export function saveMonster(monster, existingMonsters = []) {
  try {
    // Check if already saved
    if (existingMonsters.some(m => m.key === monster.key)) {
      return existingMonsters; // Already saved
    }

    const entry = {
      ...monster,
      savedAt: new Date().toISOString()
    };

    const updated = [entry, ...existingMonsters];
    localStorage.setItem(MONSTERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save monster:', error);
    return existingMonsters;
  }
}

/**
 * Delete a saved monster
 * @param {string} key - Monster key to delete
 * @param {Array} existingMonsters - Current array of saved monsters
 * @returns {Array} Updated array of saved monsters
 */
export function deleteMonster(key, existingMonsters = []) {
  try {
    const filtered = existingMonsters.filter(m => m.key !== key);
    localStorage.setItem(MONSTERS_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to delete monster:', error);
    return existingMonsters;
  }
}

/**
 * Clear all saved monsters
 * @returns {Array} Empty array
 */
export function clearAllMonsters() {
  try {
    localStorage.removeItem(MONSTERS_KEY);
    return [];
  } catch (error) {
    console.error('Failed to clear saved monsters:', error);
    return [];
  }
}
