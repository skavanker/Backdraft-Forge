/**
 * Persistence layer for saved characters and work-in-progress.
 * Extracted from App.svelte to reduce file size.
 */
import { encodeCharacter, decodeCharacter } from './shareCharacter.js';

const SAVES_KEY = 'backdraft-forge-saves';
const OLD_SAVE_KEY = 'backdraft-forge-character';
const WIP_KEY = 'backdraft-forge-wip';

/**
 * Load the saved characters list from localStorage.
 * @returns {Array}
 */
export function loadSavesList() {
  try {
    const raw = localStorage.getItem(SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/**
 * Persist the saves list to localStorage.
 * @param {Array} saves
 */
export function persistSavesList(saves) {
  localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
}

/**
 * Save a character to the saves list. Returns updated list.
 * @param {object} character
 * @param {Array} savedCharacters
 * @returns {Array} updated saves list
 */
export function saveToLocalStorage(character, savedCharacters) {
  try {
    const encoded = encodeCharacter(character);
    if (!encoded) return savedCharacters;
    const entry = {
      id: Date.now(),
      name: character.name || 'Unnamed Hero',
      race: character.race?.name || '?',
      cls: character.kit?.name || character.wizardSchool?.name || character.cls?.name || '?',
      level: character.level || 1,
      code: encoded,
    };
    const idx = savedCharacters.findIndex(s =>
      s.name === entry.name && s.race === entry.race && s.cls === entry.cls
    );
    if (idx >= 0) {
      savedCharacters[idx] = entry;
    } else {
      savedCharacters = [entry, ...savedCharacters];
    }
    persistSavesList(savedCharacters);
    return savedCharacters;
  } catch (e) {
    return savedCharacters;
  }
}

/**
 * Load a saved character from an entry. Returns the character or null.
 * @param {object} entry
 * @returns {Promise<object|null>}
 */
export async function loadSavedCharacter(entry) {
  try {
    return await decodeCharacter(entry.code);
  } catch (e) {
    return null;
  }
}

/**
 * Delete a saved character by id. Returns updated list.
 * @param {number} id
 * @param {Array} savedCharacters
 * @returns {Array}
 */
export function deleteSavedCharacter(id, savedCharacters) {
  const filtered = savedCharacters.filter(s => s.id !== id);
  persistSavesList(filtered);
  return filtered;
}

/**
 * Save mid-creation work-in-progress.
 * @param {object} character
 * @param {number} currentStep
 */
export function saveMidCreation(character, currentStep) {
  try {
    const payload = { character: JSON.parse(JSON.stringify(character)), currentStep };
    localStorage.setItem(WIP_KEY, JSON.stringify(payload));
  } catch { /* silently fail */ }
}

/**
 * Clear mid-creation WIP data.
 */
export function clearMidCreation() {
  localStorage.removeItem(WIP_KEY);
}

/**
 * Load mid-creation WIP data.
 * @returns {{ character: object, currentStep: number } | null}
 */
export function loadMidCreation() {
  try {
    const raw = localStorage.getItem(WIP_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.character && typeof data.currentStep === 'number') {
      return data;
    }
  } catch { /* ignore */ }
  return null;
}

/**
 * Migrate old single-save format to multi-save.
 * @param {Array} existingSaves
 * @returns {Promise<Array>} updated saves list
 */
export async function migrateOldSave(existingSaves) {
  try {
    const oldSave = localStorage.getItem(OLD_SAVE_KEY);
    if (oldSave) {
      const restored = await decodeCharacter(oldSave);
      if (restored) {
        const encoded = encodeCharacter(restored);
        const entry = {
          id: Date.now(),
          name: restored.name || 'Unnamed Hero',
          race: restored.race?.name || '?',
          cls: restored.wizardSchool?.name || restored.cls?.name || '?',
          level: restored.level || 1,
          code: encoded,
        };
        existingSaves = [entry, ...existingSaves];
        persistSavesList(existingSaves);
      }
      localStorage.removeItem(OLD_SAVE_KEY);
    }
  } catch (e) { /* ignore */ }
  return existingSaves;
}
