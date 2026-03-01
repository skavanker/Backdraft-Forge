/**
 * NPC Archetype Templates
 *
 * Pre-configured templates for common NPC types.
 * Provides quick generation of thematically consistent NPCs.
 */

export const npcArchetypes = {
  townGuard: {
    key: 'townGuard',
    name: 'Town Guard',
    description: 'City watch or militia member',
    classKey: 'fighter',
    levelRange: [1, 3],
    wealthModifier: 1.0,
    equipmentOverride: null // Uses standard packages
  },

  bandit: {
    key: 'bandit',
    name: 'Bandit',
    description: 'Highway robber or outlaw',
    classKey: 'thief',
    levelRange: [1, 4],
    wealthModifier: 0.8, // Less wealthy
    equipmentOverride: null
  },

  merchantGuard: {
    key: 'merchantGuard',
    name: 'Merchant Guard',
    description: 'Caravan or shop protector',
    classKey: 'fighter',
    levelRange: [2, 5],
    wealthModifier: 1.5, // Better equipped
    equipmentOverride: null
  },

  cultist: {
    key: 'cultist',
    name: 'Cultist',
    description: 'Member of dark cult or secret society',
    classKey: 'cleric',
    levelRange: [1, 4],
    wealthModifier: 1.0,
    equipmentOverride: null
  },

  acolyte: {
    key: 'acolyte',
    name: 'Acolyte',
    description: 'Temple assistant or junior priest',
    classKey: 'cleric',
    levelRange: [1, 3],
    wealthModifier: 0.9,
    equipmentOverride: null
  },

  apprentice: {
    key: 'apprentice',
    name: 'Apprentice Mage',
    description: 'Student of arcane arts',
    classKey: 'mage',
    levelRange: [1, 3],
    wealthModifier: 1.0,
    equipmentOverride: null
  },

  sellsword: {
    key: 'sellsword',
    name: 'Sellsword',
    description: 'Mercenary fighter for hire',
    classKey: 'fighter',
    levelRange: [2, 6],
    wealthModifier: 1.3,
    equipmentOverride: null
  },

  scout: {
    key: 'scout',
    name: 'Scout',
    description: 'Wilderness explorer or spy',
    classKey: 'ranger',
    levelRange: [1, 4],
    wealthModifier: 1.1,
    equipmentOverride: null
  },

  noble: {
    key: 'noble',
    name: 'Noble',
    description: 'Aristocrat or wealthy landowner',
    classKey: 'fighter',
    levelRange: [3, 7],
    wealthModifier: 3.0, // Very wealthy
    equipmentOverride: null
  },

  innkeeper: {
    key: 'innkeeper',
    name: 'Innkeeper',
    description: 'Tavern or inn proprietor',
    classKey: 'fighter',
    levelRange: [0, 2], // Often level 0 (commoners)
    wealthModifier: 1.2,
    equipmentOverride: null
  },

  thug: {
    key: 'thug',
    name: 'Thug',
    description: 'Street tough or hired muscle',
    classKey: 'fighter',
    levelRange: [1, 3],
    wealthModifier: 0.7,
    equipmentOverride: null
  },

  sage: {
    key: 'sage',
    name: 'Sage',
    description: 'Scholar or learned wizard',
    classKey: 'mage',
    levelRange: [4, 8],
    wealthModifier: 1.5,
    equipmentOverride: null
  }
};

/**
 * Get archetype by key
 * @param {string} key - Archetype key
 * @returns {Object|null} Archetype object or null
 */
export function getArchetype(key) {
  return npcArchetypes[key] || null;
}

/**
 * Get all archetypes as array
 * @returns {Array} Array of archetype objects
 */
export function getAllArchetypes() {
  return Object.values(npcArchetypes);
}

/**
 * Get archetypes filtered by class
 * @param {string} classKey - Class key to filter by
 * @returns {Array} Filtered archetypes
 */
export function getArchetypesByClass(classKey) {
  return Object.values(npcArchetypes).filter(arch => arch.classKey === classKey);
}
