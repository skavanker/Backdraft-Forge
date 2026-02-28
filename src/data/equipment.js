/**
 * AD&D 2nd Edition Equipment Data
 * Prices in gold pieces (gp), silver pieces (sp), or copper pieces (cp)
 * 1 gp = 10 sp = 100 cp
 */

// Starting gold by class group (roll multiplied by 10)
export const startingGold = {
  warrior: { dice: '5d4', multiplier: 10 },  // 50-200 gp
  wizard: { dice: '1d4+1', multiplier: 10 }, // 20-50 gp
  priest: { dice: '3d6', multiplier: 10 },   // 30-180 gp
  rogue: { dice: '2d6', multiplier: 10 }     // 20-120 gp
};

// Convert price to copper for calculations
function toCopper(price) {
  if (price.gp) return price.gp * 100;
  if (price.sp) return price.sp * 10;
  if (price.cp) return price.cp;
  return 0;
}

// Format price for display
export function formatPrice(price) {
  if (price.gp) return `${price.gp} gp`;
  if (price.sp) return `${price.sp} sp`;
  if (price.cp) return `${price.cp} cp`;
  return 'Free';
}

// Equipment categories
export const equipment = {
  armor: [
    { key: 'leather', name: 'Leather Armor', ac: 8, price: { gp: 5 }, weight: 15 },
    { key: 'studdedLeather', name: 'Studded Leather', ac: 7, price: { gp: 20 }, weight: 25 },
    { key: 'ringMail', name: 'Ring Mail', ac: 7, price: { gp: 100 }, weight: 30 },
    { key: 'scaleMail', name: 'Scale Mail', ac: 6, price: { gp: 120 }, weight: 40 },
    { key: 'chainMail', name: 'Chain Mail', ac: 5, price: { gp: 75 }, weight: 40 },
    { key: 'splintMail', name: 'Splint Mail', ac: 4, price: { gp: 80 }, weight: 40 },
    { key: 'bandedMail', name: 'Banded Mail', ac: 4, price: { gp: 200 }, weight: 35 },
    { key: 'plateMail', name: 'Plate Mail', ac: 3, price: { gp: 600 }, weight: 45 },
    { key: 'fieldPlate', name: 'Field Plate', ac: 2, price: { gp: 2000 }, weight: 60 },
    { key: 'fullPlate', name: 'Full Plate', ac: 1, price: { gp: 4000 }, weight: 70 }
  ],

  shields: [
    { key: 'buckler', name: 'Buckler', acBonus: 1, price: { gp: 1 }, weight: 3 },
    { key: 'smallShield', name: 'Small Shield', acBonus: 1, price: { gp: 3 }, weight: 5 },
    { key: 'mediumShield', name: 'Medium Shield', acBonus: 1, price: { gp: 7 }, weight: 10 },
    { key: 'largeShield', name: 'Large Shield', acBonus: 1, price: { gp: 10 }, weight: 15 }
  ],

  // NOTE: Weapon damage is simplified (single value) rather than S-M/L split.
  // PHB lists separate damage vs Small-Medium and Large creatures, but for
  // simplicity we use a single damage value (typically the S-M value or average).
  // Example: Long Sword is 1d8 here (vs PHB's 1d8/1d12)
  weapons: [
    // Simple
    { key: 'club', name: 'Club', damage: '1d6', price: { gp: 0 }, weight: 3, category: 'simple' },
    { key: 'dagger', name: 'Dagger', damage: '1d4', price: { gp: 2 }, weight: 1, category: 'simple' },
    { key: 'dart', name: 'Dart (5)', damage: '1d3', price: { sp: 5 }, weight: 1, category: 'simple', ranged: true },
    { key: 'sling', name: 'Sling', damage: '1d4', price: { sp: 5 }, weight: 0, category: 'simple', ranged: true },
    { key: 'staff', name: 'Quarterstaff', damage: '1d6', price: { gp: 0 }, weight: 4, category: 'simple' },

    // Swords
    { key: 'shortSword', name: 'Short Sword', damage: '1d6', price: { gp: 10 }, weight: 3, category: 'sword' },
    { key: 'longSword', name: 'Long Sword', damage: '1d8', price: { gp: 15 }, weight: 4, category: 'sword' },
    { key: 'broadsword', name: 'Broadsword', damage: '2d4', price: { gp: 10 }, weight: 4, category: 'sword' },
    { key: 'bastardSword', name: 'Bastard Sword', damage: '1d8/1d10', price: { gp: 25 }, weight: 6, category: 'sword' },
    { key: 'twoHandedSword', name: 'Two-Handed Sword', damage: '1d10', price: { gp: 50 }, weight: 10, category: 'sword' },
    { key: 'scimitar', name: 'Scimitar', damage: '1d8', price: { gp: 15 }, weight: 4, category: 'sword' },

    // Axes
    { key: 'handAxe', name: 'Hand Axe', damage: '1d6', price: { gp: 1 }, weight: 5, category: 'axe' },
    { key: 'battleAxe', name: 'Battle Axe', damage: '1d8', price: { gp: 5 }, weight: 7, category: 'axe' },

    // Blunt
    { key: 'mace', name: 'Mace', damage: '1d6+1', price: { gp: 8 }, weight: 8, category: 'blunt' },
    { key: 'morningstar', name: 'Morning Star', damage: '2d4', price: { gp: 10 }, weight: 12, category: 'blunt' },
    { key: 'flail', name: 'Flail', damage: '1d6+1', price: { gp: 15 }, weight: 15, category: 'blunt' },
    { key: 'warhammer', name: 'Warhammer', damage: '1d4+1', price: { gp: 2 }, weight: 6, category: 'blunt' },

    // Polearms
    { key: 'spear', name: 'Spear', damage: '1d6', price: { gp: 1 }, weight: 5, category: 'polearm' },
    { key: 'javelin', name: 'Javelin', damage: '1d6', price: { gp: 1 }, weight: 2, category: 'polearm', ranged: true },
    { key: 'halberd', name: 'Halberd', damage: '1d10', price: { gp: 10 }, weight: 15, category: 'polearm' },
    { key: 'pike', name: 'Pike', damage: '1d6', price: { gp: 5 }, weight: 8, category: 'polearm' },
    { key: 'trident', name: 'Trident', damage: '1d6+1', price: { gp: 15 }, weight: 5, category: 'polearm' },

    // Exotic
    { key: 'whip', name: 'Whip', damage: '1d2', price: { gp: 1 }, weight: 2, category: 'exotic' },
    { key: 'net', name: 'Net', damage: '—', price: { gp: 5 }, weight: 10, category: 'exotic', ranged: true },

    // Ranged
    { key: 'shortBow', name: 'Short Bow', damage: '1d6', price: { gp: 30 }, weight: 2, category: 'bow', ranged: true },
    { key: 'longBow', name: 'Long Bow', damage: '1d8', price: { gp: 75 }, weight: 3, category: 'bow', ranged: true },
    { key: 'compositeBow', name: 'Composite Bow', damage: '1d6', price: { gp: 100 }, weight: 2, category: 'bow', ranged: true },
    { key: 'lightCrossbow', name: 'Light Crossbow', damage: '1d4', price: { gp: 35 }, weight: 7, category: 'crossbow', ranged: true },
    { key: 'heavyCrossbow', name: 'Heavy Crossbow', damage: '1d4+1', price: { gp: 50 }, weight: 14, category: 'crossbow', ranged: true }
  ],

  ammunition: [
    { key: 'arrows', name: 'Arrow', price: { cp: 5 }, weight: 0.1 },
    { key: 'bolts', name: 'Crossbow Bolt', price: { sp: 1 }, weight: 0.1 },
    { key: 'slingBullets', name: 'Sling Bullet', price: { cp: 1 }, weight: 0.1 }
  ],

  adventuringGear: [
    { key: 'backpack', name: 'Backpack', price: { gp: 2 }, weight: 2 },
    { key: 'bedroll', name: 'Bedroll', price: { sp: 2 }, weight: 5 },
    { key: 'blanket', name: 'Blanket, Winter', price: { sp: 5 }, weight: 3 },
    { key: 'blockAndTackle', name: 'Block & Tackle', price: { gp: 5 }, weight: 5 },
    { key: 'candle', name: 'Candle', price: { cp: 1 }, weight: 0 },
    { key: 'chain', name: 'Chain (10 ft)', price: { gp: 30 }, weight: 2 },
    { key: 'chalk', name: 'Chalk', price: { cp: 1 }, weight: 0 },
    { key: 'crowbar', name: 'Crowbar', price: { gp: 2 }, weight: 5 },
    { key: 'fishingHook', name: 'Fishing Hook & Line', price: { sp: 1 }, weight: 0 },
    { key: 'flintSteel', name: 'Flint & Steel', price: { sp: 5 }, weight: 0 },
    { key: 'grapplingHook', name: 'Grappling Hook', price: { gp: 1 }, weight: 4 },
    { key: 'hammer', name: 'Hammer', price: { sp: 5 }, weight: 2 },
    { key: 'holySymbol', name: 'Holy Symbol, Silver', price: { gp: 25 }, weight: 0 },
    { key: 'holySymbolWood', name: 'Holy Symbol, Wood', price: { gp: 1 }, weight: 0 },
    { key: 'holyWater', name: 'Holy Water (vial)', price: { gp: 25 }, weight: 0 },
    { key: 'inkBottle', name: 'Ink (bottle)', price: { gp: 8 }, weight: 0 },
    { key: 'inkQuill', name: 'Ink & Quill', price: { sp: 2 }, weight: 0 },
    { key: 'ironSpikes', name: 'Iron Spikes (12)', price: { gp: 1 }, weight: 5 },
    { key: 'ladder', name: 'Ladder (10 ft)', price: { sp: 5 }, weight: 20 },
    { key: 'lantern', name: 'Lantern, Hooded', price: { gp: 7 }, weight: 2 },
    { key: 'lanternBullseye', name: 'Lantern, Bullseye', price: { gp: 12 }, weight: 3 },
    { key: 'lock', name: 'Lock, Good', price: { gp: 100 }, weight: 1 },
    { key: 'lockPoor', name: 'Lock, Poor', price: { gp: 20 }, weight: 1 },
    { key: 'manacles', name: 'Manacles', price: { gp: 15 }, weight: 2 },
    { key: 'mirror', name: 'Mirror, Small Steel', price: { gp: 10 }, weight: 0 },
    { key: 'oil', name: 'Oil (flask)', price: { sp: 6 }, weight: 1 },
    { key: 'parchment', name: 'Parchment (sheet)', price: { sp: 2 }, weight: 0 },
    { key: 'pick', name: 'Pick, Miner\'s', price: { gp: 3 }, weight: 10 },
    { key: 'piton', name: 'Piton', price: { sp: 3 }, weight: 0 },
    { key: 'pole', name: 'Pole (10 ft)', price: { sp: 2 }, weight: 8 },
    { key: 'pouchBelt', name: 'Pouch, Belt', price: { gp: 1 }, weight: 0 },
    { key: 'rations', name: 'Rations (1 week)', price: { gp: 3 }, weight: 7 },
    { key: 'rope', name: 'Rope, Hemp (50 ft)', price: { gp: 1 }, weight: 10 },
    { key: 'ropeSilk', name: 'Rope, Silk (50 ft)', price: { gp: 10 }, weight: 8 },
    { key: 'sack', name: 'Sack, Large', price: { sp: 2 }, weight: 0 },
    { key: 'sackSmall', name: 'Sack, Small', price: { sp: 5 }, weight: 0 },
    { key: 'scrollCase', name: 'Scroll Case', price: { gp: 1 }, weight: 0 },
    { key: 'sealing Wax', name: 'Sealing Wax', price: { gp: 1 }, weight: 0 },
    { key: 'shovel', name: 'Shovel', price: { gp: 2 }, weight: 8 },
    { key: 'signalWhistle', name: 'Signal Whistle', price: { sp: 8 }, weight: 0 },
    { key: 'spellbook', name: 'Spellbook (blank)', price: { gp: 50 }, weight: 3 },
    { key: 'spellbookTraveling', name: 'Spellbook, Traveling (blank)', price: { gp: 100 }, weight: 1 },
    { key: 'spyglass', name: 'Spyglass', price: { gp: 1000 }, weight: 1 },
    { key: 'tent', name: 'Tent, Small', price: { gp: 5 }, weight: 20 },
    { key: 'tentLarge', name: 'Tent, Large', price: { gp: 25 }, weight: 40 },
    { key: 'thievesTools', name: "Thieves' Tools", price: { gp: 30 }, weight: 1 },
    { key: 'torch', name: 'Torch', price: { cp: 1 }, weight: 1 },
    { key: 'vialGlass', name: 'Vial, Glass', price: { gp: 1 }, weight: 0 },
    { key: 'waterskin', name: 'Waterskin', price: { gp: 1 }, weight: 1 },
    { key: 'whetstone', name: 'Whetstone', price: { cp: 2 }, weight: 0 },
    { key: 'wineskin', name: 'Wineskin', price: { sp: 8 }, weight: 1 }
  ],

  clothing: [
    { key: 'belt', name: 'Belt', price: { sp: 3 }, weight: 0 },
    { key: 'boots', name: 'Boots, Riding', price: { gp: 3 }, weight: 3 },
    { key: 'bootsCommon', name: 'Boots, Common', price: { sp: 5 }, weight: 2 },
    { key: 'cloak', name: 'Cloak', price: { sp: 5 }, weight: 2 },
    { key: 'clothesCommon', name: 'Clothes, Common', price: { sp: 7 }, weight: 3 },
    { key: 'clothesFine', name: 'Clothes, Fine', price: { gp: 10 }, weight: 3 },
    { key: 'clothesTraveling', name: 'Clothes, Traveling', price: { gp: 2 }, weight: 4 },
    { key: 'gloves', name: 'Gloves', price: { sp: 5 }, weight: 0 },
    { key: 'hat', name: 'Hat', price: { sp: 7 }, weight: 0 },
    { key: 'robes', name: 'Robes', price: { gp: 1 }, weight: 2 },
    { key: 'winterCloak', name: 'Cloak, Winter', price: { gp: 1 }, weight: 3 }
  ],

  toolsAndKits: [
    { key: 'healersKit', name: "Healer's Kit", price: { gp: 25 }, weight: 3 },
    { key: 'disguiseKit', name: 'Disguise Kit', price: { gp: 25 }, weight: 5 },
    { key: 'alchemistSupplies', name: "Alchemist's Supplies", price: { gp: 50 }, weight: 8 },
    { key: 'cartographerTools', name: "Cartographer's Tools", price: { gp: 15 }, weight: 6 },
    { key: 'carpenterTools', name: "Carpenter's Tools", price: { gp: 8 }, weight: 6 },
    { key: 'cobblersTools', name: "Cobbler's Tools", price: { gp: 5 }, weight: 5 },
    { key: 'cookingUtensils', name: 'Cooking Utensils', price: { gp: 1 }, weight: 8 },
    { key: 'masonTools', name: "Mason's Tools", price: { gp: 10 }, weight: 8 },
    { key: 'smithTools', name: "Smith's Tools", price: { gp: 20 }, weight: 10 },
    { key: 'instrumentLute', name: 'Musical Instrument (Lute)', price: { gp: 30 }, weight: 2 },
    { key: 'instrumentFlute', name: 'Musical Instrument (Flute)', price: { gp: 12 }, weight: 1 },
    { key: 'instrumentDrum', name: 'Musical Instrument (Drum)', price: { gp: 6 }, weight: 3 }
  ],

  provisions: [
    { key: 'ale', name: 'Ale (gallon)', price: { sp: 2 }, weight: 8 },
    { key: 'mealCommon', name: 'Meal, Common', price: { sp: 3 }, weight: 0 },
    { key: 'mealGood', name: 'Meal, Good', price: { sp: 5 }, weight: 0 },
    { key: 'wine', name: 'Wine, Common (pitcher)', price: { sp: 2 }, weight: 1 },
    { key: 'wineFine', name: 'Wine, Fine (bottle)', price: { gp: 10 }, weight: 1 },
    { key: 'bread', name: 'Bread (loaf)', price: { cp: 5 }, weight: 0 },
    { key: 'cheese', name: 'Cheese (hunk)', price: { sp: 4 }, weight: 0 },
    { key: 'meat', name: 'Meat (chunk)', price: { sp: 3 }, weight: 0 }
  ],

  transport: [
    { key: 'horse', name: 'Horse, Riding', price: { gp: 75 }, weight: 0 },
    { key: 'horseWar', name: 'Horse, War', price: { gp: 400 }, weight: 0 },
    { key: 'pony', name: 'Pony', price: { gp: 30 }, weight: 0 },
    { key: 'mule', name: 'Mule', price: { gp: 8 }, weight: 0 },
    { key: 'saddleRiding', name: 'Saddle, Riding', price: { gp: 10 }, weight: 35 },
    { key: 'saddlePack', name: 'Saddle, Pack', price: { gp: 5 }, weight: 15 },
    { key: 'saddlebags', name: 'Saddlebags', price: { gp: 4 }, weight: 8 },
    { key: 'barding', name: 'Barding (horse armor)', price: { gp: 150 }, weight: 60 },
    { key: 'cart', name: 'Cart', price: { gp: 100 }, weight: 600 },
    { key: 'wagon', name: 'Wagon', price: { gp: 200 }, weight: 800 }
  ]
};

// Armor restrictions by class
export const armorRestrictions = {
  fighter: 'all',
  paladin: 'all',
  ranger: 'all',
  mage: 'none',
  specialist: 'none',
  cleric: 'all',
  druid: ['leather', 'studdedLeather'], // Non-metal only
  thief: ['leather', 'studdedLeather'],
  bard: ['leather', 'studdedLeather', 'chainMail']
};

// Shield restrictions by class
export const shieldRestrictions = {
  fighter: 'all',
  paladin: 'all',
  ranger: 'all',
  mage: 'none',
  specialist: 'none',
  cleric: 'all',
  druid: 'none', // Typically wooden shields only, simplified to none
  thief: 'none',
  bard: 'none'
};

/**
 * Roll starting gold for a class
 */
export function rollStartingGold(classGroup) {
  const config = startingGold[classGroup];
  if (!config) return { gold: 0, dice: [], diceFormula: '' };

  // Parse dice notation (e.g., "5d4" or "1d4+1")
  const match = config.dice.match(/(\d+)d(\d+)(?:\+(\d+))?/);
  if (!match) return { gold: 0, dice: [], diceFormula: '' };

  const numDice = parseInt(match[1]);
  const dieSize = parseInt(match[2]);
  const bonus = parseInt(match[3] || 0);

  const rolls = [];
  let total = bonus;
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * dieSize) + 1;
    rolls.push(roll);
    total += roll;
  }

  return {
    gold: total * config.multiplier,
    dice: rolls,
    diceFormula: config.dice,
    dieSize,
    bonus,
    multiplier: config.multiplier
  };
}

/**
 * Get allowed armor for a class
 */
export function getAllowedArmor(classKey) {
  const restriction = armorRestrictions[classKey];
  if (restriction === 'all') return equipment.armor;
  if (restriction === 'none') return [];
  if (Array.isArray(restriction)) {
    return equipment.armor.filter(a => restriction.includes(a.key));
  }
  return [];
}

/**
 * Get allowed shields for a class
 */
export function getAllowedShields(classKey) {
  const restriction = shieldRestrictions[classKey];
  if (restriction === 'all') return equipment.shields;
  if (restriction === 'none') return [];
  if (Array.isArray(restriction)) {
    return equipment.shields.filter(s => restriction.includes(s.key));
  }
  return [];
}

/**
 * Calculate total cost in copper pieces
 */
export function calculateTotalCost(items) {
  return items.reduce((sum, item) => sum + toCopper(item.price), 0);
}

/**
 * Convert copper to gold (for display)
 */
export function copperToGold(copper) {
  return copper / 100;
}

/**
 * Convert a price object to gold pieces (mixed denomination aware).
 * @param {{ gp?: number, sp?: number, cp?: number }} price
 * @returns {number} value in gp
 */
export function priceToGp(price) {
  return ((price.gp || 0) * 100 + (price.sp || 0) * 10 + (price.cp || 0)) / 100;
}

/**
 * Filter weapons list to only those matching given proficiency keys.
 * @param {string[]} profKeys - array of weapon keys the character is proficient with
 * @returns {Array} matching weapon objects
 */
export function getWeaponsForProficiencies(profKeys) {
  return equipment.weapons.filter(w => profKeys.includes(w.key));
}

/**
 * Calculate total weight
 */
export function calculateTotalWeight(items) {
  return items.reduce((sum, item) => sum + (item.weight || 0), 0);
}

/**
 * Get allowed armor for a class with kit restrictions
 */
export function getAllowedArmorWithKit(classKey, kit = null) {
  // If kit specifies allowed armor, use that instead of class default
  if (kit?.equipmentMods?.allowedArmor !== undefined && kit.equipmentMods.allowedArmor !== null) {
    if (Array.isArray(kit.equipmentMods.allowedArmor)) {
      return equipment.armor.filter(a => kit.equipmentMods.allowedArmor.includes(a.key));
    } else if (kit.equipmentMods.allowedArmor === 'all') {
      return equipment.armor;
    } else if (kit.equipmentMods.allowedArmor === 'none') {
      return [];
    }
  }

  // Otherwise use class default
  return getAllowedArmor(classKey);
}

/**
 * Get allowed shields for a class with kit restrictions
 */
export function getAllowedShieldsWithKit(classKey, kit = null) {
  // If kit restricts armor to light, usually shields are also restricted
  if (kit?.equipmentMods?.allowedArmor) {
    const armorList = kit.equipmentMods.allowedArmor;
    // If kit only allows light armor (leather/studded), likely no shields
    if (Array.isArray(armorList) &&
        armorList.length > 0 &&
        armorList.every(a => ['leather', 'studdedLeather'].includes(a))) {
      return []; // No shields for very light armor kits
    }
  }

  // Otherwise use class default
  return getAllowedShields(classKey);
}

/**
 * Roll starting gold with kit modifications
 */
export function rollStartingGoldWithKit(classGroup, kit = null) {
  const result = rollStartingGold(classGroup);

  // Apply kit gold modifier
  if (kit?.equipmentMods?.startingGoldMod) {
    result.gold += kit.equipmentMods.startingGoldMod;
    // Don't let it go below 0
    if (result.gold < 0) result.gold = 0;
  }

  return result;
}

/**
 * Check if a weapon is restricted by kit equipment mods
 */
export function isWeaponRestrictedByKitEquipment(weaponKey, kit = null) {
  return kit?.equipmentMods?.restrictedWeapons?.includes(weaponKey) || false;
}
