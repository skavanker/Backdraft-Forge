/**
 * AD&D 2nd Edition Languages
 */

export const languages = {
  // Common languages
  common: { name: 'Common', category: 'common' },

  // Racial languages
  dwarvish: { name: 'Dwarvish', category: 'racial' },
  elvish: { name: 'Elvish', category: 'racial' },
  gnomish: { name: 'Gnomish', category: 'racial' },
  halfling: { name: 'Halfling', category: 'racial' },
  orcish: { name: 'Orcish', category: 'racial' },
  goblin: { name: 'Goblin', category: 'racial' },

  // Ancient/exotic languages
  draconic: { name: 'Draconic', category: 'exotic' },
  giant: { name: 'Giant', category: 'exotic' },
  gnoll: { name: 'Gnoll', category: 'exotic' },
  kobold: { name: 'Kobold', category: 'exotic' },
  ogre: { name: 'Ogre', category: 'exotic' },

  // Alignment languages (special)
  druidic: { name: 'Druidic', category: 'special', classRestricted: 'druid' },
  thiefsCant: { name: "Thieves' Cant", category: 'special', classRestricted: 'thief' }
};

// Get bonus language slots from Intelligence
export function getBonusLanguageSlots(intelligence) {
  if (intelligence >= 16) return 4;
  if (intelligence >= 15) return 3;
  if (intelligence >= 14) return 2;
  if (intelligence >= 13) return 1;
  return 0;
}

// Get racial languages for a race
export function getRacialLanguages(raceKey) {
  const racialLanguages = {
    human: ['common'],
    dwarf: ['common', 'dwarvish'],
    elf: ['common', 'elvish'],
    gnome: ['common', 'gnomish'],
    halfElf: ['common', 'elvish'],
    halfling: ['common', 'halfling'],
  };

  return racialLanguages[raceKey] || ['common'];
}

// Get available bonus languages (excluding already known)
export function getAvailableBonusLanguages(knownLanguageKeys, classKey) {
  const allLanguages = Object.keys(languages);

  return allLanguages.filter(key => {
    const lang = languages[key];

    // Can't select if already known
    if (knownLanguageKeys.includes(key)) return false;

    // Can't select class-restricted languages unless you're that class
    if (lang.classRestricted && lang.classRestricted !== classKey) return false;

    return true;
  });
}
