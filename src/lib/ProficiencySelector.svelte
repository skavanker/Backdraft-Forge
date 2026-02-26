<script>
  import {
    weapons,
    nonWeaponProficiencies,
    getWeaponSlots,
    getNonWeaponSlots,
    getAllowedWeapons,
    getAvailableProficiencies,
    getWeaponSlotsWithKit,
    getNonWeaponSlotsWithKit,
    getAllowedWeaponsWithKit,
    getKitFreeWeapons,
    getKitFreeNonWeapon,
    isWeaponRestrictedByKit
  } from '../data/proficiencies.js';
  import {
    languages,
    getBonusLanguageSlots,
    getRacialLanguages,
    getAvailableBonusLanguages
  } from '../data/languages.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SlotCounter from './SlotCounter.svelte';

  let { abilities, race, cls, kit = null, level = 1, existingProficiencies = null, onComplete } = $props();

  // Calculate available slots (level-aware, kit-aware)
  let weaponSlots = $derived(getWeaponSlotsWithKit(cls.group, level, kit));
  let nonWeaponSlots = $derived(getNonWeaponSlotsWithKit(cls.group, abilities.INT, level, kit));

  // Track which proficiencies are locked (from previous levels, can't be removed)
  let lockedWeapons = $state([]);
  let lockedNonWeapon = $state([]);

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

  // Selected proficiencies
  let selectedWeapons = $state([]);
  let selectedNonWeapon = $state([]);
  let selectedBonusLanguages = $state([]);

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

<div class="proficiency-selector">
  <div class="slot-summary">
    <SlotCounter label="Weapon Proficiencies" used={weaponSlotsUsed} total={weaponSlots} />
    <SlotCounter label="Non-Weapon Proficiencies" used={nonWeaponSlotsUsed} total={nonWeaponSlots} />
  </div>

  <div class="proficiency-sections">
    <!-- Weapon Proficiencies -->
    <div class="section">
      <h3>Weapon Proficiencies</h3>
      <p class="section-hint">
        Select {weaponSlots} weapon{weaponSlots !== 1 ? 's' : ''} your character is trained with.
        {#if weaponSlotsRemaining > 0}
          <span class="meta-text remaining">({weaponSlotsRemaining} remaining)</span>
        {/if}
      </p>

      <div class="weapon-section">
        {#each Object.entries(groupedWeapons()) as [groupKey, group]}
          {#if group.weapons.length > 0}
            <div class="weapon-group">
              <h4 class="group-title">{group.name}</h4>
              <div class="weapon-grid">
                {#each group.weapons as weapon}
                  {@const isLocked = lockedWeapons.includes(weapon.key)}
                  {@const selected = selectedWeapons.includes(weapon.key)}
                  {@const disabled = !selected && weaponSlotsRemaining === 0}
                  <Tooltip text="{weapon.damage} damage, Speed {weapon.speed}" position="bottom">
                    <button
                      class="proficiency-chip"
                      class:selected
                      class:disabled
                      class:locked={isLocked}
                      onclick={() => !disabled && !isLocked && toggleWeapon(weapon.key)}
                    >
                      <span class="chip-name">{weapon.name}</span>
                      <span class="chip-meta">{weapon.damage}</span>
                    </button>
                  </Tooltip>
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Languages -->
    <div class="section language-section">
      <h3>Languages</h3>
      <p class="section-hint">
        Select languages. Your race and class grant some automatically.
        {#if bonusLanguageSlots > 0}
          Your Intelligence grants {bonusLanguageSlots} additional language{bonusLanguageSlots !== 1 ? 's' : ''}.
          {#if bonusLanguageSlotsRemaining > 0}
            <span class="meta-text remaining">({bonusLanguageSlotsRemaining} bonus remaining)</span>
          {/if}
        {/if}
      </p>

      <div class="language-grid">
        {#each allSelectableLanguages() as key}
          {@const isAuto = autoLanguages.includes(key)}
          {@const selected = isAuto || selectedBonusLanguages.includes(key)}
          {@const disabled = isAuto || (!selected && bonusLanguageSlotsRemaining === 0)}
          <button
            class="language-chip"
            class:selected
            class:disabled
            class:auto={isAuto}
            onclick={() => !disabled && !isAuto && toggleLanguage(key)}
          >
            {languages[key].name}
          </button>
        {/each}
      </div>
    </div>

    <!-- Non-Weapon Proficiencies -->
    <div class="section">
      <h3>Non-Weapon Proficiencies</h3>
      <p class="section-hint">
        Select skills for your character. Different skill groups cost different amounts.
        {#if nonWeaponSlotsRemaining > 0}
          <span class="meta-text remaining">({nonWeaponSlotsRemaining} slots remaining)</span>
        {/if}
      </p>

      <div class="nonweapon-section">
        {#each Object.entries(groupedProficiencies()) as [groupKey, group]}
          {#if group.profs.length > 0}
            {@const costForGroup = group.profs[0]?.cost ?? 1}
            <div class="proficiency-group">
              <h4 class="group-title">
                {group.name}
                <span class="group-cost">({costForGroup} slot{costForGroup !== 1 ? 's' : ''} each)</span>
              </h4>
              <div class="proficiency-grid">
                {#each group.profs as prof}
                  {@const isLocked = lockedNonWeapon.includes(prof.key)}
                  {@const selected = selectedNonWeapon.includes(prof.key)}
                  {@const disabled = !selected && nonWeaponSlotsRemaining < prof.cost}
                  <Tooltip text="{prof.description} (Check: {prof.ability}{prof.modifier >= 0 ? '+' : ''}{prof.modifier})" position="bottom">
                    <button
                      class="proficiency-chip"
                      class:selected
                      class:disabled
                      class:locked={isLocked}
                      onclick={() => !disabled && !isLocked && toggleProficiency(prof.key)}
                    >
                      <span class="chip-name">{prof.name}</span>
                      <span class="chip-meta">{prof.ability}</span>
                      {#if prof.cost > 1}
                        <span class="chip-cost">{prof.cost}</span>
                      {/if}
                    </button>
                  </Tooltip>
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>

  <!-- Selection Summary -->
  {#if selectedWeapons.length > 0 || selectedNonWeapon.length > 0}
    <div class="selection-summary">
      <div class="divider"><span class="ornament">◆</span></div>

      <h3>Selected Proficiencies</h3>

      <div class="summary-columns">
        {#if selectedWeapons.length > 0}
          <div class="summary-section">
            <h4>Weapons</h4>
            <ul class="summary-list">
              {#each selectedWeapons as key}
                {@const w = weapons[key]}
                <li>
                  <span class="summary-name">{w.name}</span>
                  <span class="summary-detail">{w.damage}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        {#if selectedNonWeapon.length > 0}
          <div class="summary-section">
            <h4>Skills</h4>
            <ul class="summary-list">
              {#each selectedNonWeapon as key}
                {@const p = nonWeaponProficiencies[key]}
                <li>
                  <span class="summary-name">{p.name}</span>
                  <span class="summary-detail">{p.ability}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  {/if}

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
  .proficiency-selector {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .slot-summary {
    display: flex;
    justify-content: center;
    gap: $space-xl;
    padding: $space-md;
    background: var(--bg-panel);
    border-radius: 4px;
  }

  .proficiency-sections {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .section {
    h3 {
      margin: 0 0 0.35rem;
    }
  }

  .remaining {
    color: var(--gold-dark);
  }

  .weapon-section,
  .nonweapon-section {
    columns: 4 180px;
    column-gap: $space-lg;

    .weapon-group,
    .proficiency-group {
      break-inside: avoid;
      margin-bottom: $space-md;
    }

    .group-title {
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.4rem;
      padding-bottom: 0.2rem;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .group-cost {
    text-transform: none;
    opacity: 0.8;
  }

  .language-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: $space-sm;

    @media (max-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .language-chip {
    @include selectable-chip;

    &:hover:not(.disabled):not(.auto) {
      color: var(--text-hover);
    }

    &.auto {
      border-color: var(--border-strong);
      cursor: default;
      opacity: 0.9;
    }
  }

  .weapon-grid,
  .proficiency-grid {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .proficiency-chip {
    @include selectable-chip;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    width: 100%;
    text-align: left;

    .chip-name {
      flex: 1;
    }

    .chip-meta {
      padding: 0.1rem 0.3rem;
      background: var(--bg-panel);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .chip-cost {
      color: var(--gold-dark);
      padding: 0.1rem 0.35rem;
      background: rgba(201, 162, 39, 0.15);
      border: 1px solid rgba(201, 162, 39, 0.3);
      border-radius: 2px;
      flex-shrink: 0;
    }

    &:hover:not(.disabled):not(.locked) {
      .chip-name {
        color: var(--text-hover);
      }
    }

    &.locked {
      cursor: default;
      opacity: 0.7;

      &::after {
        content: '🔒';
        font-size: 0.7em;
        margin-left: 0.3rem;
      }
    }
  }

  .selection-summary {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: $space-md;
    background: var(--bg-subtle);
    border-radius: 4px;
    margin-top: $space-sm;

    h3 {
      text-align: center;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-strong), transparent);
      }

      .ornament {
        color: var(--gold-dark);
      }
    }
  }

  .summary-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: $space-md;
  }

  .summary-section {
    h4 {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.2rem;
    }
  }

  .summary-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      padding: 0.2rem 0;
    }
  }

  .btn-primary {
    align-self: center;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
</style>
