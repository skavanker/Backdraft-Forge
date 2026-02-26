/**
 * AD&D 2nd Edition Proficiency Data
 *
 * Weapon proficiencies: Number of slots and allowed weapons by class
 * Non-weapon proficiencies: Skills with ability checks
 */

// Weapon proficiency slots by class group
export const weaponProficiencySlots = {
  warrior: { initial: 4, perLevel: 3 },  // +1 every 3 levels
  wizard: { initial: 1, perLevel: 6 },   // +1 every 6 levels
  priest: { initial: 2, perLevel: 4 },   // +1 every 4 levels
  rogue: { initial: 2, perLevel: 4 }     // +1 every 4 levels
};

// Non-weapon proficiency slots by class group
export const nonWeaponProficiencySlots = {
  warrior: { initial: 3, perLevel: 3 },
  wizard: { initial: 4, perLevel: 3 },
  priest: { initial: 4, perLevel: 3 },
  rogue: { initial: 3, perLevel: 4 }
};

// Weapons available - grouped by type
export const weapons = {
  // Simple weapons
  club: { name: 'Club', damage: '1d6', type: 'B', speed: 4, group: 'simple' },
  dagger: { name: 'Dagger', damage: '1d4', type: 'P', speed: 2, group: 'simple' },
  dart: { name: 'Dart', damage: '1d3', type: 'P', speed: 2, group: 'simple', ranged: true },
  sling: { name: 'Sling', damage: '1d4', type: 'B', speed: 6, group: 'simple', ranged: true },
  staff: { name: 'Staff/Quarterstaff', damage: '1d6', type: 'B', speed: 4, group: 'simple' },

  // Swords
  shortSword: { name: 'Short Sword', damage: '1d6', type: 'P', speed: 3, group: 'sword' },
  longSword: { name: 'Long Sword', damage: '1d8', type: 'S', speed: 5, group: 'sword' },
  broadsword: { name: 'Broadsword', damage: '2d4', type: 'S', speed: 5, group: 'sword' },
  bastardSword: { name: 'Bastard Sword', damage: '1d8/1d10', type: 'S', speed: 6, group: 'sword' },
  twoHandedSword: { name: 'Two-Handed Sword', damage: '1d10', type: 'S', speed: 10, group: 'sword' },
  scimitar: { name: 'Scimitar', damage: '1d8', type: 'S', speed: 5, group: 'sword' },

  // Axes
  handAxe: { name: 'Hand Axe', damage: '1d6', type: 'S', speed: 4, group: 'axe' },
  battleAxe: { name: 'Battle Axe', damage: '1d8', type: 'S', speed: 7, group: 'axe' },
  greatAxe: { name: 'Great Axe', damage: '1d10', type: 'S', speed: 9, group: 'axe' },

  // Blunt
  mace: { name: 'Mace', damage: '1d6+1', type: 'B', speed: 7, group: 'blunt' },
  morningstar: { name: 'Morning Star', damage: '2d4', type: 'B/P', speed: 7, group: 'blunt' },
  flail: { name: 'Flail', damage: '1d6+1', type: 'B', speed: 7, group: 'blunt' },
  warhammer: { name: 'Warhammer', damage: '1d4+1', type: 'B', speed: 4, group: 'blunt' },

  // Polearms
  spear: { name: 'Spear', damage: '1d6', type: 'P', speed: 6, group: 'polearm' },
  halberd: { name: 'Halberd', damage: '1d10', type: 'P/S', speed: 9, group: 'polearm' },
  pike: { name: 'Pike', damage: '1d6', type: 'P', speed: 13, group: 'polearm' },
  trident: { name: 'Trident', damage: '1d6+1', type: 'P', speed: 7, group: 'polearm' },

  // Ranged
  shortBow: { name: 'Short Bow', damage: '1d6', type: 'P', speed: 7, group: 'bow', ranged: true },
  longBow: { name: 'Long Bow', damage: '1d8', type: 'P', speed: 8, group: 'bow', ranged: true },
  compositeBow: { name: 'Composite Bow', damage: '1d8', type: 'P', speed: 7, group: 'bow', ranged: true },
  lightCrossbow: { name: 'Light Crossbow', damage: '1d4', type: 'P', speed: 7, group: 'crossbow', ranged: true },
  heavyCrossbow: { name: 'Heavy Crossbow', damage: '1d4+1', type: 'P', speed: 10, group: 'crossbow', ranged: true }
};

// Priest allowed weapons (blunt only, plus some exceptions)
export const priestWeapons = ['club', 'mace', 'morningstar', 'flail', 'warhammer', 'staff', 'sling'];

// Druid allowed weapons
export const druidWeapons = ['club', 'dagger', 'dart', 'sling', 'staff', 'spear', 'scimitar'];

// Wizard allowed weapons
export const wizardWeapons = ['dagger', 'dart', 'staff', 'sling'];

// Thief allowed weapons
export const thiefWeapons = ['club', 'dagger', 'dart', 'sling', 'shortSword', 'longSword', 'shortBow'];

// Non-weapon proficiency categories
export const proficiencyGroups = {
  general: 'General',
  warrior: 'Warrior',
  wizard: 'Wizard',
  priest: 'Priest',
  rogue: 'Rogue'
};

// Class group access to proficiency groups (cost in slots)
export const proficiencyAccess = {
  warrior: { general: 1, warrior: 1, wizard: 3, priest: 3, rogue: 2 },
  wizard: { general: 1, warrior: 3, wizard: 1, priest: 3, rogue: 2 },
  priest: { general: 1, warrior: 3, wizard: 3, priest: 1, rogue: 2 },
  rogue: { general: 1, warrior: 2, wizard: 2, priest: 2, rogue: 1 }
};

// Non-weapon proficiencies
export const nonWeaponProficiencies = {
  // General (all classes, 1 slot)
  animalHandling: { name: 'Animal Handling', ability: 'WIS', modifier: -1, group: 'general', description: 'Care for and train animals' },
  cooking: { name: 'Cooking', ability: 'INT', modifier: 0, group: 'general', description: 'Prepare food and identify ingredients' },
  direction: { name: 'Direction Sense', ability: 'WIS', modifier: 1, group: 'general', description: 'Determine direction and avoid getting lost' },
  fireBuilding: { name: 'Fire Building', ability: 'WIS', modifier: -1, group: 'general', description: 'Start fires in various conditions' },
  fishing: { name: 'Fishing', ability: 'WIS', modifier: -1, group: 'general', description: 'Catch fish with basic equipment' },
  heraldry: { name: 'Heraldry', ability: 'INT', modifier: 0, group: 'general', description: 'Recognize coats of arms and noble houses' },
  languages: { name: 'Languages, Modern', ability: 'INT', modifier: 0, group: 'general', description: 'Speak an additional language' },
  riding: { name: 'Riding, Land', ability: 'WIS', modifier: 3, group: 'general', description: 'Ride horses and similar mounts' },
  rope: { name: 'Rope Use', ability: 'DEX', modifier: 0, group: 'general', description: 'Tie knots and use ropes effectively' },
  singing: { name: 'Singing', ability: 'CHA', modifier: 0, group: 'general', description: 'Sing well and carry a tune' },
  swimming: { name: 'Swimming', ability: 'STR', modifier: 0, group: 'general', description: 'Swim and stay afloat' },
  weather: { name: 'Weather Sense', ability: 'WIS', modifier: -1, group: 'general', description: 'Predict weather patterns' },

  // Warrior
  animalTraining: { name: 'Animal Training', ability: 'WIS', modifier: 0, group: 'warrior', description: 'Train animals for specific purposes' },
  armorer: { name: 'Armorer', ability: 'INT', modifier: -2, group: 'warrior', description: 'Make and repair armor' },
  blindFighting: { name: 'Blind-Fighting', ability: 'NA', modifier: 0, group: 'warrior', description: 'Fight effectively without sight' },
  bowyer: { name: 'Bowyer/Fletcher', ability: 'DEX', modifier: -1, group: 'warrior', description: 'Make bows and arrows' },
  endurance: { name: 'Endurance', ability: 'CON', modifier: 0, group: 'warrior', description: 'Perform strenuous activity longer' },
  hunting: { name: 'Hunting', ability: 'WIS', modifier: -1, group: 'warrior', description: 'Track and hunt wild game' },
  mountaineering: { name: 'Mountaineering', ability: 'NA', modifier: 0, group: 'warrior', description: 'Climb mountains and cliffs safely' },
  navigation: { name: 'Navigation', ability: 'INT', modifier: -2, group: 'warrior', description: 'Navigate by stars and landmarks' },
  running: { name: 'Running', ability: 'CON', modifier: -6, group: 'warrior', description: 'Run long distances without tiring' },
  survival: { name: 'Survival', ability: 'INT', modifier: 0, group: 'warrior', description: 'Survive in wilderness environments' },
  tracking: { name: 'Tracking', ability: 'WIS', modifier: 0, group: 'warrior', description: 'Follow tracks and trails' },
  weaponsmithing: { name: 'Weaponsmithing', ability: 'INT', modifier: -3, group: 'warrior', description: 'Make and repair weapons' },

  // Wizard
  ancientHistory: { name: 'Ancient History', ability: 'INT', modifier: -1, group: 'wizard', description: 'Knowledge of ancient civilizations' },
  astrology: { name: 'Astrology', ability: 'INT', modifier: 0, group: 'wizard', description: 'Read stars and predict events' },
  engineering: { name: 'Engineering', ability: 'INT', modifier: -3, group: 'wizard', description: 'Design and build structures' },
  ancientLanguages: { name: 'Languages, Ancient', ability: 'INT', modifier: -1, group: 'wizard', description: 'Read dead languages' },
  readWrite: { name: 'Reading/Writing', ability: 'INT', modifier: 1, group: 'wizard', description: 'Read and write known languages' },
  religion: { name: 'Religion', ability: 'WIS', modifier: 0, group: 'wizard', description: 'Knowledge of religious practices' },
  spellcraft: { name: 'Spellcraft', ability: 'INT', modifier: -2, group: 'wizard', description: 'Identify spells and magical effects' },

  // Priest
  healing: { name: 'Healing', ability: 'WIS', modifier: -2, group: 'priest', description: 'Treat wounds and illness without magic' },
  herbalism: { name: 'Herbalism', ability: 'INT', modifier: -2, group: 'priest', description: 'Identify and use medicinal plants' },
  localHistory: { name: 'Local History', ability: 'CHA', modifier: 0, group: 'priest', description: 'Knowledge of local events and people' },
  musicalInstrument: { name: 'Musical Instrument', ability: 'DEX', modifier: -1, group: 'priest', description: 'Play a specific instrument' },

  // Rogue
  appraisal: { name: 'Appraising', ability: 'INT', modifier: 0, group: 'rogue', description: 'Determine value of items' },
  disguise: { name: 'Disguise', ability: 'CHA', modifier: -1, group: 'rogue', description: 'Alter appearance convincingly' },
  forgery: { name: 'Forgery', ability: 'DEX', modifier: -1, group: 'rogue', description: 'Create false documents' },
  gambling: { name: 'Gambling', ability: 'CHA', modifier: 0, group: 'rogue', description: 'Play and cheat at games of chance' },
  juggling: { name: 'Juggling', ability: 'DEX', modifier: -1, group: 'rogue', description: 'Perform feats of dexterity' },
  jumpTumble: { name: 'Jumping/Tumbling', ability: 'DEX', modifier: 0, group: 'rogue', description: 'Acrobatic feats and falls' },
  locksmithing: { name: 'Locksmithing', ability: 'DEX', modifier: 0, group: 'rogue', description: 'Make and repair locks' },
  tightropeWalk: { name: 'Tightrope Walking', ability: 'DEX', modifier: 0, group: 'rogue', description: 'Walk on narrow surfaces' },
  ventriloquism: { name: 'Ventriloquism', ability: 'INT', modifier: -2, group: 'rogue', description: 'Throw voice and create illusions' }
};

/**
 * Get weapon proficiency slots for a class at a given level
 */
export function getWeaponSlots(classGroup, level = 1) {
  const data = weaponProficiencySlots[classGroup];
  if (!data) return 2;
  const bonus = level > 1 ? Math.floor((level - 1) / data.perLevel) : 0;
  return data.initial + bonus;
}

/**
 * Get non-weapon proficiency slots for a class at a given level
 * Intelligence bonus adds extra slots
 */
export function getNonWeaponSlots(classGroup, intelligence, level = 1) {
  const data = nonWeaponProficiencySlots[classGroup];
  const base = data?.initial ?? 3;
  const bonus = level > 1 && data ? Math.floor((level - 1) / data.perLevel) : 0;
  // INT bonus: +1 slot per point over 15
  const intBonus = intelligence > 15 ? intelligence - 15 : 0;
  return base + bonus + intBonus;
}

/**
 * Get allowed weapons for a specific class
 */
export function getAllowedWeapons(classKey) {
  switch (classKey) {
    case 'cleric':
      return priestWeapons;
    case 'druid':
      return druidWeapons;
    case 'mage':
    case 'illusionist':
      return wizardWeapons;
    case 'thief':
      return thiefWeapons;
    default:
      // Warriors and bards can use any weapon
      return Object.keys(weapons);
  }
}

/**
 * Get the cost for a class to learn a proficiency from a group
 */
export function getProficiencyCost(classGroup, proficiencyGroup) {
  return proficiencyAccess[classGroup]?.[proficiencyGroup] ?? 2;
}

/**
 * Get all non-weapon proficiencies with cost info for a class
 */
export function getAvailableProficiencies(classGroup) {
  return Object.entries(nonWeaponProficiencies).map(([key, prof]) => ({
    key,
    ...prof,
    cost: getProficiencyCost(classGroup, prof.group)
  }));
}

/**
 * Get weapon proficiency slots with kit modifications
 */
export function getWeaponSlotsWithKit(classGroup, level = 1, kit = null) {
  let slots = getWeaponSlots(classGroup, level);

  if (kit?.proficiencyMods?.weaponBonus) {
    slots += kit.proficiencyMods.weaponBonus;
  }

  return slots;
}

/**
 * Get non-weapon proficiency slots with kit modifications
 */
export function getNonWeaponSlotsWithKit(classGroup, intelligence, level = 1, kit = null) {
  let slots = getNonWeaponSlots(classGroup, intelligence, level);

  if (kit?.proficiencyMods?.nonWeaponBonus) {
    slots += kit.proficiencyMods.nonWeaponBonus;
  }

  return slots;
}

/**
 * Get allowed weapons for a class with kit restrictions
 */
export function getAllowedWeaponsWithKit(classKey, kit = null) {
  let allowed = getAllowedWeapons(classKey);

  // If kit has restricted weapons, filter them out
  if (kit?.proficiencyMods?.restrictedWeapons?.length > 0) {
    allowed = allowed.filter(weaponKey => !kit.proficiencyMods.restrictedWeapons.includes(weaponKey));
  }

  return allowed;
}

/**
 * Get free weapon proficiencies granted by kit
 */
export function getKitFreeWeapons(kit = null) {
  return kit?.proficiencyMods?.freeWeapons || [];
}

/**
 * Get free non-weapon proficiencies granted by kit
 */
export function getKitFreeNonWeapon(kit = null) {
  return kit?.proficiencyMods?.freeNonWeapon || [];
}

/**
 * Check if a weapon is restricted by kit
 */
export function isWeaponRestrictedByKit(weaponKey, kit = null) {
  return kit?.proficiencyMods?.restrictedWeapons?.includes(weaponKey) || false;
}
