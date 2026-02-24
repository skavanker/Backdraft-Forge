<script>
  import { rollAbilityDice, calculate3d6, calculate4d6DropLowest, rollExceptionalStrength } from './dice.js';
  import { onMount } from 'svelte';
  import ImportArea from './ImportArea.svelte';

  const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
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

  onMount(() => {
    if (existingRollData) {
      method = existingRollData.method;
      rawDice = existingRollData.rawDice;
      assignments = existingRollData.assignments;
      exceptionalStr = existingRollData.exceptionalStr;
      rerollsUsed = existingRollData.rerollsUsed || 0;
    }
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
    <span class="method-name">4d6 drop lowest</span>
    <span class="method-desc">Recommended</span>
  </label>
  <label class:selected={method === '3d6'} class:disabled={rawDice}>
    <input type="radio" bind:group={method} value="3d6" disabled={rawDice} />
    <span class="method-name">3d6 straight</span>
    <span class="method-desc">Classic / Hardcore</span>
  </label>
</div>

<div class="roll-action">
  {#if !rawDice}
    <button class="btn-primary" onclick={rollScores}>
      🎲 Roll Ability Scores
    </button>
    <button class="btn-ghost manual-btn" onclick={onManualMode}>
      ✏️ Enter scores manually
    </button>
    <ImportArea {onImport} />
  {:else if canReroll}
    <button class="btn-ghost reroll-btn" onclick={rollScores}>
      ⟳ Reroll ({MAX_REROLLS - rerollsUsed} left)
    </button>
  {:else}
    <p class="no-rerolls">No rerolls remaining — these are your scores</p>
  {/if}
</div>

{#if rawDice}
  {@const scores = calculatedScores()}

  <!-- Assigned Abilities (main view) -->
  <div class="section">
    <h3>Your Abilities</h3>
    {#if !allAssigned}
      <p class="help-text">
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
            <span class="assigned-label">{assignedTo}</span>
          {/if}
          <span class="roll-total">{score.total}</span>
          <span class="roll-dice">
            {#if method === '3d6'}
              {#each rawDice[i].slice(0, 3) as die}
                <span class="die">{die}</span>
              {/each}
              <span class="die unused">{rawDice[i][3]}</span>
            {:else}
              {#each rawDice[i] as die}
                <span class="die" class:dropped={die === score.dropped}>{die}</span>
              {/each}
            {/if}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Exceptional Strength -->
  {#if needsExceptionalRoll}
    <div class="exceptional-prompt">
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
  .method-select {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;

    label {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--bg-subtle);
      border: 2px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &.selected {
        border-color: var(--gold);
        background: rgba(201, 162, 39, 0.1);
      }

      &:hover:not(.selected):not(.disabled) {
        background: var(--bg-hover);
        color: var(--text-hover);
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      input {
        position: absolute;
        opacity: 0;
      }

      .method-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .method-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    }
  }

  .roll-action {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    .reroll-btn {
      font-size: 0.9rem;
      padding: 0.4rem 1rem;
    }

    .manual-btn {
      font-size: 0.85rem;
      padding: 0.35rem 0.75rem;
    }

    .no-rerolls {
      color: var(--text-muted);
      font-style: italic;
      margin: 0;
    }
  }

  .section {
    h3 {
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }

  .help-text {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0 0 1rem;
  }

  .dice-results {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }

  .dice-roll {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    min-width: 70px;
    background: var(--bg-input);
    border: 2px solid var(--border-color);
    box-shadow: 0 2px 4px var(--shadow-color);
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: var(--border-strong);
      background: var(--bg-hover);
      transform: translateY(-2px);

      .method-name, .method-desc {
        color: var(--text-hover);
      }
    }

    &.selected {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.15);
      box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.2);
    }

    &.assigned {
      opacity: 0.6;
      cursor: default;

      &:hover {
        transform: none;
        border-color: var(--border-color);
      }
    }

    .assigned-label {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0 0.35rem;
      background: var(--gold-dark);
      color: white;
      font-size: 0.65rem;
      font-weight: 600;
      border-radius: 2px;
      letter-spacing: 0.05em;
    }

    .roll-total {
      font-family: 'Cinzel', serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .roll-dice {
      display: flex;
      gap: 3px;
      margin-top: 0.35rem;
    }

    .die {
      font-size: 0.75rem;
      padding: 2px 4px;
      background: var(--bg-panel);
      border-radius: 2px;
      color: var(--text-body);

      &.dropped,
      &.unused {
        text-decoration: line-through;
        opacity: 0.4;
      }
    }
  }

  .ability-slots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;

    @media (max-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .ability-slot {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--bg-subtle);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    transition: all 0.2s;

    &.filled {
      background: rgba(201, 162, 39, 0.1);
      border-color: rgba(201, 162, 39, 0.3);
    }

    &.ready {
      border-color: var(--gold);
      border-style: dashed;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .slot-label {
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--text-muted);
      width: 2.5rem;
      letter-spacing: 0.05em;
    }

    .slot-value {
      font-family: 'Cinzel', serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
      flex: 1;

      .exceptional {
        font-size: 1rem;
        color: var(--gold-dark);
      }
    }

    .slot-assign {
      flex: 1;
      padding: 0.4rem;
      background: var(--bg-input);
      border: 1px dashed var(--border-strong);
      color: var(--text-muted);
      font-size: 1rem;
      box-shadow: none;

      &:disabled {
        background: var(--bg-subtle);
        opacity: 0.5;
        cursor: default;
      }

      &:not(:disabled) {
        border-style: solid;
        border-color: var(--gold);
        background: rgba(201, 162, 39, 0.15);
        color: var(--text-primary);
        cursor: pointer;
      }
    }

    .slot-clear {
      padding: 0.2rem 0.5rem;
      background: transparent;
      color: var(--red);
      font-size: 1.25rem;
      box-shadow: none;
      opacity: 0.6;

      &:hover {
        opacity: 1;
        transform: none;
      }
    }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.4); }
    50% { box-shadow: 0 0 0 4px rgba(201, 162, 39, 0); }
  }

  .exceptional-prompt {
    text-align: center;
    padding: 1.25rem;
    background: rgba(201, 162, 39, 0.12);
    border: 1px solid rgba(201, 162, 39, 0.3);
    border-radius: 4px;

    p {
      margin: 0 0 1rem;
    }
  }

  .continue-section {
    text-align: center;

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;

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
</style>
