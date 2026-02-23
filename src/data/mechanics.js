/**
 * AD&D 2nd Edition Game Mechanics
 * All calculations based on Player's Handbook tables
 */

/**
 * Get Strength modifiers
 * PHB Table 1: Strength
 */
export function getStrengthModifiers(str, exceptionalStr = null) {
  // Exceptional strength for 18
  if (str === 18 && exceptionalStr) {
    if (exceptionalStr <= 50) {
      return { hitAdj: 1, dmgAdj: 3, weightAllow: 185, maxPress: 280, openDoors: 9, bendBars: 20 };
    } else if (exceptionalStr <= 75) {
      return { hitAdj: 2, dmgAdj: 3, weightAllow: 200, maxPress: 305, openDoors: 10, bendBars: 25 };
    } else if (exceptionalStr <= 90) {
      return { hitAdj: 2, dmgAdj: 4, weightAllow: 230, maxPress: 330, openDoors: 11, bendBars: 30 };
    } else if (exceptionalStr <= 99) {
      return { hitAdj: 2, dmgAdj: 5, weightAllow: 255, maxPress: 380, openDoors: 12, bendBars: 35 };
    } else {
      return { hitAdj: 3, dmgAdj: 6, weightAllow: 280, maxPress: 480, openDoors: 13, bendBars: 40 };
    }
  }

  const table = {
    3: { hitAdj: -3, dmgAdj: -1, weightAllow: 5, maxPress: 10, openDoors: 1, bendBars: 0 },
    4: { hitAdj: -2, dmgAdj: -1, weightAllow: 10, maxPress: 25, openDoors: 1, bendBars: 0 },
    5: { hitAdj: -2, dmgAdj: -1, weightAllow: 10, maxPress: 25, openDoors: 1, bendBars: 0 },
    6: { hitAdj: -1, dmgAdj: 0, weightAllow: 20, maxPress: 55, openDoors: 2, bendBars: 0 },
    7: { hitAdj: -1, dmgAdj: 0, weightAllow: 20, maxPress: 55, openDoors: 2, bendBars: 0 },
    8: { hitAdj: 0, dmgAdj: 0, weightAllow: 35, maxPress: 90, openDoors: 3, bendBars: 1 },
    9: { hitAdj: 0, dmgAdj: 0, weightAllow: 35, maxPress: 90, openDoors: 3, bendBars: 1 },
    10: { hitAdj: 0, dmgAdj: 0, weightAllow: 40, maxPress: 115, openDoors: 4, bendBars: 2 },
    11: { hitAdj: 0, dmgAdj: 0, weightAllow: 40, maxPress: 115, openDoors: 4, bendBars: 2 },
    12: { hitAdj: 0, dmgAdj: 0, weightAllow: 45, maxPress: 140, openDoors: 5, bendBars: 4 },
    13: { hitAdj: 0, dmgAdj: 0, weightAllow: 45, maxPress: 140, openDoors: 5, bendBars: 4 },
    14: { hitAdj: 0, dmgAdj: 0, weightAllow: 55, maxPress: 170, openDoors: 6, bendBars: 7 },
    15: { hitAdj: 0, dmgAdj: 0, weightAllow: 55, maxPress: 170, openDoors: 6, bendBars: 7 },
    16: { hitAdj: 0, dmgAdj: 1, weightAllow: 70, maxPress: 195, openDoors: 7, bendBars: 10 },
    17: { hitAdj: 1, dmgAdj: 1, weightAllow: 85, maxPress: 220, openDoors: 8, bendBars: 13 },
    18: { hitAdj: 1, dmgAdj: 2, weightAllow: 110, maxPress: 255, openDoors: 9, bendBars: 16 },
    19: { hitAdj: 3, dmgAdj: 7, weightAllow: 485, maxPress: 640, openDoors: 16, bendBars: 50 },
  };

  return table[str] || table[10];
}

/**
 * Get Dexterity modifiers
 * PHB Table 2: Dexterity
 */
export function getDexterityModifiers(dex) {
  const table = {
    3: { reactionAdj: -3, acAdj: 4, missileAdj: -3 },
    4: { reactionAdj: -2, acAdj: 3, missileAdj: -2 },
    5: { reactionAdj: -1, acAdj: 2, missileAdj: -1 },
    6: { reactionAdj: 0, acAdj: 1, missileAdj: 0 },
    7: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    8: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    9: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    10: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    11: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    12: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    13: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    14: { reactionAdj: 0, acAdj: 0, missileAdj: 0 },
    15: { reactionAdj: 0, acAdj: -1, missileAdj: 0 },
    16: { reactionAdj: 1, acAdj: -2, missileAdj: 1 },
    17: { reactionAdj: 2, acAdj: -3, missileAdj: 2 },
    18: { reactionAdj: 2, acAdj: -3, missileAdj: 2 },
    19: { reactionAdj: 3, acAdj: -4, missileAdj: 3 },
  };

  return table[dex] || table[10];
}

/**
 * Get Constitution modifiers
 * PHB Table 3: Constitution
 */
export function getConstitutionModifiers(con, classGroup = 'wizard') {
  const isWarrior = classGroup === 'warrior';

  const table = {
    3: { hpAdj: -2, systemShock: 35, resurrectionSurvival: 40 },
    4: { hpAdj: -1, systemShock: 40, resurrectionSurvival: 45 },
    5: { hpAdj: -1, systemShock: 45, resurrectionSurvival: 50 },
    6: { hpAdj: -1, systemShock: 50, resurrectionSurvival: 55 },
    7: { hpAdj: 0, systemShock: 55, resurrectionSurvival: 60 },
    8: { hpAdj: 0, systemShock: 60, resurrectionSurvival: 65 },
    9: { hpAdj: 0, systemShock: 65, resurrectionSurvival: 70 },
    10: { hpAdj: 0, systemShock: 70, resurrectionSurvival: 75 },
    11: { hpAdj: 0, systemShock: 75, resurrectionSurvival: 80 },
    12: { hpAdj: 0, systemShock: 80, resurrectionSurvival: 85 },
    13: { hpAdj: 0, systemShock: 85, resurrectionSurvival: 90 },
    14: { hpAdj: 0, systemShock: 88, resurrectionSurvival: 92 },
    15: { hpAdj: isWarrior ? 1 : 1, systemShock: 90, resurrectionSurvival: 94 },
    16: { hpAdj: isWarrior ? 2 : 2, systemShock: 95, resurrectionSurvival: 96 },
    17: { hpAdj: isWarrior ? 3 : 2, systemShock: 97, resurrectionSurvival: 98 },
    18: { hpAdj: isWarrior ? 4 : 2, systemShock: 99, resurrectionSurvival: 100 },
    19: { hpAdj: isWarrior ? 5 : 2, systemShock: 99, resurrectionSurvival: 100 },
  };

  return table[con] || table[10];
}

/**
 * Get Intelligence modifiers
 * PHB Table 4: Intelligence
 */
export function getIntelligenceModifiers(int) {
  const table = {
    3: { languages: 0, maxSpellLevel: 0, learnSpell: 0, maxSpellsPerLevel: 0 },
    4: { languages: 0, maxSpellLevel: 0, learnSpell: 0, maxSpellsPerLevel: 0 },
    5: { languages: 0, maxSpellLevel: 0, learnSpell: 0, maxSpellsPerLevel: 0 },
    6: { languages: 0, maxSpellLevel: 0, learnSpell: 0, maxSpellsPerLevel: 0 },
    7: { languages: 0, maxSpellLevel: 0, learnSpell: 0, maxSpellsPerLevel: 0 },
    8: { languages: 1, maxSpellLevel: 0, learnSpell: 0, maxSpellsPerLevel: 0 },
    9: { languages: 2, maxSpellLevel: 4, learnSpell: 35, maxSpellsPerLevel: 6 },
    10: { languages: 2, maxSpellLevel: 5, learnSpell: 40, maxSpellsPerLevel: 7 },
    11: { languages: 2, maxSpellLevel: 5, learnSpell: 45, maxSpellsPerLevel: 7 },
    12: { languages: 3, maxSpellLevel: 6, learnSpell: 45, maxSpellsPerLevel: 7 },
    13: { languages: 3, maxSpellLevel: 6, learnSpell: 55, maxSpellsPerLevel: 9 },
    14: { languages: 4, maxSpellLevel: 7, learnSpell: 60, maxSpellsPerLevel: 9 },
    15: { languages: 4, maxSpellLevel: 7, learnSpell: 65, maxSpellsPerLevel: 11 },
    16: { languages: 5, maxSpellLevel: 8, learnSpell: 70, maxSpellsPerLevel: 11 },
    17: { languages: 6, maxSpellLevel: 8, learnSpell: 75, maxSpellsPerLevel: 14 },
    18: { languages: 7, maxSpellLevel: 9, learnSpell: 85, maxSpellsPerLevel: 18 },
    19: { languages: 8, maxSpellLevel: 9, learnSpell: 95, maxSpellsPerLevel: 99 },
  };

  return table[int] || table[10];
}

/**
 * Get Wisdom modifiers
 * PHB Table 5: Wisdom
 */
export function getWisdomModifiers(wis) {
  const bonusSpells = {
    12: {},
    13: { 1: 1 },
    14: { 1: 2 },
    15: { 1: 2, 2: 1 },
    16: { 1: 2, 2: 2 },
    17: { 1: 2, 2: 2, 3: 1, 4: 1 },
    18: { 1: 2, 2: 2, 3: 1, 4: 1 },
    19: { 1: 3, 2: 2, 3: 2, 4: 1 },
  };

  const table = {
    3: { magicDefenseAdj: -3, bonusSpells: {}, spellFailure: 0 },
    4: { magicDefenseAdj: -2, bonusSpells: {}, spellFailure: 0 },
    5: { magicDefenseAdj: -1, bonusSpells: {}, spellFailure: 0 },
    6: { magicDefenseAdj: -1, bonusSpells: {}, spellFailure: 0 },
    7: { magicDefenseAdj: -1, bonusSpells: {}, spellFailure: 0 },
    8: { magicDefenseAdj: 0, bonusSpells: {}, spellFailure: 0 },
    9: { magicDefenseAdj: 0, bonusSpells: {}, spellFailure: 0 },
    10: { magicDefenseAdj: 0, bonusSpells: {}, spellFailure: 0 },
    11: { magicDefenseAdj: 0, bonusSpells: {}, spellFailure: 0 },
    12: { magicDefenseAdj: 0, bonusSpells: {}, spellFailure: 0 },
    13: { magicDefenseAdj: 0, bonusSpells: bonusSpells[13], spellFailure: 0 },
    14: { magicDefenseAdj: 0, bonusSpells: bonusSpells[14], spellFailure: 0 },
    15: { magicDefenseAdj: 1, bonusSpells: bonusSpells[15], spellFailure: 0 },
    16: { magicDefenseAdj: 2, bonusSpells: bonusSpells[16], spellFailure: 0 },
    17: { magicDefenseAdj: 3, bonusSpells: bonusSpells[17], spellFailure: 0 },
    18: { magicDefenseAdj: 4, bonusSpells: bonusSpells[18], spellFailure: 0 },
    19: { magicDefenseAdj: 4, bonusSpells: bonusSpells[19], spellFailure: 0 },
  };

  return table[wis] || table[10];
}

/**
 * Get Charisma modifiers
 * PHB Table 6: Charisma
 */
export function getCharismaModifiers(cha) {
  const table = {
    3: { maxHenchmen: 1, loyaltyBase: -5, reactionAdj: -5 },
    4: { maxHenchmen: 1, loyaltyBase: -4, reactionAdj: -4 },
    5: { maxHenchmen: 2, loyaltyBase: -3, reactionAdj: -3 },
    6: { maxHenchmen: 2, loyaltyBase: -2, reactionAdj: -2 },
    7: { maxHenchmen: 3, loyaltyBase: -1, reactionAdj: -1 },
    8: { maxHenchmen: 3, loyaltyBase: 0, reactionAdj: 0 },
    9: { maxHenchmen: 4, loyaltyBase: 0, reactionAdj: 0 },
    10: { maxHenchmen: 4, loyaltyBase: 0, reactionAdj: 0 },
    11: { maxHenchmen: 4, loyaltyBase: 0, reactionAdj: 0 },
    12: { maxHenchmen: 5, loyaltyBase: 0, reactionAdj: 0 },
    13: { maxHenchmen: 5, loyaltyBase: 0, reactionAdj: 1 },
    14: { maxHenchmen: 6, loyaltyBase: 1, reactionAdj: 2 },
    15: { maxHenchmen: 7, loyaltyBase: 3, reactionAdj: 3 },
    16: { maxHenchmen: 8, loyaltyBase: 4, reactionAdj: 5 },
    17: { maxHenchmen: 10, loyaltyBase: 6, reactionAdj: 6 },
    18: { maxHenchmen: 15, loyaltyBase: 8, reactionAdj: 7 },
    19: { maxHenchmen: 20, loyaltyBase: 10, reactionAdj: 8 },
  };

  return table[cha] || table[10];
}

/**
 * Get saving throws by class and level
 * PHB Table 60-63: Saving Throws
 */
export function getSavingThrows(classGroup, level = 1) {
  const tables = {
    warrior: {
      1: { paralysis: 14, rod: 16, petrification: 15, breath: 17, spell: 17 }
    },
    wizard: {
      1: { paralysis: 14, rod: 11, petrification: 13, breath: 15, spell: 12 }
    },
    priest: {
      1: { paralysis: 10, rod: 14, petrification: 13, breath: 16, spell: 15 }
    },
    rogue: {
      1: { paralysis: 13, rod: 14, petrification: 12, breath: 16, spell: 15 }
    }
  };

  return tables[classGroup]?.[level] || tables.warrior[1];
}

/**
 * Get base THAC0 by class and level
 * PHB Table 53-56: THAC0
 */
export function getBaseTHAC0(classGroup, level = 1) {
  // At level 1, all classes start with THAC0 20
  if (level === 1) return 20;

  // Warriors improve by 1 every level
  // Others improve by 1 every 2-3 levels
  const tables = {
    warrior: 20 - (level - 1),
    wizard: 20 - Math.floor((level - 1) / 3),
    priest: 20 - Math.floor((level - 1) / 3),
    rogue: 20 - Math.floor((level - 1) / 2)
  };

  return tables[classGroup] || 20;
}

/**
 * Format ability score modifier for display
 */
export function formatModifier(value) {
  if (value === 0) return '—';
  return value > 0 ? `+${value}` : `${value}`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value) {
  return `${value}%`;
}
