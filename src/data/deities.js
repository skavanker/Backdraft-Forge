/**
 * AD&D 2nd Edition — Forgotten Realms Deities
 * Core pantheon with alignment and sphere access
 */

export const deities = {
  standardCleric: {
    key: 'standardCleric',
    name: 'Standard Cleric',
    alignment: 'Any',
    majorSpheres: ['All', 'Astral', 'Charm', 'Combat', 'Creation', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Summoning', 'Sun'],
    minorSpheres: ['Elemental'],
    description: 'Default cleric sphere access without a specific deity'
  },
  mystra: {
    key: 'mystra',
    name: 'Mystra',
    alignment: 'LN',
    majorSpheres: ['All', 'Astral', 'Charm', 'Creation', 'Divination', 'Guardian', 'Protection', 'Sun', 'Summoning'],
    minorSpheres: ['Healing', 'Necromantic'],
    description: 'Goddess of Magic — The Lady of Mysteries'
  },
  tempus: {
    key: 'tempus',
    name: 'Tempus',
    alignment: 'CN',
    majorSpheres: ['All', 'Combat', 'Healing', 'Protection'],
    minorSpheres: ['Charm', 'Necromantic'],
    description: 'God of War — Lord of Battles'
  },
  tyr: {
    key: 'tyr',
    name: 'Tyr',
    alignment: 'LG',
    majorSpheres: ['All', 'Astral', 'Combat', 'Divination', 'Guardian', 'Healing', 'Protection', 'Sun'],
    minorSpheres: ['Charm', 'Creation', 'Necromantic'],
    description: 'God of Justice — The Even-Handed'
  },
  lathander: {
    key: 'lathander',
    name: 'Lathander',
    alignment: 'NG',
    majorSpheres: ['All', 'Charm', 'Combat', 'Creation', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Sun'],
    minorSpheres: ['Divination', 'Elemental'],
    description: 'God of Dawn — The Morninglord'
  },
  helm: {
    key: 'helm',
    name: 'Helm',
    alignment: 'LN',
    majorSpheres: ['All', 'Astral', 'Combat', 'Divination', 'Guardian', 'Healing', 'Protection'],
    minorSpheres: ['Charm', 'Necromantic'],
    description: 'God of Guardians — The Watcher'
  },
  shar: {
    key: 'shar',
    name: 'Shar',
    alignment: 'NE',
    majorSpheres: ['All', 'Astral', 'Charm', 'Combat', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Sun'],
    minorSpheres: ['Creation', 'Summoning'],
    description: 'Goddess of Darkness — Mistress of the Night'
  },
  chauntea: {
    key: 'chauntea',
    name: 'Chauntea',
    alignment: 'NG',
    majorSpheres: ['All', 'Animal', 'Creation', 'Elemental', 'Healing', 'Plant', 'Protection', 'Weather'],
    minorSpheres: ['Divination', 'Sun'],
    description: 'Goddess of Agriculture — The Great Mother'
  },
  silvanus: {
    key: 'silvanus',
    name: 'Silvanus',
    alignment: 'N',
    majorSpheres: ['All', 'Animal', 'Elemental', 'Healing', 'Plant', 'Protection', 'Sun', 'Weather'],
    minorSpheres: ['Divination', 'Creation'],
    description: 'God of Nature — The Oak Father'
  },
  kelemvor: {
    key: 'kelemvor',
    name: 'Kelemvor',
    alignment: 'LN',
    majorSpheres: ['All', 'Astral', 'Combat', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Sun'],
    minorSpheres: ['Charm', 'Summoning'],
    description: 'God of the Dead — Lord of the Crystal Spire'
  },
  sune: {
    key: 'sune',
    name: 'Sune',
    alignment: 'CG',
    majorSpheres: ['All', 'Charm', 'Creation', 'Guardian', 'Healing', 'Protection', 'Sun'],
    minorSpheres: ['Necromantic', 'Divination'],
    description: 'Goddess of Beauty — Firehair'
  },
  selune: {
    key: 'selune',
    name: 'Selune',
    alignment: 'CG',
    majorSpheres: ['All', 'Astral', 'Charm', 'Combat', 'Creation', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Sun'],
    minorSpheres: ['Elemental', 'Weather'],
    description: 'Goddess of the Moon — Our Lady of Silver'
  },
  ilmater: {
    key: 'ilmater',
    name: 'Ilmater',
    alignment: 'LG',
    majorSpheres: ['All', 'Astral', 'Creation', 'Guardian', 'Healing', 'Necromantic', 'Protection'],
    minorSpheres: ['Combat', 'Divination'],
    description: 'God of Endurance — The Crying God'
  },
  oghma: {
    key: 'oghma',
    name: 'Oghma',
    alignment: 'N',
    majorSpheres: ['All', 'Astral', 'Charm', 'Divination', 'Protection', 'Summoning'],
    minorSpheres: ['Creation', 'Healing'],
    description: 'God of Knowledge — The Lord of Knowledge'
  },
  tymora: {
    key: 'tymora',
    name: 'Tymora',
    alignment: 'CG',
    majorSpheres: ['All', 'Charm', 'Combat', 'Creation', 'Healing', 'Protection'],
    minorSpheres: ['Divination', 'Guardian'],
    description: 'Goddess of Luck — Lady Luck'
  },
  bane: {
    key: 'bane',
    name: 'Bane',
    alignment: 'LE',
    majorSpheres: ['All', 'Combat', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Summoning'],
    minorSpheres: ['Charm', 'Creation'],
    description: 'God of Tyranny — The Black Lord'
  },
  cyric: {
    key: 'cyric',
    name: 'Cyric',
    alignment: 'CE',
    majorSpheres: ['All', 'Charm', 'Combat', 'Healing', 'Necromantic', 'Summoning'],
    minorSpheres: ['Divination', 'Guardian'],
    description: 'God of Murder — Prince of Lies'
  },
};

/**
 * Get list of deities, optionally filtered by alignment compatibility
 * @param {string|null} alignment - Character alignment to filter by (null = all)
 * @returns {object[]} Array of deity objects
 */
export function getDeityList(alignment = null) {
  const list = Object.values(deities);
  if (!alignment) return list;

  return list.filter(d => {
    if (d.alignment === 'Any') return true;
    // Allow within one step of alignment
    return isAlignmentCompatible(alignment, d.alignment);
  });
}

/**
 * Check if character alignment is compatible with deity alignment
 * AD&D 2E: cleric must be within one step of deity's alignment
 */
function isAlignmentCompatible(charAlign, deityAlign) {
  if (deityAlign === 'Any') return true;

  const axisMap = {
    'Lawful Good': [0, 0], 'Neutral Good': [1, 0], 'Chaotic Good': [2, 0],
    'Lawful Neutral': [0, 1], 'True Neutral': [1, 1], 'Chaotic Neutral': [2, 1],
    'Lawful Evil': [0, 2], 'Neutral Evil': [1, 2], 'Chaotic Evil': [2, 2]
  };

  const deityExpand = {
    'LG': 'Lawful Good', 'NG': 'Neutral Good', 'CG': 'Chaotic Good',
    'LN': 'Lawful Neutral', 'N': 'True Neutral', 'CN': 'Chaotic Neutral',
    'LE': 'Lawful Evil', 'NE': 'Neutral Evil', 'CE': 'Chaotic Evil'
  };

  const ca = axisMap[charAlign];
  const da = axisMap[deityExpand[deityAlign]];
  if (!ca || !da) return true; // If we can't determine, allow it

  return Math.abs(ca[0] - da[0]) <= 1 && Math.abs(ca[1] - da[1]) <= 1;
}
