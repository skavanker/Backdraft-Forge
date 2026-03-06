/**
 * NPC Persistence - Save/Load NPCs to localStorage
 *
 * Thin wrapper around persistenceFactory.
 */

import { createPersistenceStore } from './utils/persistenceFactory.js';

const store = createPersistenceStore({
  key: 'backdraft-forge-npcs',
  label: 'NPCs',
  buildEntry: (npc) => ({
    id: npc.id || Date.now(),
    name: npc.name || 'Unnamed NPC',
    race: npc.race.name,
    cls: npc.cls.name,
    level: npc.level,
    alignment: npc.alignmentName,
    archetype: npc.archetype,
    data: JSON.parse(JSON.stringify(npc)),
    savedAt: new Date().toISOString()
  }),
  getIdField: (entry) => entry.id
});

export const loadNPCs = store.load;
export const saveNPC = store.save;
export const deleteNPC = store.remove;
export const clearAllNPCs = store.clearAll;
export const exportNPCs = store.exportToFile;
export const importNPCs = store.importFromFile;
