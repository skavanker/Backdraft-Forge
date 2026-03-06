/**
 * Treasure Generator for AD&D 2nd Edition
 * Generates treasure hoards based on treasure types (A-O)
 */

import { rollDie, rollDice } from '../dice.js';
import { treasureTypes, gemTypes, artObjectTypes, commonMagicItems, getRandomMundaneItem } from '../../data/treasure.js';
import { pick } from '../utils/randomUtils.js';

/**
 * Parse and roll dice string (e.g., "1d6×1000", "2d4×100")
 * @param {string} diceStr - Dice string to parse
 * @returns {number} Result
 */
function rollDiceString(diceStr) {
  const match = diceStr.match(/(\d+)d(\d+)(?:×(\d+))?/);
  if (!match) return 0;

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const multiplier = match[3] ? parseInt(match[3]) : 1;

  const rolls = rollDice(count, sides);
  const sum = rolls.reduce((a, b) => a + b, 0);

  return sum * multiplier;
}

/**
 * Check if treasure component appears based on percentage chance
 * @param {number} chance - Percentage chance (0-100)
 * @returns {boolean}
 */
function rollChance(chance) {
  return Math.random() * 100 < chance;
}

/**
 * Generate coins for a treasure type
 * @param {Object} treasureType - Treasure type object
 * @returns {Object} Coin amounts
 */
function generateCoins(treasureType) {
  const coins = {
    copper: 0,
    silver: 0,
    electrum: 0,
    gold: 0,
    platinum: 0
  };

  const coinTypes = ['copper', 'silver', 'electrum', 'gold', 'platinum'];

  coinTypes.forEach(coinType => {
    const coinData = treasureType[coinType];
    if (coinData && rollChance(coinData.chance)) {
      coins[coinType] = rollDiceString(coinData.amount);
    }
  });

  return coins;
}

/**
 * Generate a random gem
 * @returns {Object} Gem object { type, value, description }
 */
export function generateGem() {
  // Determine gem tier (weighted toward lower values)
  const roll = rollDie(100);
  let tier;

  if (roll <= 25) tier = 'ornamental';
  else if (roll <= 50) tier = 'semiprecious';
  else if (roll <= 70) tier = 'fancy';
  else if (roll <= 90) tier = 'precious';
  else if (roll <= 95) tier = 'gem';
  else tier = 'jewel';

  const gemData = gemTypes[tier];
  const description = pick(gemData.types);

  // Add some value variance (±25%)
  const variance = 0.75 + Math.random() * 0.5;
  const value = Math.round(gemData.value * variance);

  return {
    type: tier,
    baseValue: gemData.value,
    value,
    description
  };
}

/**
 * Generate gems for treasure
 * @param {Object} treasureType - Treasure type object
 * @returns {Array} Array of gem objects
 */
function generateGems(treasureType) {
  const gemsData = treasureType.gems;
  if (!gemsData || !rollChance(gemsData.chance)) {
    return [];
  }

  const count = rollDiceString(gemsData.amount);
  const gems = [];

  for (let i = 0; i < count; i++) {
    gems.push(generateGem());
  }

  return gems;
}

/**
 * Generate a random art object
 * @returns {Object} Art object { tier, value, description, weight }
 */
export function generateArtObject() {
  // Determine art tier (weighted toward lower values)
  const roll = rollDie(100);
  let tier;

  if (roll <= 40) tier = 'minor';
  else if (roll <= 70) tier = 'medium';
  else if (roll <= 90) tier = 'major';
  else tier = 'masterwork';

  const artData = artObjectTypes[tier];
  const description = pick(artData.types);

  // Random value within tier range
  const [min, max] = artData.valueRange;
  const value = min + Math.floor(Math.random() * (max - min + 1));

  // Random weight (1-3 lbs)
  const weight = 1 + Math.floor(Math.random() * 3);

  return {
    tier,
    value,
    description,
    weight
  };
}

/**
 * Generate art objects for treasure
 * @param {Object} treasureType - Treasure type object
 * @returns {Array} Array of art objects
 */
function generateArtObjects(treasureType) {
  const artData = treasureType.art;
  if (!artData || !rollChance(artData.chance)) {
    return [];
  }

  const count = rollDiceString(artData.amount);
  const artObjects = [];

  for (let i = 0; i < count; i++) {
    artObjects.push(generateArtObject());
  }

  return artObjects;
}

/**
 * Generate magic items for treasure (simplified)
 * @param {Object} treasureType - Treasure type object
 * @returns {Array} Array of magic item names
 */
function generateMagicItems(treasureType) {
  const magicData = treasureType.magic;
  if (!magicData || !rollChance(magicData.chance)) {
    return [];
  }

  // Parse amount (e.g., "3 any", "1 sword, armor, or weapon")
  const amountMatch = magicData.amount.match(/(\d+)/);
  const count = amountMatch ? parseInt(amountMatch[1]) : 1;

  const magicItems = [];

  for (let i = 0; i < count; i++) {
    magicItems.push(pick(commonMagicItems));
  }

  return magicItems;
}

/**
 * Calculate total treasure value in gold pieces
 * @param {Object} hoard - Treasure hoard object
 * @returns {number} Total value in gp
 */
function calculateTotalValue(hoard) {
  let total = 0;

  // Coins (convert to gp)
  total += hoard.coins.copper / 100;
  total += hoard.coins.silver / 10;
  total += hoard.coins.electrum / 2;
  total += hoard.coins.gold;
  total += hoard.coins.platinum * 5;

  // Gems
  total += hoard.gems.reduce((sum, gem) => sum + gem.value, 0);

  // Art objects
  total += hoard.artObjects.reduce((sum, art) => sum + art.value, 0);

  // Magic items (estimated at 1000 gp each for now)
  total += hoard.magicItems.length * 1000;

  return Math.round(total);
}

/**
 * Calculate total weight of treasure in pounds
 * AD&D 2E: 10 coins = 1 lb (PHB p.66)
 * @param {Object} hoard - Treasure hoard object
 * @returns {number} Total weight in lbs
 */
function calculateTotalWeight(hoard) {
  let weight = 0;

  // Coins: 10 coins = 1 lb
  const totalCoins =
    hoard.coins.copper +
    hoard.coins.silver +
    hoard.coins.electrum +
    hoard.coins.gold +
    hoard.coins.platinum;
  weight += totalCoins / 10;

  // Gems: negligible weight (0.01 lb each)
  weight += hoard.gems.length * 0.01;

  // Art objects: use generated weight
  hoard.artObjects.forEach(art => {
    weight += art.weight || 2; // Fallback to 2 lbs if weight missing
  });

  // Magic items: estimate 2 lbs each
  weight += hoard.magicItems.length * 2;

  return Math.round(weight);
}

/**
 * Generate a treasure hoard
 * @param {string} typeKey - Treasure type key (A-O)
 * @param {string} source - Optional source description
 * @returns {Object} Treasure hoard
 */
export function generateTreasure(typeKey = 'B', source = null) {
  const treasureType = treasureTypes[typeKey];

  if (!treasureType) {
    throw new Error(`Invalid treasure type: ${typeKey}`);
  }

  const coins = generateCoins(treasureType);
  const gems = generateGems(treasureType);
  const artObjects = generateArtObjects(treasureType);
  const magicItems = generateMagicItems(treasureType);

  const hoard = {
    id: Date.now() + Math.random(),
    type: typeKey,
    typeName: treasureType.name,
    source: source || `Treasure Type ${typeKey}`,
    coins,
    gems,
    artObjects,
    magicItems,
    createdAt: new Date().toISOString()
  };

  hoard.totalValue = calculateTotalValue(hoard);
  hoard.totalWeight = calculateTotalWeight(hoard);

  return hoard;
}

/**
 * Generate multiple treasure hoards
 * @param {number} count - Number of hoards to generate
 * @param {string} typeKey - Treasure type key
 * @param {string} source - Optional source description
 * @returns {Array} Array of treasure hoards
 */
export function generateBulkTreasure(count, typeKey, source = null) {
  return Array.from({ length: count }, () => generateTreasure(typeKey, source));
}

/**
 * Generate treasure by CR/monster level (simplified)
 * @param {number} cr - Challenge rating or monster level
 * @returns {Object} Treasure hoard
 */
export function generateTreasureByLevel(cr) {
  // Map CR to treasure type
  let typeKey;

  if (cr <= 1) typeKey = 'J'; // Coin only
  else if (cr <= 3) typeKey = 'C'; // Small treasure
  else if (cr <= 5) typeKey = 'D'; // Small with less magic
  else if (cr <= 7) typeKey = 'B'; // Average
  else if (cr <= 10) typeKey = 'E'; // Small with potions
  else if (cr <= 15) typeKey = 'F'; // Large with less magic
  else if (cr <= 20) typeKey = 'G'; // Very large with magic
  else typeKey = 'H'; // Very large with scrolls

  return generateTreasure(typeKey, `CR ${cr} encounter`);
}

/**
 * Generate a random magic item
 * @returns {string} Magic item name
 */
export function generateMagicItem() {
  return pick(commonMagicItems);
}

/**
 * Generate a random mundane item
 * @returns {string} Mundane item description
 */
export function generateMundaneItem() {
  return getRandomMundaneItem();
}

/**
 * Generate single items
 * @param {string} itemType - 'gem' | 'art' | 'magic' | 'mundane'
 * @param {number} count - Number of items to generate
 * @returns {Object} Items object
 */
export function generateSingleItems(itemType, count = 1) {
  const items = [];

  for (let i = 0; i < count; i++) {
    switch (itemType) {
      case 'gem':
        items.push(generateGem());
        break;
      case 'art':
        items.push(generateArtObject());
        break;
      case 'magic':
        items.push({ name: generateMagicItem() });
        break;
      case 'mundane':
        items.push({ description: generateMundaneItem() });
        break;
    }
  }

  return {
    id: Date.now() + Math.random(),
    type: itemType,
    items,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate treasure hoard worth approximately a target value
 * @param {number} targetValue - Target value in gold pieces
 * @param {string} source - Optional source description
 * @returns {Object} Treasure hoard
 */
export function generateTreasureByValue(targetValue, source = null) {
  const coins = { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 };
  const gems = [];
  const artObjects = [];
  const magicItems = [];

  let totalValue = 0;

  // Decide on coin mix (40-60% of total as coins)
  const coinPercentage = 0.4 + Math.random() * 0.2; // 40-60%
  const coinValue = Math.floor(targetValue * coinPercentage);

  // Distribute coin value across different denominations
  let coinRemaining = coinValue;

  // Most in gold
  const goldAmount = Math.floor(coinRemaining * 0.7);
  coins.gold = goldAmount;
  coinRemaining -= goldAmount;

  // Some in silver
  if (coinRemaining > 0) {
    const silverValue = Math.floor(coinRemaining * 0.7);
    coins.silver = silverValue * 10; // Convert gp to sp
    coinRemaining -= silverValue;
  }

  // Leftover in copper
  if (coinRemaining > 0) {
    coins.copper = Math.round(coinRemaining * 100); // Convert gp to cp
  }

  totalValue += coinValue;

  // Fill remainder with gems and art
  const remainingBudget = targetValue - totalValue;

  // Use gems for smaller amounts, art for larger
  if (remainingBudget > 0) {
    if (remainingBudget < 100) {
      // Small amount - use mostly gems
      let gemValue = 0;
      while (gemValue < remainingBudget && gems.length < 20) {
        const gem = generateGem();
        // Only add if it doesn't overshoot by too much
        if (gemValue + gem.value <= remainingBudget * 1.2) {
          gems.push(gem);
          gemValue += gem.value;
        }
        // Stop if we're close enough
        if (gemValue >= remainingBudget * 0.9) break;
      }
      totalValue += gemValue;
    } else {
      // Larger amount - mix of gems and art
      const gemBudget = Math.floor(remainingBudget * 0.4);
      const artBudget = remainingBudget - gemBudget;

      // Generate gems
      let gemValue = 0;
      while (gemValue < gemBudget && gems.length < 15) {
        const gem = generateGem();
        if (gemValue + gem.value <= gemBudget * 1.2) {
          gems.push(gem);
          gemValue += gem.value;
        }
        if (gemValue >= gemBudget * 0.8) break;
      }
      totalValue += gemValue;

      // Generate art objects
      let artValue = 0;
      while (artValue < artBudget && artObjects.length < 10) {
        const art = generateArtObject();
        if (artValue + art.value <= artBudget * 1.3) {
          artObjects.push(art);
          artValue += art.value;
        }
        if (artValue >= artBudget * 0.8) break;
      }
      totalValue += artValue;
    }
  }

  const hoard = {
    id: Date.now() + Math.random(),
    type: 'value-based',
    typeName: `Value-based (${targetValue} gp target)`,
    source: source || `Value-based treasure (${targetValue} gp)`,
    coins,
    gems,
    artObjects,
    magicItems,
    createdAt: new Date().toISOString()
  };

  hoard.totalValue = calculateTotalValue(hoard);
  hoard.totalWeight = calculateTotalWeight(hoard);

  return hoard;
}
