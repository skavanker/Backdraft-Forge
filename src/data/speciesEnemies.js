/**
 * AD&D 2nd Edition — Ranger Species Enemies
 * Rangers choose one species enemy at level 1, gaining +4 attack bonus
 * against that creature type but suffering -4 reaction penalty.
 */

export const speciesEnemies = {
  goblinoid: {
    name: 'Goblinoid',
    description: 'Goblins, hobgoblins, and bugbears',
    examples: 'Goblin, Hobgoblin, Bugbear'
  },
  orc: {
    name: 'Orc',
    description: 'Orcs and half-orcs of evil disposition',
    examples: 'Orc, Orog, Ogrillon'
  },
  gnoll: {
    name: 'Gnoll',
    description: 'Hyena-headed humanoids and their kin',
    examples: 'Gnoll, Flind'
  },
  undead: {
    name: 'Undead',
    description: 'Animated corpses and incorporeal spirits',
    examples: 'Skeleton, Zombie, Ghoul, Wight, Wraith'
  },
  giant: {
    name: 'Giant',
    description: 'True giants and giant-kin',
    examples: 'Hill Giant, Stone Giant, Ogre, Troll, Ettercap'
  },
  dragon: {
    name: 'Dragon',
    description: 'True dragons and dragonkind',
    examples: 'Red Dragon, White Dragon, Wyvern, Drake'
  },
  lycanthrope: {
    name: 'Lycanthrope',
    description: 'Shape-changers cursed with beast forms',
    examples: 'Werewolf, Wererat, Werebear, Wereboar'
  },
  aberration: {
    name: 'Aberration',
    description: 'Unnatural creatures from beyond the world',
    examples: 'Beholder, Mind Flayer, Aboleth, Hook Horror'
  },
  elemental: {
    name: 'Elemental',
    description: 'Beings of pure elemental matter',
    examples: 'Fire Elemental, Water Elemental, Mephit, Salamander'
  },
  fiend: {
    name: 'Fiend',
    description: 'Demons, devils, and other lower-planar beings',
    examples: 'Imp, Quasit, Pit Fiend, Balor'
  },
  reptilian: {
    name: 'Reptilian',
    description: 'Lizard-folk and serpentine creatures',
    examples: 'Lizardman, Troglodyte, Yuan-ti, Naga'
  },
  arachnid: {
    name: 'Arachnid',
    description: 'Spiders and spider-kin',
    examples: 'Giant Spider, Phase Spider, Drider, Ettercap'
  },
  kobold: {
    name: 'Kobold',
    description: 'Small reptilian tunnel-dwellers',
    examples: 'Kobold, Urds'
  }
};

/**
 * Get species enemies as a flat list with keys
 */
export function getSpeciesEnemyList() {
  return Object.entries(speciesEnemies).map(([key, data]) => ({
    key,
    ...data
  }));
}
