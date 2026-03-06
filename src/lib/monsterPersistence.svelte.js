/**
 * Monster Persistence - LocalStorage utilities for saved monsters
 *
 * Thin wrapper around persistenceFactory.
 */

import { createPersistenceStore } from './utils/persistenceFactory.js';

const store = createPersistenceStore({
  key: 'backdraft-forge-saved-monsters',
  label: 'saved monsters',
  buildEntry: (monster) => ({
    ...monster,
    savedAt: new Date().toISOString()
  }),
  getIdField: (entry) => entry.key,
  dedupeOnSave: true
});

export const loadMonsters = store.load;
export const saveMonster = store.save;
export const deleteMonster = store.remove;
export const clearAllMonsters = store.clearAll;
