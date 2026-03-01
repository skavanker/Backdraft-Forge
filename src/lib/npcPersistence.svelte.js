/**
 * NPC Persistence - Save/Load NPCs to localStorage
 *
 * Separate storage from player characters using 'backdraft-forge-npcs' key.
 */

const NPCS_KEY = 'backdraft-forge-npcs';

/**
 * Load NPCs from localStorage
 * @returns {Array} Array of saved NPCs
 */
export function loadNPCs() {
  try {
    const raw = localStorage.getItem(NPCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load NPCs:', error);
    return [];
  }
}

/**
 * Save NPC to localStorage
 * @param {Object} npc - NPC character object
 * @param {Array} existingNPCs - Current list of saved NPCs
 * @returns {Array} Updated list of NPCs
 */
export function saveNPC(npc, existingNPCs = []) {
  try {
    const entry = {
      id: npc.id || Date.now(),
      name: npc.name || 'Unnamed NPC',
      race: npc.race.name,
      cls: npc.cls.name,
      level: npc.level,
      alignment: npc.alignmentName,
      archetype: npc.archetype,
      data: JSON.parse(JSON.stringify(npc)), // Deep clone
      savedAt: new Date().toISOString()
    };

    const updated = [entry, ...existingNPCs];
    localStorage.setItem(NPCS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save NPC:', error);
    return existingNPCs;
  }
}

/**
 * Delete NPC from localStorage
 * @param {string|number} id - NPC ID to delete
 * @param {Array} existingNPCs - Current list of saved NPCs
 * @returns {Array} Updated list of NPCs
 */
export function deleteNPC(id, existingNPCs = []) {
  try {
    const filtered = existingNPCs.filter(n => n.id !== id);
    localStorage.setItem(NPCS_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Failed to delete NPC:', error);
    return existingNPCs;
  }
}

/**
 * Clear all NPCs from localStorage
 * @returns {Array} Empty array
 */
export function clearAllNPCs() {
  try {
    localStorage.removeItem(NPCS_KEY);
    return [];
  } catch (error) {
    console.error('Failed to clear NPCs:', error);
    return [];
  }
}

/**
 * Export NPCs as JSON file
 * @param {Array} npcs - NPCs to export
 * @param {string} filename - Export filename
 */
export function exportNPCs(npcs, filename = 'npcs-export.json') {
  try {
    const dataStr = JSON.stringify(npcs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export NPCs:', error);
  }
}

/**
 * Import NPCs from JSON file
 * @param {File} file - JSON file to import
 * @param {Array} existingNPCs - Current list of saved NPCs
 * @returns {Promise<Array>} Updated list of NPCs
 */
export async function importNPCs(file, existingNPCs = []) {
  try {
    const text = await file.text();
    const imported = JSON.parse(text);

    if (!Array.isArray(imported)) {
      throw new Error('Invalid import file format');
    }

    const updated = [...existingNPCs, ...imported];
    localStorage.setItem(NPCS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to import NPCs:', error);
    return existingNPCs;
  }
}
