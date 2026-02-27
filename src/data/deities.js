/**
 * AD&D 2nd Edition — Forgotten Realms Deities
 * Core pantheon with alignment and sphere access
 * Alignments stored as numbers: 0=LG, 1=NG, 2=CG, 3=LN, 4=N, 5=CN, 6=LE, 7=NE, 8=CE
 */

import { ALIGNMENTS, getAlignmentName } from './alignment.js';

export const deities = {
  standardCleric: {
    key: 'standardCleric',
    name: 'Standard Cleric',
    alignment: null, // No alignment restriction
    majorSpheres: ['All', 'Astral', 'Charm', 'Combat', 'Creation', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Summoning', 'Sun'],
    minorSpheres: ['Elemental'],
    description: 'Default cleric sphere access without a specific deity'
  },
  mystra: {
    key: 'mystra',
    name: 'Mystra',
    alignment: ALIGNMENTS.LN,
    majorSpheres: ['All', 'Astral', 'Charm', 'Creation', 'Divination', 'Guardian', 'Protection', 'Sun', 'Summoning'],
    minorSpheres: ['Healing', 'Necromantic'],
    description: 'Goddess of Magic — The Lady of Mysteries'
  },
  tempus: {
    key: 'tempus',
    name: 'Tempus',
    alignment: ALIGNMENTS.CN,
    majorSpheres: ['All', 'Combat', 'Healing', 'Protection'],
    minorSpheres: ['Charm', 'Necromantic'],
    description: 'God of War — Lord of Battles'
  },
  tyr: {
    key: 'tyr',
    name: 'Tyr',
    alignment: ALIGNMENTS.LG,
    majorSpheres: ['All', 'Astral', 'Combat', 'Divination', 'Guardian', 'Healing', 'Protection', 'Sun'],
    minorSpheres: ['Charm', 'Creation', 'Necromantic'],
    description: 'God of Justice — The Even-Handed'
  },
  lathander: {
    key: 'lathander',
    name: 'Lathander',
    alignment: ALIGNMENTS.NG,
    majorSpheres: ['All', 'Charm', 'Combat', 'Creation', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Sun'],
    minorSpheres: ['Divination', 'Elemental'],
    description: 'God of Dawn — The Morninglord'
  },
  helm: {
    key: 'helm',
    name: 'Helm',
    alignment: ALIGNMENTS.LN,
    majorSpheres: ['All', 'Astral', 'Combat', 'Divination', 'Guardian', 'Healing', 'Protection'],
    minorSpheres: ['Charm', 'Necromantic'],
    description: 'God of Guardians — The Watcher'
  },
  shar: {
    key: 'shar',
    name: 'Shar',
    alignment: ALIGNMENTS.NE,
    majorSpheres: ['All', 'Astral', 'Charm', 'Combat', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Sun'],
    minorSpheres: ['Creation', 'Summoning'],
    description: 'Goddess of Darkness — Mistress of the Night'
  },
  chauntea: {
    key: 'chauntea',
    name: 'Chauntea',
    alignment: ALIGNMENTS.NG,
    majorSpheres: ['All', 'Animal', 'Creation', 'Elemental', 'Healing', 'Plant', 'Protection', 'Weather'],
    minorSpheres: ['Divination', 'Sun'],
    description: 'Goddess of Agriculture — The Great Mother'
  },
  silvanus: {
    key: 'silvanus',
    name: 'Silvanus',
    alignment: ALIGNMENTS.N,
    majorSpheres: ['All', 'Animal', 'Elemental', 'Healing', 'Plant', 'Protection', 'Sun', 'Weather'],
    minorSpheres: ['Divination', 'Creation'],
    description: 'God of Nature — The Oak Father'
  },
  kelemvor: {
    key: 'kelemvor',
    name: 'Kelemvor',
    alignment: ALIGNMENTS.LN,
    majorSpheres: ['All', 'Astral', 'Combat', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Sun'],
    minorSpheres: ['Charm', 'Summoning'],
    description: 'God of the Dead — Lord of the Crystal Spire'
  },
  sune: {
    key: 'sune',
    name: 'Sune',
    alignment: ALIGNMENTS.CG,
    majorSpheres: ['All', 'Charm', 'Creation', 'Guardian', 'Healing', 'Protection', 'Sun'],
    minorSpheres: ['Necromantic', 'Divination'],
    description: 'Goddess of Beauty — Firehair'
  },
  selune: {
    key: 'selune',
    name: 'Selune',
    alignment: ALIGNMENTS.CG,
    majorSpheres: ['All', 'Astral', 'Charm', 'Combat', 'Creation', 'Divination', 'Guardian', 'Healing', 'Necromantic', 'Sun'],
    minorSpheres: ['Elemental', 'Weather'],
    description: 'Goddess of the Moon — Our Lady of Silver'
  },
  ilmater: {
    key: 'ilmater',
    name: 'Ilmater',
    alignment: 'Lawful Good',
    majorSpheres: ['All', 'Astral', 'Creation', 'Guardian', 'Healing', 'Necromantic', 'Protection'],
    minorSpheres: ['Combat', 'Divination'],
    description: 'God of Endurance — The Crying God'
  },
  oghma: {
    key: 'oghma',
    name: 'Oghma',
    alignment: ALIGNMENTS.N,
    majorSpheres: ['All', 'Astral', 'Charm', 'Divination', 'Protection', 'Summoning'],
    minorSpheres: ['Creation', 'Healing'],
    description: 'God of Knowledge — The Lord of Knowledge'
  },
  tymora: {
    key: 'tymora',
    name: 'Tymora',
    alignment: ALIGNMENTS.CG,
    majorSpheres: ['All', 'Charm', 'Combat', 'Creation', 'Healing', 'Protection'],
    minorSpheres: ['Divination', 'Guardian'],
    description: 'Goddess of Luck — Lady Luck'
  },
  bane: {
    key: 'bane',
    name: 'Bane',
    alignment: ALIGNMENTS.LE,
    majorSpheres: ['All', 'Combat', 'Guardian', 'Healing', 'Necromantic', 'Protection', 'Summoning'],
    minorSpheres: ['Charm', 'Creation'],
    description: 'God of Tyranny — The Black Lord'
  },
  cyric: {
    key: 'cyric',
    name: 'Cyric',
    alignment: ALIGNMENTS.CE,
    majorSpheres: ['All', 'Charm', 'Combat', 'Healing', 'Necromantic', 'Summoning'],
    minorSpheres: ['Divination', 'Guardian'],
    description: 'God of Murder — Prince of Lies'
  },
};

/**
 * Get list of deities for selection
 * @returns {object[]} Array of deity objects
 */
export function getDeityList() {
  return Object.values(deities)
    .filter(d => d.key !== 'standardCleric')
    .sort((a, b) => a.name.localeCompare(b.name));
}
