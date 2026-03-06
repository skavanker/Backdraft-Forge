/**
 * NPC Generator - Main Orchestrator
 *
 * Generates NPCs by reusing existing character creation logic (65+ pure functions).
 * Supports quick/detailed modes, archetypes, and weighted equipment packages.
 */

import { rollDie, rollDice, rollAbilityDice, calculate4d6DropLowest, calculate3d6, rollExceptionalStrength } from '../dice.js';
import { calcTotalHP } from '../utils/hpUtils.js';
import { races, getAvailableRaces, applyRacialAdjustments } from '../../data/races.js';
import { classes, getAvailableClasses } from '../../data/classes.js';
import { generateCharacterName } from './nameGenerator.js';
import { names } from '../../data/names.js';
import { ALIGNMENT_NAMES } from '../../data/alignment.js';
import { getStrengthModifiers, getConstitutionModifiers, getDexterityModifiers, getBaseTHAC0, getSavingThrows } from '../../data/mechanics.js';
import { weaponProficiencySlots, nonWeaponProficiencySlots, weapons } from '../../data/proficiencies.js';
import { startingGold } from '../../data/equipment.js';
import { generateWeightedEquipment } from './equipmentPackages.js';
import { getArchetype } from './npcArchetypes.js';
import { pick, randomInt } from '../utils/randomUtils.js';

/**
 * Generate ability scores based on method
 * @param {string} method - '4d6' | '3d6' | 'average'
 * @returns {Object} { abilities, rollData, exceptionalStr }
 */
function generateAbilities(method = '4d6') {
  const rollData = rollAbilityDice(); // Roll 6 sets of 4d6
  const abilities = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
  let exceptionalStr = null;

  const abilityKeys = Object.keys(abilities);

  if (method === 'average') {
    // Average scores (10-11 for each)
    abilityKeys.forEach(key => {
      abilities[key] = randomInt(10, 11);
    });
  } else if (method === '3d6') {
    // Use 3d6 method (first 3 dice)
    rollData.forEach((dice, i) => {
      const result = calculate3d6(dice);
      abilities[abilityKeys[i]] = result.total;
    });
  } else {
    // Use 4d6 drop lowest (default)
    rollData.forEach((dice, i) => {
      const result = calculate4d6DropLowest(dice);
      abilities[abilityKeys[i]] = result.total;
    });
  }

  return { abilities, rollData, exceptionalStr };
}

/**
 * Select race (random or specific)
 * @param {Object} abilities - Base ability scores
 * @param {string} raceKey - Specific race key or null for random
 * @returns {Object} { raceKey, race, adjustedAbilities }
 */
function selectRace(abilities, raceKey = null) {
  if (raceKey && races[raceKey]) {
    // Use specified race
    const race = races[raceKey];
    const adjustedAbilities = applyRacialAdjustments(abilities, race);
    return { raceKey, race, adjustedAbilities };
  }

  // Random race from qualified options
  const availableRaces = getAvailableRaces(abilities, { lenient: true });
  const qualified = availableRaces.filter(r => r.qualified);

  if (qualified.length === 0) {
    // Fallback to human if no races qualify
    const race = races.human;
    return {
      raceKey: 'human',
      race,
      adjustedAbilities: applyRacialAdjustments(abilities, race)
    };
  }

  const selected = pick(qualified);
  return {
    raceKey: selected.key,
    race: selected.race,
    adjustedAbilities: applyRacialAdjustments(abilities, selected.race)
  };
}

/**
 * Select class (random or specific)
 * @param {Object} adjustedAbilities - Race-adjusted ability scores
 * @param {Object} race - Race object
 * @param {string} raceKey - Race key
 * @param {string} classKey - Specific class key or null for random
 * @returns {Object} { classKey, cls, levelLimit, wizardSchool }
 */
function selectClass(adjustedAbilities, race, raceKey, classKey = null) {
  const availableClasses = getAvailableClasses(adjustedAbilities, race, raceKey, { lenient: true });

  if (classKey && classes[classKey]) {
    // Use specified class
    const classData = availableClasses.find(c => c.key === classKey);
    if (classData) {
      return {
        classKey,
        cls: classData.cls,
        levelLimit: classData.levelLimit,
        wizardSchool: null
      };
    }
  }

  // Random class from qualified options
  const qualified = availableClasses.filter(c => c.qualified);

  if (qualified.length === 0) {
    // Fallback to fighter if no classes qualify
    const cls = classes.fighter;
    return {
      classKey: 'fighter',
      cls,
      levelLimit: race.classes.fighter || null,
      wizardSchool: null
    };
  }

  const selected = pick(qualified);
  return {
    classKey: selected.key,
    cls: selected.cls,
    levelLimit: selected.levelLimit,
    wizardSchool: null
  };
}

/**
 * Roll HP for NPC
 * @param {string} hitDie - e.g. 'd8', 'd10'
 * @param {number} level - Character level
 * @param {number} con - CON score
 * @param {string} classGroup - warrior/wizard/priest/rogue
 * @returns {Object} { hpHistory, totalHP }
 */
function rollNPCHP(hitDie, level, con, classGroup) {
  const hpHistory = [];
  const conMods = getConstitutionModifiers(con, classGroup);
  const dieSize = parseInt(hitDie.substring(1));

  for (let i = 0; i < level; i++) {
    const roll = i === 0 ? dieSize : rollDie(dieSize); // Max HP at level 1
    const bonus = conMods.hpAdj;
    const total = Math.max(1, roll + bonus);

    hpHistory.push({
      level: i + 1,
      roll,
      conBonus: bonus,
      total
    });
  }

  return { hpHistory, totalHP: calcTotalHP(hpHistory, hitDie, conMods.hpAdj) };
}

/**
 * Generate proficiencies (quick or detailed mode)
 * @param {string} classKey - Class key
 * @param {string} classGroup - warrior/wizard/priest/rogue
 * @param {number} level - Character level
 * @param {string} mode - 'quick' | 'detailed'
 * @returns {Object} { weapons, nonWeapon }
 */
function generateProficiencies(classKey, classGroup, level, mode = 'quick') {
  // Calculate slots
  const weaponSlots = weaponProficiencySlots[classGroup];
  const totalWeaponSlots = weaponSlots.initial + Math.floor((level - 1) / weaponSlots.perLevel);

  const nonWeaponSlots = nonWeaponProficiencySlots[classGroup];
  const totalNonWeaponSlots = nonWeaponSlots.initial + Math.floor((level - 1) / nonWeaponSlots.perLevel);

  if (mode === 'quick') {
    // Quick mode: Auto-select 1-2 weapon proficiencies
    const weaponCount = Math.min(totalWeaponSlots, 2);
    const selectedWeapons = [];

    // Get allowed weapons for class
    const allowedWeapons = Object.values(weapons);

    for (let i = 0; i < weaponCount; i++) {
      const weapon = pick(allowedWeapons);
      if (!selectedWeapons.includes(weapon.key)) {
        selectedWeapons.push(weapon.key);
      }
    }

    return {
      weapons: selectedWeapons,
      nonWeapon: [], // Skip non-weapon in quick mode
      weaponSlots: totalWeaponSlots,
      nonWeaponSlots: totalNonWeaponSlots
    };
  } else {
    // Detailed mode: Generate full proficiencies
    // For now, use same as quick mode - can be expanded later
    return generateProficiencies(classKey, classGroup, level, 'quick');
  }
}

/**
 * Roll starting gold for class
 * @param {string} classGroup - warrior/wizard/priest/rogue
 * @param {number} wealthModifier - Multiplier for archetype wealth (default 1.0)
 * @returns {number} Starting gold in gp
 */
function rollStartingGold(classGroup, wealthModifier = 1.0) {
  const goldData = startingGold[classGroup] || startingGold.warrior;

  // Parse dice string (e.g. "5d4" or "1d4+1")
  const match = goldData.dice.match(/(\d+)d(\d+)(?:\+(\d+))?/);
  if (!match) return 50; // Fallback

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const bonus = match[3] ? parseInt(match[3]) : 0;

  const rolls = rollDice(count, sides);
  const total = rolls.reduce((a, b) => a + b, 0) + bonus;
  const gold = total * goldData.multiplier * wealthModifier;

  return Math.floor(gold);
}

/**
 * Generate random alignment
 * @returns {number} Alignment number (0-8)
 */
function generateRandomAlignment() {
  return randomInt(0, 8);
}

/**
 * Generate random sex
 * @returns {string} 'Male' | 'Female'
 */
function generateRandomSex() {
  return Math.random() < 0.5 ? 'Male' : 'Female';
}

/**
 * Generate NPC spells for caster classes
 * @param {string} classKey - Class key
 * @param {Object} adjustedAbilities - Adjusted ability scores
 * @param {number} level - Character level
 * @returns {Object|null} Spell data or null for non-casters
 */
function generateNPCSpells(classKey, adjustedAbilities, level) {
  // Simplified spell generation - can be expanded later
  if (classKey === 'mage' || classKey === 'specialist') {
    return {
      spellbook: [], // Empty for now
      memorized: []
    };
  }

  if (classKey === 'cleric' || classKey === 'druid') {
    return {
      memorized: []
    };
  }

  return null;
}

/**
 * Generate a single NPC
 * @param {Object} options - Generation options
 * @returns {Object} NPC character object
 */
export function generateNPC(options = {}) {
  const {
    method = '4d6',          // '4d6' | '3d6' | 'average'
    mode = 'quick',          // 'quick' | 'detailed'
    levelMin = 1,
    levelMax = 1,
    raceKey = null,          // null = random
    classKey = null,         // null = random
    archetypeKey = null      // null = none
  } = options;

  // ARCHETYPE SYSTEM: Archetypes provide quick NPC templates (merchant, guard, noble, etc.)
  // They override base options to create thematic NPCs without manual configuration.
  // Example: "merchant" archetype → sets class to rogue, level 3-7, wealth 2.0x
  // This allows "generate a merchant" instead of configuring race/class/level/wealth separately.
  let effectiveLevelMin = levelMin;
  let effectiveLevelMax = levelMax;
  let effectiveClassKey = classKey;
  let effectiveRaceKey = raceKey;
  let wealthModifier = 1.0; // 1.0 = normal starting gold, 2.0 = double, 0.5 = half

  if (archetypeKey) {
    const archetype = getArchetype(archetypeKey);
    if (archetype) {
      // Override class, level range, and wealth from archetype template
      effectiveClassKey = archetype.classKey; // e.g., 'rogue' for merchant
      effectiveLevelMin = archetype.levelRange[0]; // e.g., 3 for experienced merchant
      effectiveLevelMax = archetype.levelRange[1]; // e.g., 7 for veteran merchant
      wealthModifier = archetype.wealthModifier || 1.0; // e.g., 2.0 for wealthy merchant
    }
  }

  // 1. Generate abilities
  const { abilities, rollData, exceptionalStr: baseExceptionalStr } = generateAbilities(method);

  // 2. Select race
  const { raceKey: selectedRaceKey, race, adjustedAbilities } = selectRace(abilities, effectiveRaceKey);

  // 3. Check for exceptional strength
  let exceptionalStr = baseExceptionalStr;
  if (adjustedAbilities.STR === 18 && (effectiveClassKey === 'fighter' || effectiveClassKey === 'ranger' || effectiveClassKey === 'paladin')) {
    exceptionalStr = rollExceptionalStrength();
  }

  // 4. Select class
  const { classKey: selectedClassKey, cls, levelLimit, wizardSchool } = selectClass(
    adjustedAbilities,
    race,
    selectedRaceKey,
    effectiveClassKey
  );

  // 5. Determine level
  const level = randomInt(effectiveLevelMin, effectiveLevelMax);

  // 6. Roll HP
  const { hpHistory, totalHP } = rollNPCHP(cls.hitDie, level, adjustedAbilities.CON, cls.group);

  // 7. Calculate combat stats
  const thac0 = getBaseTHAC0(cls.group, level);
  const saves = getSavingThrows(cls.group, level);

  // 8. Generate proficiencies
  const proficiencies = generateProficiencies(selectedClassKey, cls.group, level, mode);

  // 9. Roll starting gold
  const gold = rollStartingGold(cls.group, wealthModifier);

  // 10. Generate equipment
  const equipment = generateWeightedEquipment(cls.group, gold, proficiencies.weapons);

  // 11. Generate spells if caster
  const spells = generateNPCSpells(selectedClassKey, adjustedAbilities, level);

  // 12. Generate name, sex, alignment
  const sex = generateRandomSex();
  const nameResult = generateCharacterName(names, {
    race: selectedRaceKey,
    gender: sex,
    class: selectedClassKey,
    settlement: 'random',
    geography: 'random',
    socialClass: 'random',
    style: 'random'
  });
  const name = nameResult.name;
  const alignment = generateRandomAlignment();

  // 13. Return NPC object
  return {
    type: 'npc',
    id: Date.now() + Math.random(), // Unique ID
    name,
    sex,
    alignment,
    alignmentName: ALIGNMENT_NAMES[alignment],

    // Abilities
    abilities,
    rollData,
    adjustedAbilities,
    exceptionalStr,

    // Race & Class
    raceKey: selectedRaceKey,
    race,
    classKey: selectedClassKey,
    cls,
    levelLimit,
    wizardSchool,

    // Level & XP
    level,
    xp: 0,

    // HP
    hpHistory,
    currentHP: totalHP,
    maxHP: totalHP,

    // Combat stats
    thac0,
    saves,

    // Proficiencies
    proficiencies,

    // Equipment
    equipment,
    gold: equipment.goldRemaining || gold,

    // Spells
    spells,

    // Metadata
    archetype: archetypeKey || null,
    generationMethod: method,
    generationMode: mode,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate multiple NPCs
 * @param {number} count - Number of NPCs to generate
 * @param {Object} options - Generation options
 * @returns {Array} Array of NPC objects
 */
export function generateBulkNPCs(count, options) {
  return Array.from({ length: count }, () => generateNPC(options));
}
