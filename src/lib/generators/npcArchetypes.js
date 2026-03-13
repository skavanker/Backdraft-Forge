/**
 * NPC Archetype Templates
 *
 * Pre-configured templates for common NPC types.
 * Provides quick generation of thematically consistent NPCs.
 */

export const npcArchetypes = {
  // ── Combat ──
  townGuard: {
    key: 'townGuard',
    name: 'Town Guard',
    description: 'City watch or militia member',
    category: 'combat',
    classKey: 'fighter',
    levelRange: [1, 3],
    wealthModifier: 1.0,
    equipmentOverride: null
  },

  merchantGuard: {
    key: 'merchantGuard',
    name: 'Merchant Guard',
    description: 'Caravan or shop protector',
    category: 'combat',
    classKey: 'fighter',
    levelRange: [2, 5],
    wealthModifier: 1.5,
    equipmentOverride: null
  },

  sellsword: {
    key: 'sellsword',
    name: 'Sellsword',
    description: 'Mercenary fighter for hire',
    category: 'combat',
    classKey: 'fighter',
    levelRange: [2, 6],
    wealthModifier: 1.3,
    equipmentOverride: null
  },

  thug: {
    key: 'thug',
    name: 'Thug',
    description: 'Street tough or hired muscle',
    category: 'combat',
    classKey: 'fighter',
    levelRange: [1, 3],
    wealthModifier: 0.7,
    equipmentOverride: null
  },

  bandit: {
    key: 'bandit',
    name: 'Bandit',
    description: 'Highway robber or outlaw',
    category: 'combat',
    classKey: 'thief',
    levelRange: [1, 4],
    wealthModifier: 0.8,
    equipmentOverride: null
  },

  scout: {
    key: 'scout',
    name: 'Scout',
    description: 'Wilderness explorer or spy',
    category: 'combat',
    classKey: 'ranger',
    levelRange: [1, 4],
    wealthModifier: 1.1,
    equipmentOverride: null
  },

  // ── Social ──
  noble: {
    key: 'noble',
    name: 'Noble',
    description: 'Aristocrat or wealthy landowner',
    category: 'social',
    classKey: 'fighter',
    levelRange: [3, 7],
    wealthModifier: 3.0,
    equipmentOverride: null
  },

  innkeeper: {
    key: 'innkeeper',
    name: 'Innkeeper',
    description: 'Tavern or inn proprietor',
    category: 'social',
    classKey: 'fighter',
    levelRange: [1, 2],
    wealthModifier: 1.2,
    equipmentOverride: null
  },

  // ── Arcane ──
  apprentice: {
    key: 'apprentice',
    name: 'Apprentice Mage',
    description: 'Student of arcane arts',
    category: 'arcane',
    classKey: 'mage',
    levelRange: [1, 3],
    wealthModifier: 1.0,
    equipmentOverride: null
  },

  sage: {
    key: 'sage',
    name: 'Sage',
    description: 'Scholar or learned wizard',
    category: 'arcane',
    classKey: 'mage',
    levelRange: [4, 8],
    wealthModifier: 1.5,
    equipmentOverride: null
  },

  // ── Divine ──
  acolyte: {
    key: 'acolyte',
    name: 'Acolyte',
    description: 'Temple assistant or junior priest',
    category: 'divine',
    classKey: 'cleric',
    levelRange: [1, 3],
    wealthModifier: 0.9,
    equipmentOverride: null
  },

  cultist: {
    key: 'cultist',
    name: 'Cultist',
    description: 'Member of dark cult or secret society',
    category: 'divine',
    classKey: 'cleric',
    levelRange: [1, 4],
    wealthModifier: 1.0,
    equipmentOverride: null
  },
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
