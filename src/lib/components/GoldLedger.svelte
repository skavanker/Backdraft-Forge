<script>
  import Tooltip from '../Tooltip.svelte';
  import { formatEncumbranceValue, formatWeightUnit } from '../settings.svelte.js';

  let {
    ledger,
    totalWeight,
    weightAllowance,
    isEncumbered,
    rollGold,
    setManualGold,
    resetGold,
    manualGoldInput = $bindable('')
  } = $props();
</script>

<div class="gold-section">
  {#if !ledger.goldRolled}
    <div class="intro-with-info">
      <p class="section-hint">Roll for starting gold or enter a custom amount.</p>
      <Tooltip text="Starting gold per AD&D 2E: Warriors 5d4×10 (50-200 gp), Wizards 1d4+1×10 (20-50 gp), Priests 3d6×10 (30-180 gp), Rogues 2d6×10 (20-120 gp)" position="bottom">
        <span class="info-icon">ⓘ</span>
      </Tooltip>
    </div>
    <div class="gold-controls">
      <button class="btn-primary" onclick={rollGold}>
        Roll Starting Gold
      </button>
      <span class="or-divider">or</span>
      <div class="manual-gold">
        <input
          type="number"
          min="0"
          placeholder="Enter gold"
          aria-label="Starting gold amount"
          bind:value={manualGoldInput}
          onkeydown={(e) => e.key === 'Enter' && setManualGold()}
        />
        <span class="gp-label">gp</span>
        <button class="btn-primary btn-sm" onclick={setManualGold} disabled={!manualGoldInput || parseInt(manualGoldInput) < 0}>
          Set
        </button>
      </div>
    </div>
  {:else}
    <div class="gold-display panel">
      <button class="reroll-btn" onclick={resetGold} title="Reset gold" aria-label="Reset gold">×</button>
      <div class="gold-stat">
        <span class="gold-label">Gold</span>
        <span class="gold-value" class:warning={ledger.gold < 0}>
          {ledger.gold.toFixed(1)} gp
        </span>
        {#if ledger.goldDice.length > 0}
          <div class="gold-dice">
            <span class="dice-formula">{ledger.goldDiceFormula} × 10</span>
            <div class="dice-rolls">
              {#each ledger.goldDice as die}
                <span class="die">
                  <img src="/dice/d{ledger.goldDieSize}-{die}.svg" alt="{die}" />
                </span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      <div class="gold-stat">
        <span class="gold-label">Weight</span>
        <span class="gold-value" class:warning={isEncumbered}>{formatEncumbranceValue(totalWeight)} / {formatEncumbranceValue(weightAllowance)} {formatWeightUnit()}</span>
      </div>
    </div>
    {#if isEncumbered}
      <div class="encumbrance-warning alert alert-danger">
        ⚠ Encumbered! Carrying {formatEncumbranceValue(totalWeight - weightAllowance)} {formatWeightUnit()} over your weight allowance. Movement and combat will be penalized.
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @import '../styles/equipment';
</style>
