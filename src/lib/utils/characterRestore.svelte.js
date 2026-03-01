/**
 * Restore character object by hydrating keys back to full objects.
 * Used when loading from JSON (undo, WIP, saved characters).
 *
 * This utility solves the problem of JSON serialization removing methods/functions
 * from data objects. When we undo or resume WIP, we need to restore the full objects
 * from their serialized keys.
 *
 * @param {Object} character - Serialized character data with keys instead of full objects
 * @returns {Promise<Object>} - Fully hydrated character object
 */
export async function restoreCharacterObjects(character) {
  // Lazy-load all data modules
  const { races } = await import('../../data/races.js');
  const { classes, wizardSchools } = await import('../../data/classes.js');
  const { kits } = await import('../../data/kits.js');
  const { deities } = await import('../../data/deities.js');
  const { weapons, nonWeaponProficiencies } = await import('../../data/proficiencies.js');
  const { languages } = await import('../../data/languages.js');
  const { equipment } = await import('../../data/equipment.js');
  const { wizardSpells, priestSpells } = await import('../../data/spells.js');

  const restored = {
    ...character,
    race: character.raceKey ? races[character.raceKey] : null,
    cls: character.classKey ? classes[character.classKey] : null,
    wizardSchool: character.wizardSchool?.key
      ? { key: character.wizardSchool.key, ...wizardSchools[character.wizardSchool.key] }
      : null,
    kit: character.kitKey && kits[character.kitKey]
      ? { key: character.kitKey, ...kits[character.kitKey] }
      : null,
    deity: character.deityKey && deities[character.deityKey]
      ? { key: character.deityKey, ...deities[character.deityKey] }
      : null
  };

  // RESTORE PROFICIENCIES:
  // Saved data only has keys (e.g., 'longsword'), we need to hydrate back to full objects.
  // Why: JSON.parse loses object methods and data. We store minimal keys to save space,
  // then restore full objects from game data on load.
  if (character.proficiencies) {
    restored.proficiencies = {
      weapons: character.proficiencies.weapons?.map(w => ({ key: w.key, ...weapons[w.key] })) || [],
      nonWeapon: character.proficiencies.nonWeapon?.map(p => ({ key: p.key, ...nonWeaponProficiencies[p.key] })) || [],
      languages: character.proficiencies.languages?.map(l => ({ key: l.key, ...languages[l.key] })) || []
    };
  }

  // RESTORE EQUIPMENT:
  // Complex because we handle both standard items (by key lookup) and custom items (stored in full).
  // Custom items (user-created) have keys like 'custom_123' and are preserved as-is since they
  // don't exist in the game data. Standard items are looked up from equipment data.
  if (character.equipment) {
    restored.equipment = {
      remaining: character.equipment.remaining,
      // Armor/Shield: Simple lookup by key
      armor: character.equipment.armor
        ? equipment.armor.find(a => a.key === character.equipment.armor.key)
        : null,
      shield: character.equipment.shield
        ? equipment.shields.find(s => s.key === character.equipment.shield.key)
        : null,
      // Weapons: Array of items, filter out any that no longer exist
      weapons: character.equipment.weapons?.map(w =>
        equipment.weapons.find(wep => wep.key === w.key)
      ).filter(Boolean) || [],
      // Gear: Most complex - handles custom items AND preserves quantity
      gear: character.equipment.gear?.map(g => {
        // Custom items (e.g., "Magic Ring") are stored with full data, preserve them
        if (g.key?.startsWith('custom_')) return g;
        // Standard items: look up from game data, preserve qty from save
        const found = [...equipment.ammunition, ...equipment.adventuringGear, ...equipment.clothing]
          .find(item => item.key === g.key);
        return found ? { ...found, qty: g.qty } : null;
      }).filter(Boolean) || [] // Remove any items that no longer exist
    };
  }

  // Restore spells
  if (character.spells) {
    if (character.spells.type === 'arcane') {
      restored.spells = {
        type: 'arcane',
        spellbook: character.spells.spellbook?.map(s =>
          wizardSpells.find(spell => spell.key === s.key)
        ).filter(Boolean) || [],
        memorized: character.spells.memorized?.map(s =>
          wizardSpells.find(spell => spell.key === s.key)
        ).filter(Boolean) || [],
        spellsPerDay: character.spells.spellsPerDay
      };
    } else if (character.spells.type === 'divine') {
      restored.spells = {
        type: 'divine',
        prepared: character.spells.prepared?.map(s =>
          priestSpells.find(spell => spell.key === s.key)
        ).filter(Boolean) || [],
        spellsPerDay: character.spells.spellsPerDay
      };
    }
  }

  return restored;
}
