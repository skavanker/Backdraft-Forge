/**
 * Syllable-based name generation for AD&D 2nd Edition races.
 *
 * Each race/gender has prefix + suffix arrays (and optional middles).
 * Combining them yields hundreds of unique names from small lists.
 */

const names = {
  human: {
    Male: {
      first: {
        prefix: ['Ald', 'Ed', 'God', 'Wil', 'Gar', 'Rod', 'Os', 'Bran', 'Ced', 'Hal', 'Mor', 'Ren', 'Sig', 'Tor', 'Ulf'],
        suffix: ['ric', 'mund', 'win', 'fred', 'bert', 'ard', 'wald', 'wen', 'stan', 'gar', 'dan', 'ald', 'mar', 'ton', 'helm']
      },
      surname: {
        prefix: ['Black', 'Ash', 'Iron', 'Stone', 'Hawk', 'Red', 'North', 'Storm', 'Grey', 'Thorn', 'Oak', 'Bright', 'Cold', 'High', 'Swift'],
        suffix: ['wood', 'ford', 'bridge', 'field', 'well', 'vale', 'borne', 'crest', 'hill', 'ton', 'moor', 'haven', 'gate', 'water', 'shield']
      }
    },
    Female: {
      first: {
        prefix: ['Ael', 'Bri', 'El', 'Gwen', 'Is', 'Math', 'Ros', 'Syl', 'Mor', 'Ald', 'Hed', 'Leof', 'Mil', 'Win', 'Cyn'],
        suffix: ['wyn', 'da', 'dith', 'ild', 'abeth', 'ina', 'mund', 'rid', 'wen', 'ith', 'gard', 'burg', 'lind', 'thea', 'ria']
      },
      surname: {
        prefix: ['Black', 'Ash', 'Iron', 'Stone', 'Hawk', 'Red', 'North', 'Storm', 'Grey', 'Thorn', 'Oak', 'Bright', 'Cold', 'High', 'Swift'],
        suffix: ['wood', 'ford', 'bridge', 'field', 'well', 'vale', 'borne', 'crest', 'hill', 'ton', 'moor', 'haven', 'gate', 'water', 'shield']
      }
    }
  },

  elf: {
    Male: {
      first: {
        prefix: ['Ael', 'Cel', 'Thal', 'Gal', 'Nim', 'Fin', 'Lor', 'Eil', 'Var', 'Eld', 'Ara', 'Fael', 'Ith', 'Quel', 'Rael'],
        middle: ['an', 'ar', 'el', 'en', 'ir', 'or'],
        suffix: ['indor', 'ion', 'orn', 'iel', 'ath', 'ias', 'anor', 'ith', 'ael', 'ond', 'oth', 'uin', 'wyn', 'aran', 'endil']
      },
      surname: {
        prefix: ['Star', 'Moon', 'Silver', 'Wind', 'Sun', 'Shadow', 'Dream', 'Dawn', 'Dew', 'Leaf', 'Night', 'Sky', 'Spell', 'Mist', 'Bright'],
        suffix: ['weaver', 'whisper', 'bough', 'song', 'walker', 'dancer', 'leaf', 'brook', 'glade', 'mantle', 'runner', 'singer', 'warden', 'light', 'shade']
      }
    },
    Female: {
      first: {
        prefix: ['Ael', 'Nim', 'Cel', 'Lir', 'Syl', 'Thal', 'Gal', 'Aer', 'Eil', 'Fae', 'Lor', 'Mith', 'Quel', 'Var', 'Ara'],
        middle: ['an', 'el', 'ir', 'ia', 'ae', 'en'],
        suffix: ['wen', 'iel', 'ara', 'ith', 'nia', 'eth', 'ael', 'ora', 'ira', 'wyn', 'essa', 'ath', 'aris', 'ana', 'ina']
      },
      surname: {
        prefix: ['Star', 'Moon', 'Silver', 'Wind', 'Sun', 'Shadow', 'Dream', 'Dawn', 'Dew', 'Leaf', 'Night', 'Sky', 'Spell', 'Mist', 'Bright'],
        suffix: ['weaver', 'whisper', 'bough', 'song', 'walker', 'dancer', 'leaf', 'brook', 'glade', 'mantle', 'runner', 'singer', 'warden', 'light', 'shade']
      }
    }
  },

  dwarf: {
    Male: {
      first: {
        prefix: ['Thor', 'Grum', 'Bor', 'Dor', 'Krag', 'Dum', 'Bal', 'Brun', 'Gim', 'Oin', 'Dwal', 'Nor', 'Thror', 'Gror', 'Kil'],
        suffix: ['in', 'bar', 'ak', 'ok', 'im', 'ur', 'gar', 'ek', 'li', 'din', 'grim', 'mund', 'rik', 'dur', 'gun']
      },
      surname: {
        prefix: ['Iron', 'Stone', 'Granite', 'Forge', 'Anvil', 'Hammer', 'Deep', 'Dark', 'Rock', 'Steel', 'Flint', 'Gold', 'Copper', 'Ember', 'Thunder'],
        suffix: ['forge', 'fist', 'hammer', 'axe', 'shield', 'delve', 'breaker', 'beard', 'helm', 'born', 'brand', 'heart', 'jaw', 'brow', 'grip']
      }
    },
    Female: {
      first: {
        prefix: ['Hel', 'Kath', 'Brun', 'Dis', 'Gerd', 'Thor', 'Aud', 'Dag', 'Frey', 'Hild', 'Sig', 'Vor', 'Ket', 'Runa', 'Gun'],
        suffix: ['ga', 'ra', 'a', 'ild', 'rid', 'dis', 'la', 'rin', 'na', 'li', 'da', 'wyn', 'bel', 'dra', 'ma']
      },
      surname: {
        prefix: ['Iron', 'Stone', 'Granite', 'Forge', 'Anvil', 'Hammer', 'Deep', 'Dark', 'Rock', 'Steel', 'Flint', 'Gold', 'Copper', 'Ember', 'Thunder'],
        suffix: ['forge', 'fist', 'hammer', 'axe', 'shield', 'delve', 'breaker', 'beard', 'helm', 'born', 'brand', 'heart', 'jaw', 'brow', 'grip']
      }
    }
  },

  gnome: {
    Male: {
      first: {
        prefix: ['Bod', 'Fim', 'Wig', 'Nim', 'Zook', 'Pip', 'Bim', 'Dob', 'Gar', 'Jeb', 'Nak', 'Rin', 'Seb', 'Tik', 'Wob'],
        middle: ['ble', 'dy', 'dle', 'ri', 'bi', 'ti'],
        suffix: ['nock', 'ble', 'wort', 'nik', 'ber', 'wick', 'ton', 'pen', 'lin', 'kin', 'gle', 'dak', 'pos', 'ren', 'ster']
      },
      surname: {
        prefix: ['Sparkle', 'Fiddle', 'Cog', 'Tinker', 'Wrench', 'Bobble', 'Gizmo', 'Spring', 'Copper', 'Nimble', 'Rattle', 'Tangle', 'Wobble', 'Crank', 'Pickle'],
        suffix: ['gear', 'sprocket', 'widget', 'top', 'fuse', 'spring', 'bottom', 'works', 'turn', 'snap', 'knob', 'bolt', 'click', 'fizz', 'pop']
      }
    },
    Female: {
      first: {
        prefix: ['Bim', 'Ella', 'Loo', 'Nim', 'Pip', 'Zel', 'Daf', 'Fiz', 'Gil', 'Ivy', 'Lil', 'Mab', 'Ori', 'Tib', 'Wren'],
        middle: ['ble', 'na', 'li', 'ri', 'sy', 'da'],
        suffix: ['na', 'ble', 'iss', 'wyn', 'ora', 'ette', 'kin', 'da', 'ry', 'la', 'phin', 'wen', 'ina', 'nyx', 'zel']
      },
      surname: {
        prefix: ['Sparkle', 'Fiddle', 'Cog', 'Tinker', 'Wrench', 'Bobble', 'Gizmo', 'Spring', 'Copper', 'Nimble', 'Rattle', 'Tangle', 'Wobble', 'Crank', 'Pickle'],
        suffix: ['gear', 'sprocket', 'widget', 'top', 'fuse', 'spring', 'bottom', 'works', 'turn', 'snap', 'knob', 'bolt', 'click', 'fizz', 'pop']
      }
    }
  },

  halfling: {
    Male: {
      first: {
        prefix: ['Cor', 'Mer', 'Per', 'Bil', 'Sam', 'Fro', 'Pip', 'Ald', 'Dro', 'Fin', 'Ham', 'Lar', 'Odo', 'Rol', 'Wil'],
        suffix: ['bin', 'ry', 'rin', 'bo', 'wise', 'do', 'pin', 'ric', 'go', 'ley', 'fast', 'kin', 'bert', 'and', 'lam']
      },
      surname: {
        prefix: ['Good', 'Under', 'Thorn', 'Green', 'High', 'Bramble', 'Copper', 'Old', 'Stout', 'Brown', 'Meadow', 'Hill', 'Honey', 'Kettle', 'Plough'],
        suffix: ['barrel', 'hill', 'bush', 'bottle', 'field', 'burrow', 'kettle', 'buck', 'bridge', 'brook', 'leaf', 'top', 'dale', 'worth', 'bee']
      }
    },
    Female: {
      first: {
        prefix: ['Rose', 'Mar', 'Prim', 'Lav', 'Daisy', 'Cam', 'Bell', 'Ama', 'Pop', 'Clem', 'Dahl', 'Ivy', 'Lily', 'May', 'Wil'],
        suffix: ['mary', 'igold', 'rose', 'ula', 'bell', 'lia', 'ina', 'ryl', 'py', 'ine', 'ia', 'wyn', 'ette', 'lee', 'low']
      },
      surname: {
        prefix: ['Good', 'Under', 'Thorn', 'Green', 'High', 'Bramble', 'Copper', 'Old', 'Stout', 'Brown', 'Meadow', 'Hill', 'Honey', 'Kettle', 'Plough'],
        suffix: ['barrel', 'hill', 'bush', 'bottle', 'field', 'burrow', 'kettle', 'buck', 'bridge', 'brook', 'leaf', 'top', 'dale', 'worth', 'bee']
      }
    }
  }
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFirst(parts) {
  const prefix = pick(parts.prefix);
  const middle = parts.middle && Math.random() < 0.3 ? pick(parts.middle) : '';
  const suffix = pick(parts.suffix);
  return prefix + middle + suffix;
}

function generateSurname(parts) {
  return pick(parts.prefix) + pick(parts.suffix);
}

/**
 * Generate a random name appropriate for the given race and sex.
 * @param {string} raceKey - Race key from races.js (human, elf, dwarf, gnome, halfElf, halfling)
 * @param {string} sex - 'Male' or 'Female'
 * @returns {string} "FirstName Surname"
 */
export function getRandomName(raceKey, sex = 'Male') {
  // Half-elf: coin flip between human and elf name styles
  if (raceKey === 'halfElf') {
    const useElf = Math.random() < 0.5;
    raceKey = useElf ? 'elf' : 'human';
  }

  const raceNames = names[raceKey];
  if (!raceNames) {
    // Fallback to human if unknown race
    return getRandomName('human', sex);
  }

  const gendered = raceNames[sex] || raceNames['Male'];
  const firstName = generateFirst(gendered.first);
  const surname = generateSurname(gendered.surname);

  return `${firstName} ${surname}`;
}
