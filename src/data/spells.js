/**
 * AD&D 2nd Edition Spell Data
 * Level 1 spells for starting characters
 */

// Wizard spells (1st level)
export const wizardSpells = [
  { key: 'alarm', name: 'Alarm', school: 'Abjuration', description: 'Alerts caster to intruders in a 20ft radius' },
  { key: 'armorSpell', name: 'Armor', school: 'Conjuration', description: 'Creates magical armor, AC 6' },
  { key: 'audibleGlamer', name: 'Audible Glamer', school: 'Illusion', description: 'Creates illusory sounds' },
  { key: 'burningHands', name: 'Burning Hands', school: 'Alteration', description: '1d3+2/level fire damage in a cone' },
  { key: 'charmPerson', name: 'Charm Person', school: 'Enchantment', description: 'Makes one person friendly' },
  { key: 'chillTouch', name: 'Chill Touch', school: 'Necromancy', description: 'Touch deals 1d4 damage, disrupts undead' },
  { key: 'colorSpray', name: 'Color Spray', school: 'Illusion', description: 'Blinds, stuns, or knocks out weak creatures' },
  { key: 'comprehendLanguages', name: 'Comprehend Languages', school: 'Alteration', description: 'Understand spoken/written language' },
  { key: 'detectMagic', name: 'Detect Magic', school: 'Divination', description: 'Detects magical auras' },
  { key: 'enlargeReduce', name: 'Enlarge/Reduce', school: 'Alteration', description: 'Increases or decreases size' },
  { key: 'featherFall', name: 'Feather Fall', school: 'Alteration', description: 'Slows falling to safe speed' },
  { key: 'findFamiliar', name: 'Find Familiar', school: 'Conjuration', description: 'Summons a magical familiar' },
  { key: 'friendsSpell', name: 'Friends', school: 'Enchantment', description: '+2d4 Charisma temporarily' },
  { key: 'grease', name: 'Grease', school: 'Conjuration', description: 'Makes area slippery' },
  { key: 'holdPortal', name: 'Hold Portal', school: 'Alteration', description: 'Magically holds a door shut' },
  { key: 'hypnotism', name: 'Hypnotism', school: 'Enchantment', description: 'Fascinates 1d6 creatures' },
  { key: 'identify', name: 'Identify', school: 'Divination', description: 'Reveals magical properties of an item' },
  { key: 'jump', name: 'Jump', school: 'Alteration', description: 'Grants leaping ability' },
  { key: 'lightSpell', name: 'Light', school: 'Alteration', description: 'Creates a 20ft radius light' },
  { key: 'magicMissile', name: 'Magic Missile', school: 'Invocation', description: 'Unerring missiles deal 1d4+1 each' },
  { key: 'mount', name: 'Mount', school: 'Conjuration', description: 'Summons a riding horse' },
  { key: 'phantasmalForce', name: 'Phantasmal Force', school: 'Illusion', description: 'Creates visual illusion' },
  { key: 'protectionFromEvil', name: 'Protection from Evil', school: 'Abjuration', description: '+2 AC/saves vs evil' },
  { key: 'readMagic', name: 'Read Magic', school: 'Divination', description: 'Read magical writings', required: true },
  { key: 'shieldSpell', name: 'Shield', school: 'Evocation', description: 'Creates invisible shield, AC 2 vs missiles' },
  { key: 'shockingGrasp', name: 'Shocking Grasp', school: 'Alteration', description: 'Touch deals 1d8+1/level electricity' },
  { key: 'sleep', name: 'Sleep', school: 'Enchantment', description: 'Puts 2d4 HD of creatures to sleep' },
  { key: 'spiderClimb', name: 'Spider Climb', school: 'Alteration', description: 'Walk on walls and ceilings' },
  { key: 'taunt', name: 'Taunt', school: 'Enchantment', description: 'Forces creature to attack caster' },
  { key: 'tensersFloatingDisc', name: "Tenser's Floating Disc", school: 'Evocation', description: 'Creates floating platform for cargo' },
  { key: 'unseenServant', name: 'Unseen Servant', school: 'Conjuration', description: 'Creates invisible force to serve' },
  { key: 'ventriloquism', name: 'Ventriloquism', school: 'Illusion', description: 'Throw voice to another location' },
  { key: 'wallOfFog', name: 'Wall of Fog', school: 'Evocation', description: 'Creates obscuring fog' },
  { key: 'wizardMark', name: 'Wizard Mark', school: 'Alteration', description: 'Inscribes personal rune' }
];

// Cleric spells (1st level)
export const clericSpells = [
  { key: 'bless', name: 'Bless', description: '+1 to hit and morale for allies' },
  { key: 'command', name: 'Command', description: 'One-word command must be obeyed' },
  { key: 'createWater', name: 'Create Water', description: 'Creates clean drinking water' },
  { key: 'cureLight', name: 'Cure Light Wounds', description: 'Heals 1d8 HP' },
  { key: 'detectEvil', name: 'Detect Evil', description: 'Reveals evil creatures/objects' },
  { key: 'detectMagicCleric', name: 'Detect Magic', description: 'Detects magical auras' },
  { key: 'detectPoison', name: 'Detect Poison', description: 'Reveals presence of poison' },
  { key: 'endureHeat', name: 'Endure Heat/Cold', description: 'Protection from temperature extremes' },
  { key: 'lightCleric', name: 'Light', description: 'Creates a 20ft radius light' },
  { key: 'protectionFromEvilCleric', name: 'Protection from Evil', description: '+2 AC/saves vs evil' },
  { key: 'purifyFood', name: 'Purify Food & Drink', description: 'Makes food/water safe to consume' },
  { key: 'removeFear', name: 'Remove Fear', description: 'Counters fear effects' },
  { key: 'sanctuary', name: 'Sanctuary', description: 'Attackers must save or choose new target' }
];

// Druid spells (1st level)
export const druidSpells = [
  { key: 'animalFriendship', name: 'Animal Friendship', description: 'Befriends an animal' },
  { key: 'blessDruid', name: 'Bless', description: '+1 to hit and morale for allies' },
  { key: 'detectMagicDruid', name: 'Detect Magic', description: 'Detects magical auras' },
  { key: 'detectSnares', name: 'Detect Snares & Pits', description: 'Reveals traps and pits' },
  { key: 'entangle', name: 'Entangle', description: 'Plants grab and hold creatures' },
  { key: 'faerieFire', name: 'Faerie Fire', description: 'Outlines creatures with light' },
  { key: 'invisibilityToAnimals', name: 'Invisibility to Animals', description: 'Animals cannot detect target' },
  { key: 'locate', name: 'Locate Animals or Plants', description: 'Finds nearby creatures/plants' },
  { key: 'passWithoutTrace', name: 'Pass Without Trace', description: 'Leaves no tracks' },
  { key: 'precipitate', name: 'Precipitate', description: 'Creates rain or snow' },
  { key: 'purifyWater', name: 'Purify Water', description: 'Makes water drinkable' },
  { key: 'shilelagh', name: 'Shillelagh', description: 'Club becomes +1 weapon' },
  { key: 'speakWithAnimals', name: 'Speak with Animals', description: 'Communicate with animals' }
];

// Specialist wizard school restrictions (opposition schools)
export const schoolOpposition = {
  abjurer: ['Alteration', 'Illusion'],
  conjurer: ['Divination', 'Invocation'],
  diviner: ['Conjuration'],
  enchanter: ['Invocation', 'Necromancy'],
  illusionist: ['Necromancy', 'Invocation', 'Abjuration'],
  invoker: ['Enchantment', 'Conjuration'],
  necromancer: ['Illusion', 'Enchantment'],
  transmuter: ['Abjuration', 'Necromancy']
};

/**
 * Get available wizard spells (filtered by school if specialist)
 */
export function getAvailableWizardSpells(schoolKey = null) {
  if (!schoolKey) {
    // Mage can learn all spells
    return wizardSpells;
  }

  // Specialist cannot learn opposition school spells
  const opposition = schoolOpposition[schoolKey] || [];
  return wizardSpells.filter(spell => !opposition.includes(spell.school));
}

/**
 * Get number of starting spells for a wizard
 * Based on INT and class
 */
export function getStartingSpellCount(intelligence) {
  // Per PHB, wizards start with Read Magic + several other spells
  // Number based on INT
  if (intelligence >= 19) return 9; // All 1st level spells
  if (intelligence >= 18) return 7;
  if (intelligence >= 17) return 6;
  if (intelligence >= 16) return 5;
  if (intelligence >= 15) return 4;
  if (intelligence >= 14) return 4;
  if (intelligence >= 13) return 3;
  if (intelligence >= 10) return 3;
  return 2;
}

/**
 * Get spells per day for a 1st level caster
 */
export function getSpellsPerDay(classKey, wisOrInt) {
  // Level 1 casters get 1 spell/day
  // High ability score can grant bonus spells for divine casters
  const base = 1;

  if (['cleric', 'druid'].includes(classKey)) {
    // Divine casters get bonus spells from high WIS
    if (wisOrInt >= 17) return base + 2;
    if (wisOrInt >= 15) return base + 1;
    if (wisOrInt >= 13) return base + 1;
  }

  return base;
}

/**
 * Check if a class is a spellcaster at level 1
 */
export function isSpellcaster(classKey) {
  return ['mage', 'specialist', 'cleric', 'druid'].includes(classKey);
  // Bard gets spells at level 2, Ranger at 8, Paladin at 9
}

/**
 * Get spell list for a class
 */
export function getSpellList(classKey) {
  switch (classKey) {
    case 'mage':
    case 'specialist':
      return wizardSpells;
    case 'cleric':
      return clericSpells;
    case 'druid':
      return druidSpells;
    default:
      return [];
  }
}
