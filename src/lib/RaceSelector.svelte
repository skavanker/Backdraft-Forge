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

<div class="wizard-step">
  <p class="intro">
    Based on your ability scores, you qualify for <strong>{qualifiedCount}</strong> of {raceOptions.length} races.
  </p>

  <div class="selection-grid">
    {#each raceOptions as { key, race, qualified, failedReqs }}
      {@const tooltipText = !qualified ? `Not available: ${failedReqs.join(', ')}` : ''}
      <Tooltip text={tooltipText} position="bottom">
        <button
          class="selection-card"
          class:selected={selectedRaceKey === key}
          class:disabled={!qualified}
          onclick={() => qualified && selectRace(key)}
          disabled={!qualified}
        >
          <h3 class="card-name">{race.name}</h3>
          <p class="card-desc">{race.description}</p>

          {#if Object.keys(race.adjustments).length > 0}
            <div class="card-meta">
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
  @import './components.module.scss';

</style>

