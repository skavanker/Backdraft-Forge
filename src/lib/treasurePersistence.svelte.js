/**
 * Treasure Persistence - Save/Load treasures to localStorage
 *
 * Separate storage from characters and NPCs using 'backdraft-forge-treasures' key.
 */

const TREASURES_KEY = 'backdraft-forge-treasures';

/**
 * Load treasures from localStorage
 * @returns {Array} Array of saved treasures
 */
export function loadTreasures() {
  try {
    const raw = localStorage.getItem(TREASURES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load treasures:', error);
    return [];
  }
}

/**
 * Save treasure to localStorage
 * @param {Object} treasure - Treasure hoard object
 * @param {Array} existingTreasures - Current list of saved treasures
 * @returns {Array} Updated list of treasures
 */
export function saveTreasure(treasure, existingTreasures = []) {
  try {
    const entry = {
      id: treasure.id || Date.now(),
      type: treasure.type,
      typeName: treasure.typeName,
      source: treasure.source,
      totalValue: treasure.totalValue,
      data: JSON.parse(JSON.stringify(treasure)), // Deep clone
      savedAt: new Date().toISOString()
    };

    const updated = [entry, ...existingTreasures];
    localStorage.setItem(TREASURES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save treasure:', error);
    return existingTreasures;
  }
}

/**
 * Delete treasure from localStorage
 * @param {string|number} id - Treasure ID to delete
 * @param {Array} existingTreasures - Current list of saved treasures
 * @returns {Array} Updated list of treasures
 */
export function deleteTreasure(id, existingTreasures = []) {
  try {
    const filtered = existingTreasures.filter(t => t.id !== id);
    localStorage.setItem(TREASURES_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to delete treasure:', error);
    return existingTreasures;
  }
}

/**
 * Clear all treasures from localStorage
 * @returns {Array} Empty array
 */
export function clearAllTreasures() {
  try {
    localStorage.removeItem(TREASURES_KEY);
    return [];
  } catch (error) {
    console.error('Failed to clear treasures:', error);
    return [];
  }
}

/**
 * Export treasures as JSON file
 * @param {Array} treasures - Treasures to export
 * @param {string} filename - Export filename
 */
export function exportTreasures(treasures, filename = 'treasures-export.json') {
  try {
    const dataStr = JSON.stringify(treasures, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export treasures:', error);
  }
}
