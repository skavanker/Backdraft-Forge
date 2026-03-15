<script>
  import BtnSelect from './BtnSelect.svelte';
  import Tooltip from '../Tooltip.svelte';

  let {
    groupedProficiencies,
    selectedNonWeapon,
    lockedNonWeapon,
    nonWeaponSlots,
    nonWeaponSlotsRemaining,
    onToggle
  } = $props();

  const groupIcons = {
    warrior: '/icons/fighter.svg',
    wizard:  '/icons/mage.svg',
    priest:  '/icons/cleric.svg',
    rogue:   '/icons/thief.svg',
  };

  const groupLabels = {
    warrior: 'Warrior',
    wizard:  'Wizard',
    priest:  'Priest',
    rogue:   'Rogue',
    general: 'General',
  };

  const abilities = ['STR', 'DEX', 'INT', 'WIS', 'CHA'];
  const classGroups = ['warrior', 'wizard', 'priest', 'rogue'];

  let activeFilter = $state(null); // 'ability:STR' | 'group:warrior' | null

  const filterAbility = $derived(activeFilter?.startsWith('ability:') ? activeFilter.slice(8) : null);
  const filterGroup   = $derived(activeFilter?.startsWith('group:')   ? activeFilter.slice(6) : null);

  // Flatten all groups, deduplicate by key, sort by cost then name
  const sortedProfs = $derived(() => {
    const seen = new Set();
    const flat = [];
    for (const group of Object.values(groupedProficiencies())) {
      for (const prof of group.profs) {
        if (!seen.has(prof.key)) {
          seen.add(prof.key);
          flat.push(prof);
        }
      }
    }
    return flat.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  });

  // Split into cost tiers [1, 2, 3]
  const costTiers = $derived(() => {
    const tiers = {};
    for (const prof of sortedProfs()) {
      (tiers[prof.cost] ??= []).push(prof);
    }
    return Object.entries(tiers).map(([cost, profs]) => ({ cost: Number(cost), profs }));
  });

  function isHighlighted(prof) {
    const abilityMatch = filterAbility ? prof.ability === filterAbility : true;
    const groupMatch   = filterGroup   ? prof.groups.includes(filterGroup) : true;
    return abilityMatch && groupMatch;
  }

  function hasActiveFilter() {
    return filterAbility !== null || filterGroup !== null;
  }
</script>

<div class="section">
  <div class="nwp-header">
    <h3 id="nonweapon-profs-heading">Non-Weapon Proficiencies</h3>
    <div class="nwp-filter-chips">
      {#each abilities as ab}
        <button
          type="button"
          class="nwp-chip"
          class:active={filterAbility === ab}
          onclick={() => activeFilter = activeFilter === `ability:${ab}` ? null : `ability:${ab}`}
          title="Filter by {ab}"
        >{ab}</button>
      {/each}
      <span class="nwp-chip-divider">|</span>
      {#each classGroups as grp}
        <button
          type="button"
          class="nwp-chip"
          class:active={filterGroup === grp}
          onclick={() => activeFilter = activeFilter === `group:${grp}` ? null : `group:${grp}`}
          title="Filter by {groupLabels[grp]}"
        ><img src={groupIcons[grp]} alt={groupLabels[grp]} class="nwp-chip-icon" /></button>
      {/each}
    </div>
  </div>
  <p class="section-hint">
    Sorted by slot cost. Native group skills cost listed slots; others cost +1.
    {#if nonWeaponSlotsRemaining > 0}
      <span class="meta-text remaining">({nonWeaponSlotsRemaining} slots remaining)</span>
    {/if}
  </p>

  <div role="group" aria-labelledby="nonweapon-profs-heading">
    {#each costTiers() as { cost, profs }}
      <div class="nwp-tier">
        <div class="nwp-tier-header">
          <span class="nwp-tier-label">{cost} Slot{cost !== 1 ? 's' : ''}</span>
        </div>
        <div class="grid-compact gap-sm">
          {#each profs as prof}
            {@const isLocked = lockedNonWeapon.includes(prof.key)}
            {@const selected = selectedNonWeapon.includes(prof.key)}
            {@const disabled = !selected && nonWeaponSlotsRemaining < prof.cost}
            {@const nativeIcons = prof.groups.filter(g => groupIcons[g])}
            {@const highlighted = isHighlighted(prof)}
            <Tooltip text="{prof.description} (Check: {prof.ability}{prof.modifier >= 0 ? '+' : ''}{prof.modifier})" position="bottom">
              <div class="nwp-card" class:nwp-highlighted={hasActiveFilter() && highlighted}>
                <BtnSelect
                  label={prof.name}
                  metadata={prof.ability}
                  cost={prof.cost}
                  {selected}
                  {disabled}
                  locked={isLocked}
                  onclick={() => onToggle(prof.key)}
                />
                {#if nativeIcons.length > 0}
                  <div class="nwp-icons" aria-hidden="true">
                    {#each nativeIcons as group}
                      <div class="nwp-icon" style="--icon-src: url({groupIcons[group]})" title={groupLabels[group]} aria-label={groupLabels[group]}></div>
                    {/each}
                  </div>
                {/if}
              </div>
            </Tooltip>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../styles/mixins.scss' as *;

  .nwp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-sm;
    margin-bottom: $space-xs;

    h3 { margin: 0; }
  }

  .nwp-filter-chips {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .nwp-chip-divider {
    color: var(--border-color);
    font-size: $text-xs;
    padding: 0 2px;
    user-select: none;
  }

  .nwp-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: none;
    border: 1px solid transparent;
    border-radius: $radius;
    cursor: pointer;
    font-size: 9px;
    font-weight: 700;
    color: var(--text-muted);
    line-height: 1;
    transition: color 0.15s, border-color 0.15s, background 0.15s;

    &:hover {
      color: var(--text-primary);
      border-color: var(--border-color);
    }

    &.active {
      color: var(--gold-dark);
      border-color: var(--gold);
      background: var(--gold-overlay);
    }
  }

  .nwp-chip-icon {
    width: 12px;
    height: 12px;
    filter: invert(0.4);

    .nwp-chip.active & {
      filter: sepia(1) saturate(4) brightness(0.7);
    }
  }

  .nwp-tier {
    margin-bottom: $space-lg;
  }

  .nwp-tier-header {
    display: flex;
    align-items: center;
    gap: $space-sm;
    margin-bottom: $space-sm;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
    }
  }

  .nwp-tier-label {
    font-size: $text-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--gold-dark);
    white-space: nowrap;
    padding: 0 $space-xs;
  }

  .nwp-card {
    position: relative;
    width: 100%;

    :global(.tooltip-wrap) { width: 100%; display: block; }
    :global(.btn-select) { width: 100%; }

    &.nwp-highlighted :global(.btn-select) {
      outline: 2px solid var(--gold);
      outline-offset: 1px;
    }
  }

  .nwp-icons {
    display: flex;
    gap: 2px;
    position: absolute;
    bottom: 4px;
    right: 4px;
    pointer-events: none;
  }

  .nwp-icon {
    width: 16px;
    height: 16px;
    background-color: var(--gold);
    mask-image: var(--icon-src);
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
  }
</style>
