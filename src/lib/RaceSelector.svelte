<script>
  import { getAvailableRaces, applyRacialAdjustments } from '../data/races.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SelectionPreview from './SelectionPreview.svelte';

  let { abilities, existingRaceKey = null, onComplete } = $props();

  let selectedRaceKey = $state(existingRaceKey);

  let raceOptions = $derived(getAvailableRaces(abilities));
  let qualifiedCount = $derived(raceOptions.filter(r => r.qualified).length);

  let selectedRace = $derived(
    selectedRaceKey ? raceOptions.find(r => r.key === selectedRaceKey)?.race : null
  );

  let adjustedAbilities = $derived(
    selectedRace ? applyRacialAdjustments(abilities, selectedRace) : null
  );

  function selectRace(key) {
    selectedRaceKey = key;
  }

  function confirm() {
    if (!selectedRace) return;
    onComplete({
      raceKey: selectedRaceKey,
      race: selectedRace,
      adjustedAbilities
    });
  }
</script>

<div class="race-selector">
  <p class="intro">
    Based on your ability scores, you qualify for <strong>{qualifiedCount}</strong> of {raceOptions.length} races.
  </p>

  <div class="race-grid">
    {#each raceOptions as { key, race, qualified, failedReqs }}
      {@const tooltipText = !qualified ? `Not available: ${failedReqs.join(', ')}` : ''}
      <Tooltip text={tooltipText} position="bottom">
        <button
          class="race-card"
          class:selected={selectedRaceKey === key}
          class:disabled={!qualified}
          onclick={() => qualified && selectRace(key)}
          disabled={!qualified}
        >
          <h3 class="race-name">{race.name}</h3>
          <p class="race-desc">{race.description}</p>

          {#if Object.keys(race.adjustments).length > 0}
            <div class="adjustments">
              {#each Object.entries(race.adjustments) as [ability, mod]}
                <span class="adjustment" class:positive={mod > 0} class:negative={mod < 0}>
                  {mod > 0 ? '+' : ''}{mod} {ability}
                </span>
              {/each}
            </div>
          {/if}

          {#if !qualified}
            <span class="unavailable-badge">Unavailable</span>
          {/if}
        </button>
      </Tooltip>
    {/each}
  </div>

  {#if selectedRace}
    <SelectionPreview
      title={selectedRace.name}
      confirmLabel="Confirm {selectedRace.name} → Choose Class"
      onConfirm={confirm}
    >
      <div class="traits-section">
        <h4>Racial Traits</h4>
        <ul class="traits-list">
          {#each selectedRace.traits as trait}
            <li>{trait}</li>
          {/each}
        </ul>
      </div>

      <div class="abilities-section">
        <h4>Adjusted Abilities</h4>
        <div class="ability-comparison">
          {#each ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as ability}
            {@const base = abilities[ability]}
            {@const adjusted = adjustedAbilities[ability]}
            {@const diff = adjusted - base}
            <div class="ability-row">
              <span class="ability-label">{ability}</span>
              <span class="ability-base">{base}</span>
              {#if diff !== 0}
                <span class="ability-arrow">→</span>
                <span class="ability-adjusted" class:positive={diff > 0} class:negative={diff < 0}>
                  {adjusted}
                </span>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <div class="classes-section">
        <h4>Available Classes</h4>
        <div class="class-list">
          {#each Object.entries(selectedRace.classes) as [cls, limit]}
            <span class="class-tag">
              {cls}{#if limit !== null} <small>(max level {limit})</small>{/if}
            </span>
          {/each}
        </div>
      </div>
    </SelectionPreview>
  {/if}
</div>

<style lang="scss">
  .race-selector {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .intro {
    text-align: center;
  }

  .race-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: $space-md;
  }

  .race-card {
    @include selectable-card;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 1.25rem;

    &:hover:not(.disabled) {
      .race-name, .race-desc {
        color: var(--text-hover);
      }
    }

    &.selected {
      background: rgba(201, 162, 39, 0.1);

      &:hover:not(.disabled) {
        background: rgba(201, 162, 39, 0.2);
      }
    }

    &.disabled {
      opacity: 0.5;
      background: var(--bg-subtle);
    }

    .race-desc {
      flex: 1;
    }

    .adjustments {
      display: flex;
      gap: $space-sm;
      margin-top: 0.75rem;
    }

    .adjustment {
      padding: 0.2rem $space-sm;
      border-radius: 2px;

      &.positive {
        background: rgba(34, 139, 34, 0.15);
        color: var(--green);
      }

      &.negative {
        background: rgba(139, 37, 0, 0.15);
        color: var(--red);
      }
    }

    .unavailable-badge {
      margin-top: 0.75rem;
      padding: $space-xs $space-sm;
      background: rgba(139, 37, 0, 0.1);
      border: 1px solid rgba(139, 37, 0, 0.3);
      border-radius: 2px;
      color: var(--red);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  // h4 styles for slotted content (Svelte scoping won't reach into child component)
  h4 {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: $space-xs;
  }

  .traits-list {
    margin: 0;
    padding-left: 1.25rem;

    li {
      margin-bottom: $space-xs;
    }
  }

  .ability-comparison {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }

  .ability-row {
    display: flex;
    align-items: center;
    gap: $space-sm;

    .ability-label {
      width: 2.5rem;
    }

    .ability-base {
      width: 1.5rem;
      text-align: center;
    }

    .ability-arrow {
      color: var(--text-faint);
    }

    .ability-adjusted {
      &.positive {
        color: var(--green);
      }

      &.negative {
        color: var(--red);
      }
    }
  }

  .class-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
  }

  .class-tag {
    padding: $space-xs $space-sm;
    background: var(--bg-panel);
    border-radius: 2px;
    text-transform: capitalize;
  }
</style>
