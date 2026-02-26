/**
 * AD&D 2nd Edition Priest Spells (Cleric + Druid unified)
 * All priest spells with sphere assignments per PHB
 */

export const priestSpells = [
  // ─── Level 1 ────────────────────────────────────────────
  { key: 'animalFriendship', name: 'Animal Friendship', level: 1, spheres: ['Animal'], description: 'Befriends an animal' },
  { key: 'bless', name: 'Bless', level: 1, spheres: ['All'], description: '+1 to hit and morale for allies' },
  { key: 'command', name: 'Command', level: 1, spheres: ['Charm'], description: 'One-word command must be obeyed' },
  { key: 'createWater', name: 'Create Water', level: 1, spheres: ['Elemental'], description: 'Creates clean drinking water' },
  { key: 'cureLight', name: 'Cure Light Wounds', level: 1, spheres: ['Healing'], description: 'Heals 1d8 HP' },
  { key: 'detectEvil', name: 'Detect Evil', level: 1, spheres: ['All'], description: 'Reveals evil creatures/objects' },
  { key: 'detectMagicCleric', name: 'Detect Magic', level: 1, spheres: ['Divination'], description: 'Detects magical auras' },
  { key: 'detectPoison', name: 'Detect Poison', level: 1, spheres: ['Divination'], description: 'Reveals presence of poison' },
  { key: 'detectSnares', name: 'Detect Snares & Pits', level: 1, spheres: ['Divination'], description: 'Reveals traps and pits' },
  { key: 'endureHeat', name: 'Endure Heat/Cold', level: 1, spheres: ['Protection'], description: 'Protection from temperature extremes' },
  { key: 'entangle', name: 'Entangle', level: 1, spheres: ['Plant'], description: 'Plants grab and hold creatures' },
  { key: 'faerieFire', name: 'Faerie Fire', level: 1, spheres: ['Weather'], description: 'Outlines creatures with light' },
  { key: 'invisibilityToAnimals', name: 'Invisibility to Animals', level: 1, spheres: ['Animal'], description: 'Animals cannot detect target' },
  { key: 'lightCleric', name: 'Light', level: 1, spheres: ['Sun'], description: 'Creates a 20ft radius light' },
  { key: 'locate', name: 'Locate Animals or Plants', level: 1, spheres: ['Animal', 'Plant'], description: 'Finds nearby creatures/plants' },
  { key: 'magicalStone', name: 'Magical Stone', level: 1, spheres: ['Combat'], description: 'Enchants 3 pebbles as +1 sling stones' },
  { key: 'passWithoutTrace', name: 'Pass Without Trace', level: 1, spheres: ['Plant'], description: 'Leaves no tracks' },
  { key: 'precipitate', name: 'Precipitate', level: 1, spheres: ['Weather'], description: 'Creates rain or snow' },
  { key: 'protectionFromEvilCleric', name: 'Protection from Evil', level: 1, spheres: ['Protection'], description: '+2 AC/saves vs evil' },
  { key: 'purifyFood', name: 'Purify Food & Drink', level: 1, spheres: ['All'], description: 'Makes food/water safe to consume' },
  { key: 'purifyWater', name: 'Purify Water', level: 1, spheres: ['Elemental'], description: 'Makes water drinkable' },
  { key: 'removeFear', name: 'Remove Fear', level: 1, spheres: ['Charm'], description: 'Counters fear effects' },
  { key: 'sanctuary', name: 'Sanctuary', level: 1, spheres: ['Protection'], description: 'Attackers must save or choose new target' },
  { key: 'shilelagh', name: 'Shillelagh', level: 1, spheres: ['Combat', 'Plant'], description: 'Club becomes +1 weapon' },
  { key: 'speakWithAnimals', name: 'Speak with Animals', level: 1, spheres: ['Animal'], description: 'Communicate with animals' },

  // ─── Level 2 ────────────────────────────────────────────
  { key: 'aid', name: 'Aid', level: 2, spheres: ['Necromantic'], description: '+1 to hit, +1d8 temporary HP' },
  { key: 'augury', name: 'Augury', level: 2, spheres: ['Divination'], description: 'Divines whether action is weal or woe' },
  { key: 'barkSkin', name: 'Barkskin', level: 2, spheres: ['Plant', 'Protection'], description: 'Grants AC bonus (AC 6 base)' },
  { key: 'chant', name: 'Chant', level: 2, spheres: ['Combat'], description: '+1/-1 to allies/enemies while chanting' },
  { key: 'charmPersonAnimal', name: 'Charm Person or Mammal', level: 2, spheres: ['Animal'], description: 'Charms person or animal' },
  { key: 'createWaterDruid', name: 'Create Water', level: 2, spheres: ['Elemental'], description: 'Creates water in natural settings' },
  { key: 'dustDevil', name: 'Dust Devil', level: 2, spheres: ['Elemental'], description: 'Summons minor air elemental' },
  { key: 'findTraps', name: 'Find Traps', level: 2, spheres: ['Divination'], description: 'Reveals nearby traps' },
  { key: 'fireTrap', name: 'Fire Trap', level: 2, spheres: ['Elemental'], description: 'Object explodes when opened' },
  { key: 'flameBlade', name: 'Flame Blade', level: 2, spheres: ['Elemental'], description: 'Creates sword-like beam of fire' },
  { key: 'goodberry', name: 'Goodberry', level: 2, spheres: ['Plant'], description: 'Makes 2d4 berries that heal 1 HP each' },
  { key: 'heatMetal', name: 'Heat Metal', level: 2, spheres: ['Elemental'], description: 'Metal becomes burning hot' },
  { key: 'holdPerson2', name: 'Hold Person', level: 2, spheres: ['Charm'], description: 'Paralyzes 1-4 humanoids' },
  { key: 'knowAlignment', name: 'Know Alignment', level: 2, spheres: ['Divination'], description: 'Reveals creature alignment' },
  { key: 'obscurement', name: 'Obscurement', level: 2, spheres: ['Weather'], description: 'Creates misty vapor' },
  { key: 'produceFlame', name: 'Produce Flame', level: 2, spheres: ['Elemental'], description: 'Creates flame for light or hurling' },
  { key: 'resistFire', name: 'Resist Fire/Cold', level: 2, spheres: ['Protection'], description: 'Resistance to fire or cold damage' },
  { key: 'silence15', name: "Silence, 15' Radius", level: 2, spheres: ['Guardian'], description: 'Creates zone of silence' },
  { key: 'slowPoison', name: 'Slow Poison', level: 2, spheres: ['Healing'], description: 'Slows effects of poison' },
  { key: 'speakWithAnimalsCleric', name: 'Speak with Animals', level: 2, spheres: ['Animal'], description: 'Communicate with animals' },
  { key: 'spiritualHammer', name: 'Spiritual Hammer', level: 2, spheres: ['Combat'], description: 'Creates floating magical hammer' },
  { key: 'warp', name: 'Warp Wood', level: 2, spheres: ['Plant'], description: 'Bends wood permanently' },
  { key: 'withdrawSpell', name: 'Withdraw', level: 2, spheres: ['Protection'], description: 'Caster enters meditative state, immune to disruption' },

  // ─── Level 3 ────────────────────────────────────────────
  { key: 'animateDead', name: 'Animate Dead', level: 3, spheres: ['Necromantic'], description: 'Creates undead skeletons/zombies' },
  { key: 'callLightning', name: 'Call Lightning', level: 3, spheres: ['Weather'], description: '2d8+1d8/level lightning from storms' },
  { key: 'continualLightCleric', name: 'Continual Light', level: 3, spheres: ['Sun'], description: 'Permanent light source' },
  { key: 'cureBlindness', name: 'Cure Blindness or Deafness', level: 3, spheres: ['Necromantic'], description: 'Cures blindness or deafness' },
  { key: 'cureDisease', name: 'Cure Disease', level: 3, spheres: ['Necromantic'], description: 'Cures all diseases' },
  { key: 'dispelMagicCleric', name: 'Dispel Magic', level: 3, spheres: ['Protection'], description: 'Cancels magical effects' },
  { key: 'glyph', name: 'Glyph of Warding', level: 3, spheres: ['Guardian'], description: 'Inscription damages those who pass' },
  { key: 'holdAnimal', name: 'Hold Animal', level: 3, spheres: ['Animal'], description: 'Paralyzes 1-4 animals' },
  { key: 'locateObject', name: 'Locate Object', level: 3, spheres: ['Divination'], description: 'Senses direction to object' },
  { key: 'magicalVestment', name: 'Magical Vestment', level: 3, spheres: ['Protection'], description: 'Vestment gains AC bonus' },
  { key: 'negativePlaneProt', name: 'Negative Plane Protection', level: 3, spheres: ['Necromantic', 'Protection'], description: 'Protection from energy drain' },
  { key: 'plantGrowth', name: 'Plant Growth', level: 3, spheres: ['Plant'], description: 'Makes plants grow thick and entangling' },
  { key: 'prayer', name: 'Prayer', level: 3, spheres: ['Combat'], description: '+1/-1 to allies/enemies on most rolls' },
  { key: 'protectionFromFire', name: 'Protection from Fire', level: 3, spheres: ['Elemental', 'Protection'], description: 'Immunity or resistance to fire' },
  { key: 'pyrotechnicsDruid', name: 'Pyrotechnics', level: 3, spheres: ['Elemental'], description: 'Turns fire into fireworks or smoke' },
  { key: 'removeParalysis', name: 'Remove Paralysis', level: 3, spheres: ['Protection'], description: 'Frees 1-4 creatures from paralysis' },
  { key: 'snareDruid', name: 'Snare', level: 3, spheres: ['Plant'], description: 'Creates magical snare trap' },
  { key: 'speakWithDead', name: 'Speak with Dead', level: 3, spheres: ['Necromantic'], description: 'Ask questions of a corpse' },
  { key: 'spikeGrowth', name: 'Spike Growth', level: 3, spheres: ['Plant'], description: 'Ground sprouts thorns, 1d4 dmg/10ft' },
  { key: 'starshine', name: 'Starshine', level: 3, spheres: ['Sun'], description: 'Soft illumination in area' },
  { key: 'stoneshape', name: 'Stone Shape', level: 3, spheres: ['Elemental'], description: 'Sculpts stone into any form' },
  { key: 'summonInsects', name: 'Summon Insects', level: 3, spheres: ['Animal'], description: 'Summons swarm of insects' },
  { key: 'treeSpell', name: 'Tree', level: 3, spheres: ['Plant'], description: 'Caster assumes tree form' },
  { key: 'waterBreathingDruid', name: 'Water Breathing', level: 3, spheres: ['Elemental'], description: 'Breathe underwater' },
  { key: 'waterWalk', name: 'Water Walk', level: 3, spheres: ['Elemental'], description: 'Walk on water surface' },

  // ─── Level 4 ────────────────────────────────────────────
  { key: 'abjure', name: 'Abjure', level: 4, spheres: ['Summoning'], description: 'Forces extraplanar creature to home plane' },
  { key: 'animalSummoning1', name: 'Animal Summoning I', level: 4, spheres: ['Animal', 'Summoning'], description: 'Summons up to 8 animals of 4 HD' },
  { key: 'callWoodlandBeings', name: 'Call Woodland Beings', level: 4, spheres: ['Animal', 'Summoning'], description: 'Summons woodland creatures to aid' },
  { key: 'cloak', name: 'Cloak of Bravery', level: 4, spheres: ['Charm'], description: 'Allies gain bonus vs fear' },
  { key: 'controlTemp', name: 'Control Temperature, 10\' Radius', level: 4, spheres: ['Weather'], description: 'Change temperature by up to 50 degrees' },
  { key: 'cureSeriousWounds', name: 'Cure Serious Wounds', level: 4, spheres: ['Healing'], description: 'Heals 2d8+1 HP' },
  { key: 'detectLie', name: 'Detect Lie', level: 4, spheres: ['Divination'], description: 'Know if target speaks truth' },
  { key: 'divination', name: 'Divination', level: 4, spheres: ['Divination'], description: 'Provides useful advice for action' },
  { key: 'freeAction', name: 'Free Action', level: 4, spheres: ['Charm'], description: 'Move and attack freely despite magic' },
  { key: 'giantInsect', name: 'Giant Insect', level: 4, spheres: ['Animal'], description: 'Grow insects to giant size' },
  { key: 'hallucinatoryForest', name: 'Hallucinatory Forest', level: 4, spheres: ['Plant'], description: 'Creates illusory forest' },
  { key: 'holdPlant', name: 'Hold Plant', level: 4, spheres: ['Plant'], description: 'Holds plant creatures in place' },
  { key: 'imbueWithSpellAbility', name: 'Imbue with Spell Ability', level: 4, spheres: ['Charm'], description: 'Transfer spells to non-caster' },
  { key: 'lowerWaterP', name: 'Lower Water', level: 4, spheres: ['Elemental'], description: 'Lowers body of water' },
  { key: 'neutralizePoison', name: 'Neutralize Poison', level: 4, spheres: ['Healing'], description: 'Detoxifies any venom or poison' },
  { key: 'plantDoor', name: 'Plant Door', level: 4, spheres: ['Plant'], description: 'Move through overgrown areas freely' },
  { key: 'produceFireP', name: 'Produce Fire', level: 4, spheres: ['Elemental'], description: 'Ignites flammable materials in area' },
  { key: 'protEvil10P', name: "Protection from Evil, 10' Radius", level: 4, spheres: ['Protection'], description: '+2 AC/saves vs evil in 10ft radius' },
  { key: 'protFromLightning', name: 'Protection from Lightning', level: 4, spheres: ['Protection', 'Weather'], description: 'Immunity or resistance to lightning' },
  { key: 'reflectingPool', name: 'Reflecting Pool', level: 4, spheres: ['Divination'], description: 'Scry through still water' },
  { key: 'repelInsects', name: 'Repel Insects', level: 4, spheres: ['Animal', 'Protection'], description: 'Keeps insects at bay' },
  { key: 'speakWithPlants', name: 'Speak with Plants', level: 4, spheres: ['Plant'], description: 'Communicate with vegetation' },
  { key: 'spellImmunity', name: 'Spell Immunity', level: 4, spheres: ['Protection'], description: 'Immune to one specific spell' },
  { key: 'sticksTSnakes', name: 'Sticks to Snakes', level: 4, spheres: ['Plant'], description: 'Turn sticks into snakes' },
  { key: 'tonguesP', name: 'Tongues', level: 4, spheres: ['Divination'], description: 'Speak and understand any language' },

  // ─── Level 5 ────────────────────────────────────────────
  { key: 'airWalk', name: 'Air Walk', level: 5, spheres: ['Elemental'], description: 'Walk on air as if solid ground' },
  { key: 'animalGrowthP', name: 'Animal Growth', level: 5, spheres: ['Animal'], description: 'Doubles animal size and HD' },
  { key: 'animalSummoning2', name: 'Animal Summoning II', level: 5, spheres: ['Animal', 'Summoning'], description: 'Summons up to 6 animals of 8 HD' },
  { key: 'antiPlantShell', name: 'Anti-Plant Shell', level: 5, spheres: ['Plant', 'Protection'], description: 'Repels plant creatures and growth' },
  { key: 'atonement', name: 'Atonement', level: 5, spheres: ['All'], description: 'Removes effects of alignment violation' },
  { key: 'commune', name: 'Commune', level: 5, spheres: ['Divination'], description: 'Ask deity yes/no questions' },
  { key: 'communeWithNature', name: 'Commune with Nature', level: 5, spheres: ['Divination', 'Elemental'], description: 'Learn about surrounding territory' },
  { key: 'controlWinds', name: 'Control Winds', level: 5, spheres: ['Weather'], description: 'Change wind force in area' },
  { key: 'cureCriticalWounds', name: 'Cure Critical Wounds', level: 5, spheres: ['Healing'], description: 'Heals 3d8+3 HP' },
  { key: 'dispelEvil', name: 'Dispel Evil', level: 5, spheres: ['Protection', 'Summoning'], description: 'Returns evil creatures to home plane' },
  { key: 'flameStrike', name: 'Flame Strike', level: 5, spheres: ['Combat'], description: 'Column of fire deals 6d8 damage' },
  { key: 'insectPlague', name: 'Insect Plague', level: 5, spheres: ['Combat'], description: 'Devastating swarm of insects' },
  { key: 'magicFont', name: 'Magic Font', level: 5, spheres: ['Divination'], description: 'Consecrate font for scrying' },
  { key: 'moonbeam', name: 'Moonbeam', level: 5, spheres: ['Sun'], description: 'Beam of moonlight illuminates and reveals' },
  { key: 'passPlant', name: 'Pass Plant', level: 5, spheres: ['Plant'], description: 'Teleport between trees' },
  { key: 'planeShiftP', name: 'Plane Shift', level: 5, spheres: ['Astral'], description: 'Travel to another plane of existence' },
  { key: 'questP', name: 'Quest', level: 5, spheres: ['Charm'], description: 'Compels creature to perform service' },
  { key: 'raiseDead', name: 'Raise Dead', level: 5, spheres: ['Necromantic'], description: 'Restores life to recently deceased' },
  { key: 'spike', name: 'Spike Stones', level: 5, spheres: ['Elemental'], description: 'Stone surfaces sprout sharp points' },
  { key: 'transmuteMudRock', name: 'Transmute Rock to Mud', level: 5, spheres: ['Elemental'], description: 'Turns rock to mud or reverse' },
  { key: 'trueSeeing5', name: 'True Seeing', level: 5, spheres: ['Divination'], description: 'See all things as they really are' },
  { key: 'wallOfFireP', name: 'Wall of Fire', level: 5, spheres: ['Elemental'], description: 'Immobile curtain of fire' },

  // ─── Level 6 ────────────────────────────────────────────
  { key: 'aerialServant', name: 'Aerial Servant', level: 6, spheres: ['Summoning'], description: 'Summons aerial servant to fetch object/creature' },
  { key: 'animalSummoning3', name: 'Animal Summoning III', level: 6, spheres: ['Animal', 'Summoning'], description: 'Summons up to 4 animals of 16 HD' },
  { key: 'antiAnimalShell', name: 'Anti-Animal Shell', level: 6, spheres: ['Animal', 'Protection'], description: 'Repels animal creatures' },
  { key: 'bladeBarrier', name: 'Blade Barrier', level: 6, spheres: ['Guardian', 'Creation'], description: 'Wall of spinning blades deals 8d8' },
  { key: 'conjureAnimals', name: 'Conjure Animals', level: 6, spheres: ['Animal', 'Summoning'], description: 'Summons animals to fight' },
  { key: 'conjureFireEl', name: 'Conjure Fire Elemental', level: 6, spheres: ['Elemental'], description: 'Summons fire elemental' },
  { key: 'findPath', name: 'Find the Path', level: 6, spheres: ['Divination'], description: 'Know shortest route to destination' },
  { key: 'fireSeed', name: 'Fire Seeds', level: 6, spheres: ['Elemental'], description: 'Acorns/berries become grenades' },
  { key: 'forbiddance', name: 'Forbiddance', level: 6, spheres: ['Protection'], description: 'Bars extraplanar travel and hurts non-matching alignment' },
  { key: 'healP', name: 'Heal', level: 6, spheres: ['Healing'], description: 'Restores all but 1d4 HP, cures diseases/conditions' },
  { key: 'heroesFeast', name: "Heroes' Feast", level: 6, spheres: ['Creation'], description: 'Nourishing meal with magical benefits' },
  { key: 'liveoak', name: 'Liveoak', level: 6, spheres: ['Plant'], description: 'Tree becomes animated guardian' },
  { key: 'speakWithMonsters', name: 'Speak with Monsters', level: 6, spheres: ['Divination'], description: 'Communicate with any creature' },
  { key: 'stoneToFleshP', name: 'Stone Tell', level: 6, spheres: ['Elemental', 'Divination'], description: 'Stone answers questions about surroundings' },
  { key: 'transportViaPlant', name: 'Transport via Plants', level: 6, spheres: ['Plant'], description: 'Teleport between plants any distance' },
  { key: 'turnWood', name: 'Turn Wood', level: 6, spheres: ['Plant'], description: 'Repels wooden objects and creatures' },
  { key: 'wallOfThorns', name: 'Wall of Thorns', level: 6, spheres: ['Plant', 'Creation'], description: 'Thorny hedge deals 8+AC damage' },
  { key: 'weatherSum', name: 'Weather Summoning', level: 6, spheres: ['Weather'], description: 'Summon specific weather conditions' },
  { key: 'wordOfRecall', name: 'Word of Recall', level: 6, spheres: ['Summoning'], description: 'Instantly teleport to sanctuary' },

  // ─── Level 7 ────────────────────────────────────────────
  { key: 'animateRock', name: 'Animate Rock', level: 7, spheres: ['Elemental'], description: 'Rock becomes animated and obeys' },
  { key: 'astralSpellP', name: 'Astral Spell', level: 7, spheres: ['Astral'], description: 'Projects caster onto Astral Plane' },
  { key: 'changeStaff', name: 'Changestaff', level: 7, spheres: ['Plant'], description: 'Staff becomes treant-like creature' },
  { key: 'chariotOfSustarreP', name: 'Chariot of Sustarre', level: 7, spheres: ['Elemental'], description: 'Flaming chariot for transportation' },
  { key: 'confuse', name: 'Confusion', level: 7, spheres: ['Charm'], description: 'Creatures behave randomly' },
  { key: 'conjureEarthEl', name: 'Conjure Earth Elemental', level: 7, spheres: ['Elemental', 'Summoning'], description: 'Summons earth elemental' },
  { key: 'controlWeatherP', name: 'Control Weather', level: 7, spheres: ['Weather'], description: 'Changes weather in large area' },
  { key: 'creepingDoom', name: 'Creeping Doom', level: 7, spheres: ['Animal', 'Summoning'], description: 'Carpet of insects kills all in path' },
  { key: 'earthquake', name: 'Earthquake', level: 7, spheres: ['Elemental'], description: 'Intense tremor shakes area' },
  { key: 'exaction', name: 'Exaction', level: 7, spheres: ['Charm', 'Summoning'], description: 'Compel extraplanar creature to serve' },
  { key: 'fireStorm', name: 'Fire Storm', level: 7, spheres: ['Elemental'], description: '2d8 fire damage per level in large area' },
  { key: 'gateP', name: 'Gate', level: 7, spheres: ['Summoning'], description: 'Opens portal to another plane' },
  { key: 'holyWord', name: 'Holy Word', level: 7, spheres: ['Combat'], description: 'Kills, paralyzes, stuns, or deafens evil' },
  { key: 'regenerate', name: 'Regenerate', level: 7, spheres: ['Necromantic'], description: 'Regrows severed limbs' },
  { key: 'reincarnateP', name: 'Reincarnate', level: 7, spheres: ['Necromantic'], description: 'Returns dead to life in new body' },
  { key: 'resurrection', name: 'Resurrection', level: 7, spheres: ['Necromantic'], description: 'Fully restores dead creature' },
  { key: 'succorP', name: 'Succor', level: 7, spheres: ['Summoning'], description: 'Creates token that teleports to caster' },
  { key: 'sunray', name: 'Sunray', level: 7, spheres: ['Sun'], description: 'Brilliant light blinds and damages undead' },
  { key: 'symbolP', name: 'Symbol', level: 7, spheres: ['Guardian'], description: 'Triggered magical rune with deadly effect' },
  { key: 'transmuteMetalToWood', name: 'Transmute Metal to Wood', level: 7, spheres: ['Elemental'], description: 'Changes metal to wood' },
  { key: 'windWalk', name: 'Wind Walk', level: 7, spheres: ['Elemental'], description: 'Become insubstantial and fly with wind' },
];

/**
 * Sphere access definitions for priest classes
 * major = full access (all spell levels)
 * minor = access to spells up to 3rd level only
 */
export const sphereAccess = {
  cleric: {
    major: ['All', 'Astral', 'Charm', 'Combat', 'Creation', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Summoning', 'Sun'],
    minor: ['Elemental']
  },
  druid: {
    major: ['All', 'Animal', 'Elemental', 'Healing', 'Plant', 'Weather'],
    minor: ['Divination']
  },
  paladin: {
    major: ['All', 'Astral', 'Charm', 'Combat', 'Creation', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Summoning', 'Sun'],
    minor: ['Elemental']
  },
  ranger: {
    major: ['All', 'Animal', 'Elemental', 'Healing', 'Plant', 'Weather'],
    minor: ['Divination']
  }
};

/**
 * Get priest spells available to a class, optionally overridden by deity spheres
 * @param {string} classKey - cleric, druid, paladin, ranger
 * @param {object|null} deityOverride - { majorSpheres, minorSpheres } from deity
 * @param {number} maxSpellLevel - maximum spell level to include
 * @returns {object[]} filtered spell list
 */
export function getPriestSpellsForClass(classKey, deityOverride = null, maxSpellLevel = 7) {
  // Determine sphere access
  let access;
  if (deityOverride && (classKey === 'cleric' || classKey === 'paladin')) {
    access = { major: deityOverride.majorSpheres, minor: deityOverride.minorSpheres };
  } else {
    access = sphereAccess[classKey];
  }
  if (!access) return [];

  return priestSpells.filter(spell => {
    if (spell.level > maxSpellLevel) return false;

    // Check if any of the spell's spheres match major access
    const hasMajor = spell.spheres.some(s => access.major.includes(s));
    if (hasMajor) return true;

    // Minor access only grants spells up to 3rd level
    if (spell.level <= 3) {
      return spell.spheres.some(s => access.minor.includes(s));
    }

    return false;
  });
}

/**
 * Group spells by level for display
 * @param {object[]} spells
 * @returns {object} { 1: [...], 2: [...], ... }
 */
export function groupByLevel(spells) {
  const groups = {};
  for (const spell of spells) {
    if (!groups[spell.level]) groups[spell.level] = [];
    groups[spell.level].push(spell);
  }
  return groups;
}
