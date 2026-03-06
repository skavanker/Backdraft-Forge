<script>
  import { rollAbilityDice, calculate3d6, calculate4d6DropLowest } from './dice.js';
  import { onMount } from 'svelte';
  import ImportArea from './ImportArea.svelte';
  import Tooltip from './Tooltip.svelte';
  import { isTyping, useGlobalKeydown } from './utils/keyboard.js';
  import { ABILITIES } from '../data/constants.js';
  import { settings } from './settings.svelte.js';
  const ABILITY_NAMES = {
    STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
    INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
  };

  let { onComplete, onImport, existingRollData = null, onManualMode } = $props();

  let method = $state(settings.rollMethod);
  let rawDice = $state(null);
  let assignments = $state({
    STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
  });
  let selectedRollIndex = $state(null);
  let rollCount = $state(0);

  let calculatedScores = $derived(() => {
    if (!rawDice) return null;
    return rawDice.map(dice =>
      method === '3d6' ? calculate3d6(dice) : calculate4d6DropLowest(dice)
    );
  });

  let allAssigned = $derived(
    Object.values(assignments).every(v => v !== null)
  );

  function rollScores() {
    rawDice = rollAbilityDice();
    assignments = { STR: 0, DEX: 1, CON: 2, INT: 3, WIS: 4, CHA: 5 };
    selectedRollIndex = null;
    rollCount++;
  }

  function selectRoll(index) {
    if (selectedRollIndex === null) {
      selectedRollIndex = index;
    } else if (selectedRollIndex === index) {
      selectedRollIndex = null;
    } else {
      // Swap assignments between the two dice
      const abilityA = ABILITIES.find(a => assignments[a] === selectedRollIndex);
      const abilityB = ABILITIES.find(a => assignments[a] === index);
      if (abilityA && abilityB) {
        assignments[abilityA] = index;
        assignments[abilityB] = selectedRollIndex;
      }
      selectedRollIndex = null;
    }
  }

  useGlobalKeydown((e) => {
    if (isTyping() || e.ctrlKey || e.metaKey || e.altKey) return;

    // Space or Enter — context-sensitive roll/continue
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!rawDice) {
        rollScores();
      } else if (allAssigned) {
        complete();
      }
      return;
    }

  });

  onMount(() => {
    if (existingRollData) {
      method = existingRollData.method;
      rawDice = existingRollData.rawDice;
      assignments = existingRollData.assignments;
    }
  });

  function complete() {
    const scores = calculatedScores();
    const finalScores = {};
    for (const ability of ABILITIES) {
      finalScores[ability] = scores[assignments[ability]].total;
    }

    const rollData = {
      method,
      rawDice,
      assignments
    };

    onComplete({ abilities: finalScores, rollData });
  }
</script>

<div class="method-select">
  <Tooltip text="Roll 4 six-sided dice, drop the lowest. Produces higher scores on average (12.24). The standard method for most campaigns." warning={rollCount >= 5 ? "You can always enter scores manually if you want to cheat 😏" : ""}>
    <label class:selected={method === '4d6drop'} onclick={() => { method = '4d6drop'; rollScores(); }}>
      <input type="radio" bind:group={method} value="4d6drop" />
      <strong>4d6 drop lowest</strong>
      <span class="meta-text">Recommended</span>
    </label>
  </Tooltip>
  <Tooltip text="Roll 3 six-sided dice and take the total. Produces lower, more random scores (10.5 avg). For old-school or hardcore play." warning={rollCount >= 5 ? "You can always enter scores manually if you want to cheat 😏" : ""}>
    <label class:selected={method === '3d6'} onclick={() => { method = '3d6'; rollScores(); }}>
      <input type="radio" bind:group={method} value="3d6" />
      <strong>3d6 straight</strong>
      <span class="meta-text">Classic / Hardcore</span>
    </label>
  </Tooltip>
</div>

<div class="roll-action">
  {#if !rawDice}
    <button class="btn-primary btn-lg" onclick={rollScores}>
      🎲 Roll Ability Scores
    </button>
  {/if}
  <button class="btn-secondary btn-sm" onclick={onManualMode}>
    ✏️ Enter scores manually
  </button>
  <ImportArea {onImport} />
</div>

{#if rawDice}
  {@const scores = calculatedScores()}

  <!-- Rolled dice display -->
  <div class="section">
    <h3>Your Abilities</h3>
    <p class="section-hint">Click two scores to swap their assignments.</p>
    <div class="dice-results animate-in">
      {#each scores as score, i}
        {@const assignedTo = ABILITIES.find(a => assignments[a] === i)}
        <button
          class="dice-roll"
          class:selected={selectedRollIndex === i}
          onclick={() => selectRoll(i)}
        >
          {#if assignedTo}
            <span class="assigned-label">{assignedTo}</span>
            <span class="assigned-name">{ABILITY_NAMES[assignedTo]}</span>
          {/if}
          <span class="roll-total">{score.total}</span>
          <span class="roll-dice">
            {#if method === '3d6'}
              {#each rawDice[i].slice(0, 3) as die}
                <span class="die">
                  <img src="/dice/d6-{die}.svg" alt="{die}" />
                </span>
              {/each}
              <span class="die unused">
                <img src="/dice/d6-{rawDice[i][3]}.svg" alt="{rawDice[i][3]}" />
              </span>
            {:else}
              {@const sorted = [...rawDice[i]].sort((a, b) => a - b)}
              {@const droppedIdx = sorted.indexOf(score.dropped)}
              {#each sorted as die, j}
                <span class="die" class:dropped={j === droppedIdx}>
                  <img src="/dice/d6-{die}.svg" alt="{die}" />
                </span>
              {/each}
            {/if}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Continue -->
  {#if allAssigned}
    <div class="continue-section">
      <div class="divider"><span class="ornament">◆</span></div>
      <button class="btn-primary" onclick={complete}>
        Continue to Race Selection →
      </button>
    </div>
  {/if}
{/if}


<style lang="scss">
  @import './styles/shared';
  @import './styles/roller';
</style>

