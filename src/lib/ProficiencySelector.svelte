<script>
  import {
    weapons,
    nonWeaponProficiencies,
    getWeaponSlots,
    getNonWeaponSlots,
    getAllowedWeapons,
    getAvailableProficiencies
  } from '../data/proficiencies.js';
  import Tooltip from './Tooltip.svelte';

  let { abilities, cls, onComplete } = $props();

  // Calculate available slots
  let weaponSlots = $derived(getWeaponSlots(cls.group));
  let nonWeaponSlots = $derived(getNonWeaponSlots(cls.group, abilities.INT));

  // Get allowed weapons for this class
  let allowedWeaponKeys = $derived(getAllowedWeapons(cls.key));
  let allowedWeapons = $derived(
    allowedWeaponKeys.map(key => ({ key, ...weapons[key] }))
  );

  // Get available non-weapon proficiencies with costs
  let availableProficiencies = $derived(getAvailableProficiencies(cls.group));

  // Selected proficiencies
  let selectedWeapons = $state([]);
  let selectedNonWeapon = $state([]);

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
      sword: { name: 'Swords', weapons: [] },
      axe: { name: 'Axes', weapons: [] },
      blunt: { name: 'Blunt', weapons: [] },
      polearm: { name: 'Polearms', weapons: [] },
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
    if (selectedWeapons.includes(key)) {
      selectedWeapons = selectedWeapons.filter(k => k !== key);
    } else if (weaponSlotsRemaining > 0) {
      selectedWeapons = [...selectedWeapons, key];
    }
  }

  function toggleProficiency(key) {
    const prof = availableProficiencies.find(p => p.key === key);
    if (!prof) return;

    if (selectedNonWeapon.includes(key)) {
      selectedNonWeapon = selectedNonWeapon.filter(k => k !== key);
    } else if (nonWeaponSlotsRemaining >= prof.cost) {
      selectedNonWeapon = [...selectedNonWeapon, key];
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

    onComplete({
      weapons: weaponProfs,
      nonWeapon: nonWeaponProfs,
      unusedSlots: nonWeaponSlotsRemaining
    });
  }
</script>

<div class="proficiency-selector">
  <div class="slot-summary">
    <div class="slot-counter">
      <span class="slot-label">Weapon Proficiencies</span>
      <span class="slot-value" class:complete={weaponSlotsRemaining === 0}>
        {weaponSlotsUsed} / {weaponSlots}
      </span>
    </div>
    <div class="slot-counter">
      <span class="slot-label">Non-Weapon Proficiencies</span>
      <span class="slot-value">
        {nonWeaponSlotsUsed} / {nonWeaponSlots}
      </span>
    </div>
  </div>

  <div class="proficiency-sections">
    <!-- Weapon Proficiencies -->
    <div class="section weapon-section">
      <h3>Weapon Proficiencies</h3>
      <p class="section-hint">
        Select {weaponSlots} weapon{weaponSlots !== 1 ? 's' : ''} your character is trained with.
        {#if weaponSlotsRemaining > 0}
          <span class="remaining">({weaponSlotsRemaining} remaining)</span>
        {/if}
      </p>

      {#each Object.entries(groupedWeapons()) as [groupKey, group]}
        {#if group.weapons.length > 0}
          <div class="weapon-group">
            <h4 class="group-title">{group.name}</h4>
            <div class="weapon-grid">
              {#each group.weapons as weapon}
                {@const selected = selectedWeapons.includes(weapon.key)}
                {@const disabled = !selected && weaponSlotsRemaining === 0}
                <Tooltip text="{weapon.damage} damage, Speed {weapon.speed}" position="bottom">
                  <button
                    class="proficiency-chip"
                    class:selected
                    class:disabled
                    onclick={() => !disabled && toggleWeapon(weapon.key)}
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

    <!-- Non-Weapon Proficiencies -->
    <div class="section nonweapon-section">
      <h3>Non-Weapon Proficiencies</h3>
      <p class="section-hint">
        Select skills for your character. Different skill groups cost different amounts.
        {#if nonWeaponSlotsRemaining > 0}
          <span class="remaining">({nonWeaponSlotsRemaining} slots remaining)</span>
        {/if}
      </p>

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
                {@const selected = selectedNonWeapon.includes(prof.key)}
                {@const disabled = !selected && nonWeaponSlotsRemaining < prof.cost}
                <Tooltip text="{prof.description} (Check: {prof.ability}{prof.modifier >= 0 ? '+' : ''}{prof.modifier})" position="bottom">
                  <button
                    class="proficiency-chip"
                    class:selected
                    class:disabled
                    onclick={() => !disabled && toggleProficiency(prof.key)}
                  >
                    <span class="chip-name">{prof.name}</span>
                    <span class="chip-meta">{prof.ability}</span>
                  </button>
                </Tooltip>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
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
    gap: 1.5rem;
  }

  .slot-summary {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
    background: var(--bg-panel);
    border-radius: 4px;
  }

  .slot-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    .slot-label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .slot-value {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);

      &.complete {
        color: #228b22;
      }
    }
  }

  .proficiency-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section {
    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
    }

    .section-hint {
      margin: 0 0 1rem;
      font-size: 0.9rem;
      color: var(--text-muted);

      .remaining {
        color: var(--gold-dark);
        font-weight: 600;
      }
    }
  }

  .weapon-group,
  .proficiency-group {
    margin-bottom: 1rem;

    .group-title {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.5rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .proficiency-group .group-cost {
    font-weight: normal;
    text-transform: none;
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .weapon-grid,
  .proficiency-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .proficiency-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.85rem;

    .chip-name {
      color: var(--text-body);
    }

    .chip-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
      padding: 0.1rem 0.3rem;
      background: var(--bg-panel);
      border-radius: 2px;
    }

    &:hover:not(.disabled) {
      border-color: var(--border-strong);
      background: var(--bg-subtle);
    }

    &.selected {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.15);

      .chip-name {
        color: var(--text-primary);
        font-weight: 600;
      }
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .selection-summary {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h3 {
      text-align: center;
      margin: 0;
      font-size: 1.25rem;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;

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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .summary-section {
    h4 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: var(--text-body);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.25rem;
    }
  }

  .summary-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      padding: 0.25rem 0;
      font-size: 0.9rem;

      .summary-name {
        color: var(--text-body);
      }

      .summary-detail {
        color: var(--text-muted);
        font-size: 0.8rem;
      }
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
