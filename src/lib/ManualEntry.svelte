<script>
  import { ABILITIES } from '../data/constants.js';

  let { onComplete, existingAbilities = null, existingRollData = null, onBack = null } = $props();

  let manualScores = $state({
    STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null
  });
  let manualInput = $state('');

  // Next ability to assign
  let nextManualAbility = $derived(
    ABILITIES.find(a => manualScores[a] === null) || null
  );

  let manualAllAssigned = $derived(
    ABILITIES.every(a => manualScores[a] !== null)
  );

  let manualValid = $derived(manualAllAssigned);

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
  }

  function completeManual() {
    const finalScores = {};
    for (const ability of ABILITIES) {
      finalScores[ability] = manualScores[ability];
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
  }
</script>

<div class="section">
  {#if onBack}
    <button class="btn-ghost back-btn" onclick={onBack}>
      ← Back to digital rolling
    </button>
  {/if}

  <h3>{existingAbilities && !existingRollData ? 'Your Ability Scores' : 'Enter Your Scores'}</h3>
  {#if existingAbilities && !existingRollData && manualValid}
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
          </span>
          <button class="slot-clear" onclick={() => clearManualScore(ability)} title="Clear">×</button>
        {:else}
          <span class="slot-empty">{ability === nextManualAbility ? '?' : '—'}</span>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Input for next score -->
  {#if nextManualAbility}
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

  {#if manualValid}
    <div class="continue-section">
      <div class="divider"><span class="ornament">◆</span></div>
      <button class="btn-primary" onclick={completeManual}>
        Continue to Race Selection →
      </button>
    </div>
  {/if}
</div>


<style lang="scss">@import './styles/roller';</style>

