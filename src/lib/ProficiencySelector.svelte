<script>
  import {
    weapons,
    getAvailableProficiencies,
    getWeaponSlotsWithKit,
    getNonWeaponSlotsWithKit,
    getAllowedWeaponsWithKit,
    getKitFreeWeapons,
    getKitFreeNonWeapon
  } from '../data/proficiencies.js';
  import {
    languages,
    getBonusLanguageSlots,
    getRacialLanguages
  } from '../data/languages.js';
  import { onMount } from 'svelte';
  import SlotCounter from './SlotCounter.svelte';
  import WeaponProficiencyPanel from './components/WeaponProficiencyPanel.svelte';
  import LanguagePanel from './components/LanguagePanel.svelte';
  import NonWeaponProficiencyPanel from './components/NonWeaponProficiencyPanel.svelte';
  import ProficiencySummary from './components/ProficiencySummary.svelte';

  let { abilities, race, cls, kit = null, level = 1, existingProficiencies = null, onComplete } = $props();

  // Calculate available slots (level-aware, kit-aware)
  let weaponSlots = $derived(getWeaponSlotsWithKit(cls.group, level, kit));
  let nonWeaponSlots = $derived(getNonWeaponSlotsWithKit(cls.group, abilities.INT, level, kit));

  // Get allowed weapons for this class (kit-aware)
  let allowedWeaponKeys = $derived(getAllowedWeaponsWithKit(cls.key, kit));
  let allowedWeapons = $derived(
    allowedWeaponKeys.map(key => ({ key, ...weapons[key] }))
  );

  // Kit free proficiencies
  let kitFreeWeapons = $derived(getKitFreeWeapons(kit));
  let kitFreeNonWeapon = $derived(getKitFreeNonWeapon(kit));

  // Get available non-weapon proficiencies with costs
  let availableProficiencies = $derived(getAvailableProficiencies(cls.group));

  // Selected proficiencies (using simpler state for now, slots are derived)
  let selectedWeapons = $state([]);
  let selectedNonWeapon = $state([]);
  let selectedBonusLanguages = $state([]);

  // Track locked items
  let lockedWeapons = $state([]);
  let lockedNonWeapon = $state([]);

  // Languages
  let racialLanguageKeys = $derived(getRacialLanguages(race.key));
  let classLanguages = $derived(() => {
    // Add class-specific languages
    const classLangs = [];
    if (cls.key === 'druid') classLangs.push('druidic');
    if (cls.key === 'thief') classLangs.push('thiefsCant');
    return classLangs;
  });
  let autoLanguages = $derived([...racialLanguageKeys, ...classLanguages()]);
  let bonusLanguageSlots = $derived(getBonusLanguageSlots(abilities.INT));
  let allKnownLanguages = $derived([...autoLanguages, ...selectedBonusLanguages]);
  let bonusLanguageSlotsRemaining = $derived(bonusLanguageSlots - selectedBonusLanguages.length);

  // All selectable languages (including auto ones, just disabled)
  let allSelectableLanguages = $derived(() => {
    const allLangKeys = Object.keys(languages);
    return allLangKeys.filter(key => {
      const lang = languages[key];
      // Filter out class-restricted languages unless you're that class
      if (lang.classRestricted && lang.classRestricted !== cls.key) return false;
      return true;
    });
  });

  // Slot tracking
  let weaponSlotsUsed = $derived(selectedWeapons.length);
  let weaponSlotsRemaining = $derived(weaponSlots - weaponSlotsUsed);

  let nonWeaponSlotsUsed = $derived(
    selectedNonWeapon.reduce((sum, key) => {
      const prof = availableProficiencies.find(p => p.key === key);
      return sum + (prof?.cost ?? 1);
    }, 0)
  );
  let nonWeaponSlotsRemaining = $derived(nonWeaponSlots - nonWeaponSlotsUsed);

  // Group weapons by type
  let groupedWeapons = $derived(() => {
    const groups = {
      simple: { name: 'Simple', weapons: [] },
      axe: { name: 'Axes', weapons: [] },
      blunt: { name: 'Blunt', weapons: [] },
      polearm: { name: 'Polearms', weapons: [] },
      sword: { name: 'Swords', weapons: [] },
      bow: { name: 'Bows', weapons: [] },
      crossbow: { name: 'Crossbows', weapons: [] }
    };
    for (const w of allowedWeapons) {
      if (groups[w.group]) {
        groups[w.group].weapons.push(w);
      }
    }
    return groups;
  });

  // Group non-weapon proficiencies
  let groupedProficiencies = $derived(() => {
    const groups = {
      general: { name: 'General', profs: [] },
      warrior: { name: 'Warrior', profs: [] },
      wizard: { name: 'Wizard', profs: [] },
      priest: { name: 'Priest', profs: [] },
      rogue: { name: 'Rogue', profs: [] }
    };
    for (const p of availableProficiencies) {
      groups[p.group].profs.push(p);
    }
    return groups;
  });

  function toggleWeapon(key) {
    if (lockedWeapons.includes(key)) return;
    if (selectedWeapons.includes(key)) {
      selectedWeapons = selectedWeapons.filter(k => k !== key);
    } else if (weaponSlotsRemaining > 0) {
      selectedWeapons = [...selectedWeapons, key];
    }
  }

  function toggleProficiency(key) {
    if (lockedNonWeapon.includes(key)) return;
    const prof = availableProficiencies.find(p => p.key === key);
    if (!prof) return;

    if (selectedNonWeapon.includes(key)) {
      selectedNonWeapon = selectedNonWeapon.filter(k => k !== key);
    } else if (nonWeaponSlotsRemaining >= prof.cost) {
      selectedNonWeapon = [...selectedNonWeapon, key];
    }
  }

  function toggleLanguage(key) {
    if (selectedBonusLanguages.includes(key)) {
      selectedBonusLanguages = selectedBonusLanguages.filter(k => k !== key);
    } else if (bonusLanguageSlotsRemaining > 0) {
      selectedBonusLanguages = [...selectedBonusLanguages, key];
    }
  }

  function canComplete() {
    return weaponSlotsRemaining === 0 && nonWeaponSlotsRemaining >= 0;
  }

  function confirm() {
    if (!canComplete()) return;

    const weaponProfs = selectedWeapons.map(key => ({
      key,
      ...weapons[key]
    }));

    const nonWeaponProfs = selectedNonWeapon.map(key => {
      const prof = availableProficiencies.find(p => p.key === key);
      return { key, ...prof };
    });

    const allLanguages = allKnownLanguages.map(key => ({
      key,
      ...languages[key]
    }));

    onComplete({
      weapons: weaponProfs,
      nonWeapon: nonWeaponProfs,
      languages: allLanguages,
      unusedSlots: nonWeaponSlotsRemaining
    });
  }

  // Initialize from existing data
  onMount(() => {
    // Auto-select kit free proficiencies
    if (kit) {
      if (kitFreeWeapons.length > 0) {
        selectedWeapons = [...selectedWeapons, ...kitFreeWeapons.filter(k => allowedWeaponKeys.includes(k))];
        lockedWeapons = [...lockedWeapons, ...kitFreeWeapons];
      }
      if (kitFreeNonWeapon.length > 0) {
        selectedNonWeapon = [...selectedNonWeapon, ...kitFreeNonWeapon.filter(k =>
          availableProficiencies.some(p => p.key === k)
        )];
        lockedNonWeapon = [...lockedNonWeapon, ...kitFreeNonWeapon];
      }
    }

    if (existingProficiencies) {
      // Filter weapons: only keep ones that are still allowed for this class
      const existingWeaponKeys = existingProficiencies.weapons.map(w => w.key);
      const filteredExisting = existingWeaponKeys.filter(key =>
        allowedWeaponKeys.includes(key)
      );

      // Merge with kit free weapons
      selectedWeapons = [...new Set([...selectedWeapons, ...filteredExisting])];

      // Filter non-weapon proficiencies: only keep ones that are still available for this class
      const existingNonWeaponKeys = existingProficiencies.nonWeapon.map(p => p.key);
      const filteredExistingNW = existingNonWeaponKeys.filter(key =>
        availableProficiencies.some(p => p.key === key)
      );

      // Merge with kit free non-weapon proficiencies
      selectedNonWeapon = [...new Set([...selectedNonWeapon, ...filteredExistingNW])];

      // Restore bonus languages (exclude racial and class languages)
      if (existingProficiencies.languages) {
        const existingKeys = existingProficiencies.languages.map(l => l.key);
        selectedBonusLanguages = existingKeys.filter(key =>
          !racialLanguageKeys.includes(key) && !classLanguages().includes(key)
        );
      }

      // Lock existing picks when revisiting at higher level
      if (level > 1) {
        lockedWeapons = [...new Set([...lockedWeapons, ...selectedWeapons])];
        lockedNonWeapon = [...new Set([...lockedNonWeapon, ...selectedNonWeapon])];
      }
    }
  });
</script>

<div class="flex-column gap-lg">
  <div class="slot-summary panel">
    <SlotCounter label="Weapon Proficiencies" used={weaponSlotsUsed} total={weaponSlots} />
    <SlotCounter label="Non-Weapon Proficiencies" used={nonWeaponSlotsUsed} total={nonWeaponSlots} />
  </div>

  <div class="flex-column gap-lg">
    <WeaponProficiencyPanel
      {groupedWeapons}
      {selectedWeapons}
      {lockedWeapons}
      {weaponSlots}
      {weaponSlotsRemaining}
      onToggle={toggleWeapon}
    />

    <LanguagePanel
      {allSelectableLanguages}
      {autoLanguages}
      {selectedBonusLanguages}
      {bonusLanguageSlots}
      {bonusLanguageSlotsRemaining}
      onToggle={toggleLanguage}
    />

    <NonWeaponProficiencyPanel
      {groupedProficiencies}
      {selectedNonWeapon}
      {lockedNonWeapon}
      {nonWeaponSlots}
      {nonWeaponSlotsRemaining}
      onToggle={toggleProficiency}
    />
  </div>

  <ProficiencySummary {selectedWeapons} {selectedNonWeapon} />

  <button
    class="btn-primary"
    onclick={confirm}
    disabled={!canComplete()}
  >
    {#if weaponSlotsRemaining > 0}
      Select {weaponSlotsRemaining} more weapon{weaponSlotsRemaining !== 1 ? 's' : ''}
    {:else}
      Confirm Proficiencies → Equipment
    {/if}
  </button>
</div>


<style lang="scss">
  @import './styles/shared';
  @import './styles/proficiency';
</style>

