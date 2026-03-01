/**
 * Weighted Equipment Package System for NPCs
 *
 * Pre-defined loadout packages with selection weights (70% common, 20% uncommon, 10% rare)
 * Ensures realistic, varied equipment while staying within affordability constraints.
 */

import { equipment } from '../../data/equipment.js';

/**
 * Pick a random element from array
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Weighted selection algorithm
 * @param {Array} packages - Array of package objects with weight property
 * @param {Object} filters - Optional filters (classGroup, tier, etc.)
 * @returns {Object} Selected package
 */
function selectWeightedPackage(packages, filters = {}) {
  // Filter eligible packages
  const eligible = packages.filter(pkg => {
    if (filters.classGroups && pkg.classGroups && !pkg.classGroups.includes(filters.classGroup)) {
      return false;
    }
    if (filters.tier && pkg.tier && pkg.tier !== filters.tier) {
      return false;
    }
    return true;
  });

  if (eligible.length === 0) return null;

  // Calculate total weight
  const totalWeight = eligible.reduce((sum, pkg) => sum + pkg.weight, 0);
  let random = Math.random() * totalWeight;

  // Select package based on weight
  for (const pkg of eligible) {
    random -= pkg.weight;
    if (random <= 0) return pkg;
  }

  return eligible[0];
}

/**
 * Determine affordability tier based on starting gold
 * @param {number} gold - Starting gold amount
 * @returns {string} 'budget' | 'moderate' | 'wealthy'
 */
export function getAffordabilityTier(gold) {
  if (gold < 50) return 'budget';
  if (gold < 150) return 'moderate';
  return 'wealthy';
}

/**
 * Get equipment item by key
 */
function getEquipmentItem(category, key) {
  return equipment[category]?.find(item => item.key === key);
}

// ============================================================================
// WEAPON PACKAGES
// ============================================================================

export const weaponPackages = {
  warrior: [
    {
      name: 'Sword & Shield',
      weight: 70,
      items: ['longSword', 'mediumShield'],
      ammunition: [],
      category: 'melee'
    },
    {
      name: 'Two-Handed Sword',
      weight: 20,
      items: ['twoHandedSword'],
      ammunition: [],
      category: 'melee'
    },
    {
      name: 'Archer',
      weight: 10,
      items: ['longBow', 'shortSword'],
      ammunition: [{ key: 'arrows', quantity: 20 }],
      category: 'ranged'
    }
  ],

  rogue: [
    {
      name: 'Daggers & Sling',
      weight: 60,
      items: ['dagger', 'dagger', 'sling'],
      ammunition: [{ key: 'slingBullets', quantity: 10 }],
      category: 'mixed'
    },
    {
      name: 'Short Sword & Dagger',
      weight: 40,
      items: ['shortSword', 'dagger'],
      ammunition: [],
      category: 'melee'
    }
  ],

  wizard: [
    {
      name: 'Staff',
      weight: 80,
      items: ['quarterstaff'],
      ammunition: [],
      category: 'melee'
    },
    {
      name: 'Staff & Dagger',
      weight: 20,
      items: ['quarterstaff', 'dagger'],
      ammunition: [],
      category: 'melee'
    }
  ],

  priest: [
    {
      name: 'Mace & Shield',
      weight: 70,
      items: ['mace', 'mediumShield'],
      ammunition: [],
      category: 'melee'
    },
    {
      name: 'Staff',
      weight: 30,
      items: ['quarterstaff'],
      ammunition: [],
      category: 'melee'
    }
  ]
};

// ============================================================================
// ARMOR PACKAGES
// ============================================================================

export const armorPackages = {
  budget: [
    {
      name: 'Leather',
      weight: 70,
      item: 'leather',
      tier: 'budget'
    },
    {
      name: 'Studded Leather',
      weight: 30,
      item: 'studdedLeather',
      tier: 'budget'
    }
  ],

  moderate: [
    {
      name: 'Chain Mail',
      weight: 60,
      item: 'chainMail',
      tier: 'moderate'
    },
    {
      name: 'Scale Mail',
      weight: 40,
      item: 'scaleMail',
      tier: 'moderate'
    }
  ],

  wealthy: [
    {
      name: 'Plate Mail',
      weight: 70,
      item: 'plateMail',
      tier: 'wealthy'
    },
    {
      name: 'Banded Mail',
      weight: 30,
      item: 'bandedMail',
      tier: 'wealthy'
    }
  ]
};

// ============================================================================
// ADVENTURING GEAR PACKAGES
// ============================================================================

export const gearPackages = [
  {
    name: 'Basic Adventurer',
    weight: 100,
    items: ['backpack', 'bedroll', 'waterskin', 'rations', 'torch', 'torch', 'flintSteel']
  },
  {
    name: 'Thief Kit',
    weight: 100,
    classGroups: ['rogue'],
    items: ['backpack', 'bedroll', 'waterskin', 'rations', 'grapplingHook', 'rope', 'torch']
  },
  {
    name: 'Priest Kit',
    weight: 100,
    classGroups: ['priest'],
    items: ['backpack', 'bedroll', 'waterskin', 'rations', 'holySymbolWood']
  },
  {
    name: 'Wizard Kit',
    weight: 100,
    classGroups: ['wizard'],
    items: ['backpack', 'bedroll', 'waterskin', 'rations', 'inkQuill', 'parchment']
  }
];

// ============================================================================
// MAIN EQUIPMENT GENERATOR
// ============================================================================

/**
 * Generate weighted equipment loadout for NPC
 * @param {string} classGroup - warrior/wizard/priest/rogue
 * @param {number} startingGold - Available gold
 * @param {Array} weaponProfs - Selected weapon proficiencies (keys)
 * @param {Object} override - Optional archetype equipment overrides
 * @returns {Object} Equipment loadout { weapons, armor, shield, ammunition, gear, gold }
 */
export function generateWeightedEquipment(classGroup, startingGold, weaponProfs = [], override = null) {
  const result = {
    weapons: [],
    armor: null,
    shield: null,
    ammunition: [],
    gear: [],
    goldRemaining: startingGold
  };

  // Apply overrides if specified
  if (override) {
    return applyEquipmentOverride(override, result);
  }

  // 1. Select weapon package
  const weaponPkg = selectWeightedPackage(
    weaponPackages[classGroup] || weaponPackages.warrior,
    { classGroup }
  );

  if (weaponPkg) {
    // Add weapons from package
    weaponPkg.items.forEach(itemKey => {
      const weapon = getEquipmentItem('weapons', itemKey);
      if (weapon) result.weapons.push(weapon);
    });

    // Add ammunition if specified
    if (weaponPkg.ammunition) {
      weaponPkg.ammunition.forEach(ammo => {
        const ammoItem = getEquipmentItem('ammunition', ammo.key);
        if (ammoItem) {
          result.ammunition.push({ ...ammoItem, quantity: ammo.quantity });
        }
      });
    }
  }

  // 2. Select armor based on affordability
  // Wizards can't wear armor (except special cases)
  if (classGroup !== 'wizard') {
    const tier = getAffordabilityTier(startingGold);
    const armorPkg = selectWeightedPackage(armorPackages[tier] || armorPackages.budget, { tier });

    if (armorPkg) {
      const armorItem = getEquipmentItem('armor', armorPkg.item);
      if (armorItem) result.armor = armorItem;
    }

    // Add shield if weapon package included one
    if (weaponPkg && weaponPkg.items.includes('mediumShield')) {
      const shieldItem = getEquipmentItem('shields', 'mediumShield');
      if (shieldItem) result.shield = shieldItem;
    }
  }

  // 3. Select adventuring gear package
  const gearPkg = selectWeightedPackage(gearPackages, { classGroup });

  if (gearPkg) {
    gearPkg.items.forEach(itemKey => {
      const gearItem = getEquipmentItem('adventuringGear', itemKey);
      if (gearItem) result.gear.push(gearItem);
    });
  }

  // 4. Calculate remaining gold (simplified - just return starting gold for now)
  // In a full implementation, we'd subtract costs
  result.goldRemaining = startingGold;

  return result;
}

/**
 * Apply archetype equipment overrides
 * @param {Object} override - Override specification from archetype
 * @param {Object} result - Base equipment result
 * @returns {Object} Modified equipment result
 */
function applyEquipmentOverride(override, result) {
  // Simple override implementation - can be expanded
  // For now, just return the base result
  // Full implementation would parse override strings like "spear+sword+shield"
  return result;
}
