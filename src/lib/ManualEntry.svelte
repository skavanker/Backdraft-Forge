<script>
  const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  let { onComplete, existingAbilities = null, existingRollData = null, onBack = null } = $props();

  let manualScores = $state({
    STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
  });
  let manualExceptionalStr = $state(null);
  let manualInput = $state('');

  // Next ability to assign
  let nextManualAbility = $derived(
    ABILITIES.find(a => manualScores[a] === null) || null
  );

  let manualAllAssigned = $derived(
    ABILITIES.every(a => manualScores[a] !== null)
  );

  let manualValid = $derived(() => {
    if (!manualAllAssigned) return false;
    if (manualScores.STR === 18 && manualExceptionalStr === null) return false;
    return true;
  });

  let manualNeedsExceptional = $derived(
    manualScores.STR === 18 && manualExceptionalStr === null
  );

  function addManualScore() {
    const val = parseInt(manualInput);
    if (isNaN(val) || val < 3 || val > 18 || !nextManualAbility) return;
    manualScores[nextManualAbility] = val;
    manualInput = '';
  }

  function clearManualScore(ability) {
    let found = false;
    for (const a of ABILITIES) {
      if (a === ability) found = true;
      if (found) manualScores[a] = null;
    }
    if (ability === 'STR') {
      manualExceptionalStr = null;
    }
  }

  function setManualExceptional() {
    const val = parseInt(manualInput);
    if (isNaN(val) || val < 1 || val > 100) return;
    manualExceptionalStr = val;
    manualInput = '';
  }

  function completeManual() {
    const finalScores = {};
    for (const ability of ABILITIES) {
      finalScores[ability] = manualScores[ability];
    }
    if (manualScores.STR === 18 && manualExceptionalStr !== null) {
      finalScores.exceptionalStr = manualExceptionalStr;
    }
    onComplete({ abilities: finalScores, rollData: null });
  }

  // Initialize with existing data if provided
  if (existingAbilities && !existingRollData) {
    manualScores = {
      STR: existingAbilities.STR,
      DEX: existingAbilities.DEX,
      CON: existingAbilities.CON,
      INT: existingAbilities.INT,
      WIS: existingAbilities.WIS,
      CHA: existingAbilities.CHA
    };
    if (existingAbilities.exceptionalStr) {
      manualExceptionalStr = existingAbilities.exceptionalStr;
    }
  }
</script>

<div class="section">
  {#if onBack}
    <button class="btn-ghost back-btn" onclick={onBack}>
      ← Back to digital rolling
    </button>
  {/if}

  <h3>{existingAbilities && !existingRollData ? 'Your Ability Scores' : 'Enter Your Scores'}</h3>
  {#if existingAbilities && !existingRollData && manualValid()}
    <p class="existing-note">These are your previously entered scores. You can continue with these or clear them to enter new ones.</p>
  {/if}

  <!-- Assigned scores display -->
  <div class="manual-assigned">
    {#each ABILITIES as ability}
      <div class="manual-slot" class:filled={manualScores[ability] !== null} class:next={ability === nextManualAbility}>
        <span class="slot-label">{ability}</span>
        {#if manualScores[ability] !== null}
          <span class="slot-value">
            {manualScores[ability]}
            {#if ability === 'STR' && manualScores[ability] === 18 && manualExceptionalStr !== null}
              /{manualExceptionalStr.toString().padStart(2, '0')}
            {/if}
          </span>
          <button class="slot-clear" onclick={() => clearManualScore(ability)} title="Clear">×</button>
        {:else}
          <span class="slot-empty">{ability === nextManualAbility ? '?' : '—'}</span>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Input for next score -->
  {#if nextManualAbility && !manualNeedsExceptional}
    <div class="manual-entry">
      <label for="manual-input">Enter {nextManualAbility} score:</label>
      <div class="entry-row">
        <input
          id="manual-input"
          type="number"
          min="3"
          max="18"
          bind:value={manualInput}
          placeholder="3-18"
          onkeydown={(e) => e.key === 'Enter' && addManualScore()}
        />
        <button class="btn-primary" onclick={addManualScore}>Add</button>
      </div>
    </div>
  {/if}

  <!-- Exceptional strength input -->
  {#if manualNeedsExceptional}
    <div class="manual-entry exceptional">
      <label for="manual-input"><strong>18 Strength!</strong> Enter exceptional strength (1-100):</label>
      <div class="entry-row">
        <input
          id="manual-input"
          type="number"
          min="1"
          max="100"
          bind:value={manualInput}
          placeholder="1-100"
          onkeydown={(e) => e.key === 'Enter' && setManualExceptional()}
        />
        <button class="btn-primary" onclick={setManualExceptional}>Add</button>
      </div>
    </div>
  {/if}

  {#if manualValid()}
    <div class="continue-section">
      <div class="divider"><span class="ornament">◆</span></div>
      <button class="btn-primary" onclick={completeManual}>
        Continue to Race Selection →
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .back-btn {
    display: block;
    margin: 0 auto 1rem;
    font-size: 0.85rem;
    padding: 0.35rem 0.75rem;
  }

  .existing-note {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.9rem;
    font-style: italic;
    margin: 0.5rem 0 1rem;
  }

  .manual-assigned {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;

    @media (max-width: 500px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .manual-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: var(--bg-subtle);
    border: 2px solid var(--border-color);
    border-radius: 4px;
    position: relative;

    &.filled {
      background: rgba(201, 162, 39, 0.1);
      border-color: rgba(201, 162, 39, 0.3);
    }

    &.next {
      border-color: var(--gold);
      border-style: dashed;
    }

    .slot-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }

    .slot-value {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .slot-empty {
      font-size: 1.25rem;
      color: var(--text-faint);
    }

    .slot-clear {
      position: absolute;
      top: 2px;
      right: 2px;
      padding: 0 0.3rem;
      font-size: 0.9rem;
      background: transparent;
      color: var(--red);
      box-shadow: none;
      opacity: 0.5;

      &:hover {
        opacity: 1;
        transform: none;
      }
    }
  }

  .manual-entry {
    text-align: center;
    margin: 1.5rem 0;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-body);
    }

    &.exceptional {
      padding: 1rem;
      background: rgba(201, 162, 39, 0.12);
      border: 1px solid rgba(201, 162, 39, 0.3);
      border-radius: 4px;
    }
  }

  .entry-row {
    display: flex;
    justify-content: center;
    gap: 0.5rem;

    input {
      width: 100px;
      text-align: center;
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0.5rem;
    }
  }

  .section {
    h3 {
      text-align: center;
      margin-bottom: 0.5rem;
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
