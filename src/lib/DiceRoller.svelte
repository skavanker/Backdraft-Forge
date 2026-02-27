<script>
  import { rollAbilityDice, calculate3d6, calculate4d6DropLowest, rollExceptionalStrength } from './dice.js';
  import { onMount } from 'svelte';
  import ImportArea from './ImportArea.svelte';
  import { isTyping } from './utils/keyboard.js';
  import { ABILITIES } from '../data/constants.js';
  const MAX_REROLLS = 2;

  let { onComplete, onImport, existingRollData = null, onManualMode } = $props();

  let method = $state('4d6drop');
  let rawDice = $state(null);
  let assignments = $state({
    STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
  });
  let exceptionalStr = $state(null);
  let selectedRollIndex = $state(null);
  let rerollsUsed = $state(0);

  let calculatedScores = $derived(() => {
    if (!rawDice) return null;
    return rawDice.map(dice =>
      method === '3d6' ? calculate3d6(dice) : calculate4d6DropLowest(dice)
    );
  });

  let assignedIndices = $derived(
    new Set(Object.values(assignments).filter(v => v !== null))
  );

  let allAssigned = $derived(
    Object.values(assignments).every(v => v !== null)
  );

  let needsExceptionalRoll = $derived(
    assignments.STR !== null &&
    calculatedScores() &&
    calculatedScores()[assignments.STR]?.total === 18 &&
    exceptionalStr === null
  );

  let canReroll = $derived(rerollsUsed < MAX_REROLLS);

  function rollScores() {
    if (rawDice) {
      rerollsUsed++;
    }
    rawDice = rollAbilityDice();
    assignments = { STR: 0, DEX: 1, CON: 2, INT: 3, WIS: 4, CHA: 5 };
    exceptionalStr = null;
    selectedRollIndex = null;
  }

  function selectRoll(index) {
    if (assignedIndices.has(index)) return;
    selectedRollIndex = selectedRollIndex === index ? null : index;
  }

  function assignToAbility(ability) {
    if (selectedRollIndex === null) return;
    if (assignments[ability] !== null) return;
    assignments[ability] = selectedRollIndex;
    selectedRollIndex = null;
  }

  function rollExceptional() {
    exceptionalStr = rollExceptionalStrength();
  }

  function unassign(ability) {
    if (ability === 'STR') exceptionalStr = null;
    assignments[ability] = null;
  }

  function handleKeydown(e) {
    if (isTyping() || e.ctrlKey || e.metaKey || e.altKey) return;

    // Space or Enter — context-sensitive roll/continue
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!rawDice) {
        rollScores();
      } else if (needsExceptionalRoll) {
        rollExceptional();
      } else if (allAssigned && !needsExceptionalRoll) {
        complete();
      }
      return;
    }

    // 1-6 — quick-assign selected roll to ability
    const num = parseInt(e.key);
    if (num >= 1 && num <= 6 && rawDice && selectedRollIndex !== null) {
      const ability = ABILITIES[num - 1];
      if (assignments[ability] === null) {
        assignToAbility(ability);
      }
    }
  }

  onMount(() => {
    if (existingRollData) {
      method = existingRollData.method;
      rawDice = existingRollData.rawDice;
      assignments = existingRollData.assignments;
      exceptionalStr = existingRollData.exceptionalStr;
      rerollsUsed = existingRollData.rerollsUsed || 0;
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  function complete() {
    const scores = calculatedScores();
    const finalScores = {};
    for (const ability of ABILITIES) {
      finalScores[ability] = scores[assignments[ability]].total;
    }
    if (exceptionalStr !== null) {
      finalScores.exceptionalStr = exceptionalStr;
    }

    const rollData = {
      method,
      rawDice,
      assignments,
      exceptionalStr,
      rerollsUsed
    };

    onComplete({ abilities: finalScores, rollData });
  }
</script>

<div class="method-select">
  <label class:selected={method === '4d6drop'} class:disabled={rawDice}>
    <input type="radio" bind:group={method} value="4d6drop" disabled={rawDice} />
    <strong>4d6 drop lowest</strong>
    <span class="meta-text">Recommended</span>
  </label>
  <label class:selected={method === '3d6'} class:disabled={rawDice}>
    <input type="radio" bind:group={method} value="3d6" disabled={rawDice} />
    <strong>3d6 straight</strong>
    <span class="meta-text">Classic / Hardcore</span>
  </label>
</div>

<div class="roll-action">
  {#if !rawDice}
    <button class="btn-primary" onclick={rollScores}>
      🎲 Roll Ability Scores
    </button>
    <button class="btn-ghost btn-sm" onclick={onManualMode}>
      ✏️ Enter scores manually
    </button>
    <ImportArea {onImport} />
  {:else if canReroll}
    <button class="btn-ghost btn-sm" onclick={rollScores}>
      ⟳ Reroll ({MAX_REROLLS - rerollsUsed} left)
    </button>
  {:else}
    <p class="section-hint">No rerolls remaining — these are your scores</p>
  {/if}
</div>

{#if rawDice}
  {@const scores = calculatedScores()}

  <!-- Assigned Abilities (main view) -->
  <div class="section">
    <h3>Your Abilities</h3>
    {#if !allAssigned}
      <p class="section-hint">
        {#if selectedRollIndex !== null}
          Click an ability to assign <strong>{scores[selectedRollIndex].total}</strong>.
        {:else}
          Click a score below to reassign it.
        {/if}
      </p>
    {/if}

    <div class="ability-slots">
      {#each ABILITIES as ability}
        <div
          class="ability-slot"
          class:filled={assignments[ability] !== null}
          class:ready={assignments[ability] === null && selectedRollIndex !== null}
        >
          <span class="slot-label">{ability}</span>

          {#if assignments[ability] !== null}
            <span class="slot-value">
              {scores[assignments[ability]].total}
              {#if ability === 'STR' && scores[assignments[ability]].total === 18 && exceptionalStr !== null}
                <span class="exceptional">/{exceptionalStr.toString().padStart(2, '0')}</span>
              {/if}
            </span>
            <button class="slot-clear" onclick={() => unassign(ability)} title="Clear to reassign">×</button>
          {:else}
            <button
              class="slot-assign"
              onclick={() => assignToAbility(ability)}
              disabled={selectedRollIndex === null}
            >
              ?
            </button>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Rolled dice display -->
  <div class="section">
    <h3>Rolled Dice</h3>
    <div class="dice-results">
      {#each scores as score, i}
        {@const assignedTo = ABILITIES.find(a => assignments[a] === i)}
        <button
          class="dice-roll"
          class:selected={selectedRollIndex === i}
          class:assigned={assignedTo !== undefined}
          onclick={() => !assignedTo && selectRoll(i)}
          disabled={assignedTo !== undefined}
        >
          {#if assignedTo}
            <span class="assigned-label badge badge-primary">{assignedTo}</span>
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

  <!-- Exceptional Strength -->
  {#if needsExceptionalRoll}
    <div class="exceptional-prompt alert alert-warning">
      <p><strong>18 Strength!</strong> Warriors with exceptional strength roll d100 for additional power.</p>
      <button class="btn-primary" onclick={rollExceptional}>
        🎲 Roll Exceptional Strength
      </button>
    </div>
  {/if}

  <!-- Continue -->
  {#if allAssigned && !needsExceptionalRoll}
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

