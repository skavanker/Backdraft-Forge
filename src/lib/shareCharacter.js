import { deflateRaw, inflateRaw } from 'pako';
import { getAlignmentNumber } from '../data/alignment.js';

/**
 * Compress character to minimal data structure
 */
function compressCharacter(character) {
  const compressed = {
    // Abilities as array [STR, DEX, CON, INT, WIS, CHA]
    a: [
      character.abilities.STR,
      character.abilities.DEX,
      character.abilities.CON,
      character.abilities.INT,
      character.abilities.WIS,
      character.abilities.CHA
    ]
  };

  // Exceptional strength (if exists)
  if (character.abilities.exceptionalStr) {
    compressed.e = character.abilities.exceptionalStr;
  }

  // Race and class keys
  compressed.r = character.raceKey;
  compressed.c = character.classKey;

  // Wizard school (if specialist)
  if (character.wizardSchool) {
    compressed.w = character.wizardSchool.key;
  }

  // Level limit and XP bonus
  if (character.levelLimit) compressed.l = character.levelLimit;
  if (character.xpBonus) compressed.x = character.xpBonus;

  // Proficiencies (just keys)
  if (character.proficiencies) {
    compressed.wp = character.proficiencies.weapons.map(w => w.key);
    compressed.np = character.proficiencies.nonWeapon.map(p => p.key);
    if (character.proficiencies.languages) {
      compressed.lg = character.proficiencies.languages.map(l => l.key);
    }
  }

  // Equipment
  if (character.equipment) {
    compressed.g = character.equipment.remaining ?? character.equipment.gold;
    if (character.equipment.armor) compressed.ar = character.equipment.armor.key;
    if (character.equipment.shield) compressed.sh = character.equipment.shield.key;
    if (character.equipment.weapons) compressed.wk = character.equipment.weapons.map(w => w.key);
    if (character.equipment.gear) {
      compressed.gk = character.equipment.gear.map(g => {
        if (g.key.startsWith('custom_')) {
          return { n: g.name, p: g.price?.gp || 0, w: g.weight || 0, q: g.qty || 1 };
        }
        return (g.qty || 1) > 1 ? [g.key, g.qty] : g.key;
      });
    }
  }

  // Spells
  if (character.spells) {
    compressed.st = character.spells.type;
    if (character.spells.type === 'arcane' && character.spells.spellbook) {
      compressed.sp = character.spells.spellbook.map(s => s.key);
    } else if (character.spells.type === 'divine' && character.spells.prepared) {
      compressed.sp = character.spells.prepared.map(s => s.key);
    }
  }

  // Level, XP, HP history (only if above defaults)
  if (character.level > 1) compressed.lv = character.level;
  if (character.xp > 0) compressed.xp = character.xp;
  if (character.hpHistory?.length > 0) compressed.hh = character.hpHistory;

  // Name, sex, alignment, backstory, and physical details
  if (character.name) compressed.n = character.name;
  if (character.sex) compressed.sx = character.sex;
  if (character.alignment) compressed.al = character.alignment;
  if (character.backstory) compressed.b = character.backstory;
  if (character.age) compressed.ag = character.age;
  if (character.height) compressed.ht = character.height;
  if (character.weight) compressed.wt = character.weight;
  if (character.eyes) compressed.ey = character.eyes;
  if (character.hair) compressed.hr = character.hair;
  if (character.deityKey) compressed.dk = character.deityKey;
  if (character.deity) compressed.dy = character.deity;

  // Current HP (only if different from max, i.e. damaged)
  if (character.currentHP !== null && character.currentHP !== undefined) compressed.hp = character.currentHP;
  // Thief skills distributed points
  if (character.thiefSkills) compressed.ts = character.thiefSkills;
  // Notes
  if (character.notes) compressed.nt = character.notes;

  return compressed;
}

/**
 * Encode character data to a URL-safe string (deflate-compressed)
 */
export function encodeCharacter(character) {
  try {
    const compressed = compressCharacter(character);
    const json = JSON.stringify(compressed);
    const deflated = deflateRaw(new TextEncoder().encode(json));
    const base64 = btoa(String.fromCharCode(...deflated));
    // 'Z' prefix marks deflate-compressed codes
    const urlSafe = 'Z' + base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return urlSafe;
  } catch (error) {
    console.error('Failed to encode character:', error);
    return null;
  }
}

/**
 * Decompress character from minimal data structure
 */
async function decompressCharacter(compressed) {
  // Import data files dynamically
  const { races, applyRacialAdjustments } = await import('../data/races.js');
  const { classes, wizardSchools } = await import('../data/classes.js');
  const { weapons, nonWeaponProficiencies } = await import('../data/proficiencies.js');
  const { equipment } = await import('../data/equipment.js');
  const { wizardSpells } = await import('../data/spells.js');
  const { priestSpells } = await import('../data/priestSpells.js');
  const { deities } = await import('../data/deities.js');
  const { languages } = await import('../data/languages.js');

  // Reconstruct abilities
  const abilities = {
    STR: compressed.a[0],
    DEX: compressed.a[1],
    CON: compressed.a[2],
    INT: compressed.a[3],
    WIS: compressed.a[4],
    CHA: compressed.a[5]
  };
  if (compressed.e) abilities.exceptionalStr = compressed.e;

  // Reconstruct race
  const race = races[compressed.r];
  const adjustedAbilities = applyRacialAdjustments(abilities, race);

  // Reconstruct class
  const cls = classes[compressed.c];

  // Wizard school (if specialist)
  let wizardSchool = null;
  if (compressed.w) {
    wizardSchool = { key: compressed.w, ...wizardSchools[compressed.w] };
  }

  // Reconstruct proficiencies
  let proficiencies = null;
  if (compressed.wp) {
    proficiencies = {
      weapons: compressed.wp.map(key => ({ key, ...weapons[key] })),
      nonWeapon: compressed.np.map(key => ({ key, ...nonWeaponProficiencies[key] })),
      languages: compressed.lg ? compressed.lg.map(key => ({ key, ...languages[key] })) : []
    };
  }

  // Reconstruct equipment
  let equipmentData = null;
  if (compressed.g !== undefined) {
    equipmentData = {
      remaining: compressed.g,
      armor: compressed.ar ? equipment.armor.find(a => a.key === compressed.ar) : null,
      shield: compressed.sh ? equipment.shields.find(s => s.key === compressed.sh) : null,
      weapons: compressed.wk ? compressed.wk.map(key => equipment.weapons.find(w => w.key === key)) : [],
      gear: compressed.gk ? compressed.gk.map(entry => {
        // Object = custom item
        if (typeof entry === 'object' && !Array.isArray(entry)) {
          return { key: `custom_${Math.random().toString(36).slice(2, 6)}`, name: entry.n, price: { gp: entry.p || 0 }, weight: entry.w || 0, qty: entry.q || 1 };
        }
        // Array = catalog item with qty
        const key = Array.isArray(entry) ? entry[0] : entry;
        const qty = Array.isArray(entry) ? entry[1] : 1;
        const found = [...equipment.ammunition, ...equipment.adventuringGear, ...equipment.clothing].find(g => g.key === key);
        return found ? { ...found, qty } : null;
      }).filter(Boolean) : []
    };
  }

  // Reconstruct spells
  let spells = null;
  if (compressed.st) {
    if (compressed.st === 'arcane' && compressed.sp) {
      const spellbook = compressed.sp.map(key => wizardSpells.find(s => s.key === key)).filter(Boolean);
      spells = {
        type: 'arcane',
        spellbook,
        memorized: spellbook.slice(0, 1),
        spellsPerDay: 1
      };
    } else if (compressed.st === 'divine' && compressed.sp) {
      const prepared = compressed.sp.map(key => priestSpells.find(s => s.key === key)).filter(Boolean);
      spells = {
        type: 'divine',
        available: priestSpells,
        prepared,
        spellsPerDay: prepared.length
      };
    } else {
      spells = { type: 'none' };
    }
  }

  // Reconstruct full character
  return {
    abilities,
    rollData: null, // Can't restore roll data from compressed format
    adjustedAbilities,
    raceKey: compressed.r,
    race,
    classKey: compressed.c,
    cls,
    levelLimit: compressed.l || null,
    xpBonus: compressed.x || 0,
    wizardSchool,
    proficiencies,
    equipment: equipmentData,
    spells,
    name: compressed.n || null,
    sex: compressed.sx || compressed.s || 'Male', // Support both old 's' and new 'sx'
    alignment: typeof compressed.al === 'number' ? compressed.al : (getAlignmentNumber(compressed.al) || 4), // Support both number and legacy string, default to True Neutral (4)
    backstory: compressed.b || null,
    age: compressed.ag || null,
    height: compressed.ht || null,
    weight: compressed.wt || null,
    eyes: compressed.ey || null,
    hair: compressed.hr || null,
    deityKey: compressed.dk || null,
    deity: compressed.dk ? (deities[compressed.dk]?.name || compressed.dy || null) : (compressed.dy || null),
    level: compressed.lv || 1,
    xp: compressed.xp || 0,
    hpHistory: compressed.hh || [],
    currentHP: compressed.hp ?? null,
    thiefSkills: compressed.ts || null,
    notes: compressed.nt || '',
  };
}

/**
 * Decode character data from a URL-safe string
 */
export async function decodeCharacter(encoded) {
  try {
    let json;
    if (encoded.startsWith('Z')) {
      // New deflate-compressed format
      let base64 = encoded.slice(1).replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
      json = new TextDecoder().decode(inflateRaw(bytes));
    } else {
      // Legacy uncompressed format
      let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const raw = atob(base64);
      try {
        json = decodeURIComponent(escape(raw));
      } catch {
        json = raw;
      }
    }
    const compressed = JSON.parse(json);

    // Decompress to full character
    const character = await decompressCharacter(compressed);
    return character;
  } catch (error) {
    console.error('Failed to decode character:', error);
    return null;
  }
}

/**
 * Generate a shareable URL for the character
 */
export function generateShareableUrl(character) {
  const encoded = encodeCharacter(character);
  if (!encoded) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#char=${encoded}`;
}

/**
 * Get character data from current URL if present
 */
export async function getCharacterFromUrl() {
  const hash = window.location.hash;
  if (!hash.startsWith('#char=')) return null;

  const encoded = hash.substring(6); // Remove '#char='
  return await decodeCharacter(encoded);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
}
