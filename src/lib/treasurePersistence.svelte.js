/**
 * Treasure Persistence - Save/Load treasures to localStorage
 *
 * Thin wrapper around persistenceFactory.
 */

import { createPersistenceStore } from './utils/persistenceFactory.js';

const store = createPersistenceStore({
  key: 'backdraft-forge-treasures',
  label: 'treasures',
  buildEntry: (treasure) => ({
    id: treasure.id || Date.now(),
    type: treasure.type,
    typeName: treasure.typeName,
    source: treasure.source,
    totalValue: treasure.totalValue,
    data: JSON.parse(JSON.stringify(treasure)),
    savedAt: new Date().toISOString()
  }),
  getIdField: (entry) => entry.id
});

export const loadTreasures = store.load;
export const saveTreasure = store.save;
export const deleteTreasure = store.remove;
export const clearAllTreasures = store.clearAll;
export const exportTreasures = store.exportToFile;
