/**
 * AD&D 2nd Edition Proficiency Data
 *
 * Weapon proficiencies: Number of slots and allowed weapons by class
 * Non-weapon proficiencies: Skills with ability checks
 *
 * `groups` — all class groups that can take this at native cost (base slots)
 * `slots`  — base slot cost when taken from a native group; cross-group adds +1
 */

import { weaponDefinitions } from './weapons.js';

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

// Weapons now imported from unified weapon definitions (weapons.js)
export const weapons = weaponDefinitions;

// Priest allowed weapons (blunt only, plus some exceptions)
export const priestWeapons = ['club', 'mace', 'morningstar', 'flail', 'warhammer', 'staff', 'sling'];

// Druid allowed weapons
export const druidWeapons = ['club', 'dagger', 'dart', 'sling', 'staff', 'spear', 'javelin', 'scimitar'];

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

// Class groups with native (base-cost) access — PHB crossover table
const classNativeGroups = {
  warrior: ['warrior', 'general'],
  wizard:  ['wizard',  'general'],
  priest:  ['priest',  'general'],
  rogue:   ['rogue',   'general'],
};

// Non-weapon proficiencies (PHB core only)
// groups: all groups that can take this at native (base) cost
// slots:  base slot cost for native groups; cross-group = slots + 1
export const nonWeaponProficiencies = {

  // ── GENERAL ──────────────────────────────────────────────────────────────
  agriculture:     { name: 'Agriculture',       ability: 'INT', modifier:  0, slots: 1, groups: ['general'], description: 'Grow crops and manage farmland' },
  animalHandling:  { name: 'Animal Handling',   ability: 'WIS', modifier: -1, slots: 1, groups: ['general'], description: 'Care for and calm animals' },
  animalTraining:  { name: 'Animal Training',   ability: 'WIS', modifier:  0, slots: 1, groups: ['general'], description: 'Train animals for specific purposes' },
  artisticAbility: { name: 'Artistic Ability',  ability: 'WIS', modifier:  0, slots: 1, groups: ['general'], description: 'Create art and recognize artistic styles' },
  blacksmithing:   { name: 'Blacksmithing',     ability: 'STR', modifier:  0, slots: 1, groups: ['general'], description: 'Work iron and steel into useful items' },
  brewing:         { name: 'Brewing',           ability: 'INT', modifier:  0, slots: 1, groups: ['general'], description: 'Brew beer, ale, and other beverages' },
  carpentry:       { name: 'Carpentry',         ability: 'STR', modifier:  0, slots: 1, groups: ['general'], description: 'Build and repair wooden structures' },
  cobbling:        { name: 'Cobbling',          ability: 'DEX', modifier:  0, slots: 1, groups: ['general'], description: 'Make and repair shoes and boots' },
  cooking:         { name: 'Cooking',           ability: 'INT', modifier:  0, slots: 1, groups: ['general'], description: 'Prepare food and identify ingredients' },
  dancing:         { name: 'Dancing',           ability: 'DEX', modifier:  0, slots: 1, groups: ['general'], description: 'Perform dances of various styles' },
  direction:       { name: 'Direction Sense',   ability: 'WIS', modifier:  1, slots: 1, groups: ['general'], description: 'Determine direction and avoid getting lost' },
  etiquette:       { name: 'Etiquette',         ability: 'CHA', modifier:  0, slots: 1, groups: ['general'], description: 'Know proper manners for various social situations' },
  fireBuilding:    { name: 'Fire Building',     ability: 'WIS', modifier: -1, slots: 1, groups: ['general'], description: 'Start fires in various conditions' },
  fishing:         { name: 'Fishing',           ability: 'WIS', modifier: -1, slots: 1, groups: ['general'], description: 'Catch fish with basic equipment' },
  heraldry:        { name: 'Heraldry',          ability: 'INT', modifier:  0, slots: 1, groups: ['general'], description: 'Recognize coats of arms and noble houses' },
  languages:       { name: 'Languages, Modern', ability: 'INT', modifier:  0, slots: 1, groups: ['general'], description: 'Speak an additional modern language' },
  leatherworking:  { name: 'Leatherworking',    ability: 'INT', modifier:  0, slots: 1, groups: ['general'], description: 'Tan hides and craft leather goods' },
  mining:          { name: 'Mining',            ability: 'WIS', modifier: -3, slots: 2, groups: ['general'], description: 'Find ore veins and work underground safely' },
  pottery:         { name: 'Pottery',           ability: 'DEX', modifier: -2, slots: 1, groups: ['general'], description: 'Shape and fire clay vessels' },
  ridingAirborne:  { name: 'Riding, Airborne',  ability: 'WIS', modifier: -2, slots: 2, groups: ['general'], description: 'Ride flying mounts such as pegasi and griffons' },
  riding:          { name: 'Riding, Land',      ability: 'WIS', modifier:  3, slots: 1, groups: ['general'], description: 'Ride horses and similar mounts' },
  rope:            { name: 'Rope Use',          ability: 'DEX', modifier:  0, slots: 1, groups: ['general'], description: 'Tie knots and use ropes effectively' },
  seamanship:      { name: 'Seamanship',        ability: 'DEX', modifier:  1, slots: 1, groups: ['general'], description: 'Sail and work aboard ships' },
  seamstress:      { name: 'Seamstress/Tailor', ability: 'DEX', modifier: -1, slots: 1, groups: ['general'], description: 'Sew clothing and work with fabrics' },
  singing:         { name: 'Singing',           ability: 'CHA', modifier:  0, slots: 1, groups: ['general'], description: 'Sing well and carry a tune' },
  stonemasonry:    { name: 'Stonemasonry',      ability: 'STR', modifier: -2, slots: 1, groups: ['general'], description: 'Cut and lay stone for construction' },
  swimming:        { name: 'Swimming',          ability: 'STR', modifier:  0, slots: 1, groups: ['general'], description: 'Swim and stay afloat' },
  weather:         { name: 'Weather Sense',     ability: 'WIS', modifier: -1, slots: 1, groups: ['general'], description: 'Predict weather patterns' },
  weaving:         { name: 'Weaving',           ability: 'INT', modifier: -1, slots: 1, groups: ['general'], description: 'Weave cloth and work with looms' },

  // ── WARRIOR-NATIVE ───────────────────────────────────────────────────────
  animalLore:      { name: 'Animal Lore',       ability: 'INT', modifier:  0, slots: 1, groups: ['warrior'], description: 'Identify animals and understand their behavior' },
  armorer:         { name: 'Armorer',           ability: 'INT', modifier: -2, slots: 2, groups: ['warrior'], description: 'Make and repair armor' },
  bowyer:          { name: 'Bowyer/Fletcher',   ability: 'DEX', modifier: -1, slots: 1, groups: ['warrior'], description: 'Make bows and arrows' },
  charioteering:   { name: 'Charioteering',     ability: 'DEX', modifier:  2, slots: 1, groups: ['warrior'], description: 'Drive and fight from chariots' },
  mountaineering:  { name: 'Mountaineering',    ability: 'NA',  modifier:  0, slots: 1, groups: ['warrior'], description: 'Climb mountains and cliffs safely' },
  running:         { name: 'Running',           ability: 'CON', modifier: -6, slots: 1, groups: ['warrior'], description: 'Run long distances without tiring' },
  weaponsmithing:  { name: 'Weaponsmithing',    ability: 'INT', modifier: -3, slots: 3, groups: ['warrior'], description: 'Make and repair weapons' },

  // ── MULTI-GROUP ──────────────────────────────────────────────────────────
  ancientHistory:  { name: 'Ancient History',   ability: 'INT', modifier: -1, slots: 1, groups: ['wizard', 'priest', 'rogue'], description: 'Knowledge of ancient civilizations and events' },
  astrology:       { name: 'Astrology',         ability: 'INT', modifier:  0, slots: 2, groups: ['wizard', 'priest', 'rogue'], description: 'Read stars and predict events' },
  blindFighting:   { name: 'Blind-Fighting',    ability: 'NA',  modifier:  0, slots: 2, groups: ['warrior', 'rogue'],          description: 'Fight effectively without sight' },
  endurance:       { name: 'Endurance',         ability: 'CON', modifier:  0, slots: 2, groups: ['warrior', 'rogue'],          description: 'Perform strenuous activity for longer' },
  engineering:     { name: 'Engineering',       ability: 'INT', modifier: -3, slots: 2, groups: ['wizard', 'priest'],          description: 'Design and build structures' },
  gaming:          { name: 'Gaming',            ability: 'CHA', modifier:  0, slots: 1, groups: ['warrior', 'rogue'],          description: 'Play and win at games of chance and skill' },
  gemCutting:      { name: 'Gem Cutting',       ability: 'DEX', modifier: -2, slots: 2, groups: ['wizard', 'rogue'],           description: 'Cut and polish gemstones' },
  healing:         { name: 'Healing',           ability: 'WIS', modifier: -2, slots: 2, groups: ['priest'],                   description: 'Treat wounds and illness without magic' },
  herbalism:       { name: 'Herbalism',         ability: 'INT', modifier: -2, slots: 2, groups: ['priest', 'wizard', 'rogue'], description: 'Identify and use medicinal plants' },
  hunting:         { name: 'Hunting',           ability: 'WIS', modifier: -1, slots: 1, groups: ['warrior', 'rogue'],          description: 'Track and hunt wild game' },
  jumping:         { name: 'Jumping',           ability: 'STR', modifier:  0, slots: 1, groups: ['rogue'],                    description: 'Leap farther and higher than normal' },
  ancientLanguages:{ name: 'Languages, Ancient',ability: 'INT', modifier:  0, slots: 1, groups: ['wizard', 'priest'],          description: 'Read dead languages and ancient scripts' },
  localHistory:    { name: 'Local History',     ability: 'CHA', modifier:  0, slots: 1, groups: ['priest', 'rogue'],           description: 'Knowledge of local events and notable people' },
  musicalInstrument:{ name: 'Musical Instrument',ability: 'DEX',modifier: -1, slots: 1, groups: ['priest', 'rogue'],           description: 'Play a specific instrument' },
  navigation:      { name: 'Navigation',        ability: 'INT', modifier: -2, slots: 1, groups: ['warrior', 'wizard', 'priest', 'rogue'], description: 'Navigate by stars and landmarks' },
  readingLips:     { name: 'Reading Lips',      ability: 'INT', modifier: -2, slots: 2, groups: ['rogue'],                    description: 'Understand speech by watching lips' },
  readWrite:       { name: 'Reading/Writing',   ability: 'INT', modifier:  1, slots: 1, groups: ['wizard', 'priest', 'rogue'], description: 'Read and write known languages' },
  religion:        { name: 'Religion',          ability: 'WIS', modifier:  0, slots: 1, groups: ['wizard', 'priest'],          description: 'Knowledge of religious practices and deities' },
  setSnares:       { name: 'Set Snares',        ability: 'DEX', modifier: -1, slots: 1, groups: ['warrior', 'rogue'],          description: 'Set traps and snares for game or enemies' },
  spellcraft:      { name: 'Spellcraft',        ability: 'INT', modifier: -2, slots: 1, groups: ['wizard', 'priest'],          description: 'Identify spells and magical effects' },
  survival:        { name: 'Survival',          ability: 'INT', modifier:  0, slots: 2, groups: ['warrior', 'rogue'],          description: 'Survive in wilderness environments' },
  tightropeWalk:   { name: 'Tightrope Walking', ability: 'DEX', modifier:  0, slots: 1, groups: ['rogue'],                    description: 'Walk on narrow surfaces without falling' },
  tracking:        { name: 'Tracking',          ability: 'WIS', modifier:  0, slots: 2, groups: ['warrior', 'rogue'],          description: 'Follow tracks and trails' },
  tumbling:        { name: 'Tumbling',          ability: 'DEX', modifier:  0, slots: 1, groups: ['rogue'],                    description: 'Acrobatic rolls, falls, and flips' },
  ventriloquism:   { name: 'Ventriloquism',     ability: 'INT', modifier: -2, slots: 1, groups: ['rogue'],                    description: 'Throw voice convincingly' },

  // ── ROGUE-NATIVE ─────────────────────────────────────────────────────────
  appraisal:       { name: 'Appraising',        ability: 'INT', modifier:  0, slots: 1, groups: ['rogue'], description: 'Determine the value of items' },
  disguise:        { name: 'Disguise',          ability: 'CHA', modifier: -1, slots: 1, groups: ['rogue'], description: 'Alter appearance convincingly' },
  forgery:         { name: 'Forgery',           ability: 'DEX', modifier: -1, slots: 1, groups: ['rogue'], description: 'Create false documents' },
  juggling:        { name: 'Juggling',          ability: 'DEX', modifier: -1, slots: 1, groups: ['rogue'], description: 'Perform feats of dexterity with objects' },
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
      return Object.keys(weapons);
  }
}

/**
 * Get the slot cost for a class to take a proficiency.
 * Native group = base slots. Cross-group = base slots + 1.
 */
export function getProficiencyCost(classGroup, profGroups, slots = 1) {
  const native = classNativeGroups[classGroup] ?? ['general'];
  const isNative = profGroups.some(g => native.includes(g));
  return isNative ? slots : slots + 1;
}

/**
 * Get all non-weapon proficiencies with cost info for a class.
 * Each proficiency includes a `displayGroups` array so the UI can
 * show it in every section it natively belongs to.
 */
export function getAvailableProficiencies(classGroup) {
  return Object.entries(nonWeaponProficiencies).map(([key, prof]) => ({
    key,
    ...prof,
    cost: getProficiencyCost(classGroup, prof.groups, prof.slots),
  }));
}

/**
 * Get weapon proficiency slots with kit modifications
 */
export function getWeaponSlotsWithKit(classGroup, level = 1, kit = null) {
  let slots = getWeaponSlots(classGroup, level);
  if (kit?.proficiencyMods?.weaponBonus) slots += kit.proficiencyMods.weaponBonus;
  return slots;
}

/**
 * Get non-weapon proficiency slots with kit modifications
 */
export function getNonWeaponSlotsWithKit(classGroup, intelligence, level = 1, kit = null) {
  let slots = getNonWeaponSlots(classGroup, intelligence, level);
  if (kit?.proficiencyMods?.nonWeaponBonus) slots += kit.proficiencyMods.nonWeaponBonus;
  return slots;
}

/**
 * Get allowed weapons for a class with kit restrictions
 */
export function getAllowedWeaponsWithKit(classKey, kit = null) {
  let allowed = getAllowedWeapons(classKey);
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
