<script>
  import { getHitDie } from '../../utils/characterAccessors.js';
  import { parseDieMax, calcTotalHP } from '../../utils/hpUtils.js';
  import { useAbilityModifiers } from '../../utils/stateUtils.svelte.js';

  let {
    character,
    onClose,
    onComplete,
  } = $props();

  // Get character's hit die for short rest HP roll
  let hitDie = getHitDie(character);
  let dieMax = parseDieMax(hitDie);

  // Calculate actual max HP from hpHistory (same as CharacterSheet)
  const abilityMods = useAbilityModifiers(character);
  let conMods = $derived(abilityMods.con);
  let maxHP = $derived(calcTotalHP(character.hpHistory, character.cls.hitDie, conMods.hpAdj));
  let currentHP = $derived(character.currentHP ?? maxHP);

  // Short rest state
  let shortRestRoll = $state(null);

  // Custom recovery state
  let customHP = $state(false);
  let customHPAmount = $state(0);
  let customSlots = $state(false);

  // Short rest - roll hit die for HP
  function takeShortRest() {
    // Ensure we have a valid die max
    const validDieMax = dieMax && dieMax > 0 ? dieMax : 8;

    // Generate a fresh random roll between 1 and dieMax
    const roll = Math.floor(Math.random() * validDieMax) + 1;

    // Update display with the roll FIRST so user can see it
    shortRestRoll = roll;

    // Use derived maxHP and currentHP
    const newHP = Math.min(maxHP, currentHP + roll);

    const updates = {
      currentHP: newHP,
    };
    onComplete(updates);
  }

  // Long rest - full HP and all spell slots
  function takeLongRest() {
    const slotsUsed = {};
    if (character.spellSlots) {
      character.spellSlots.forEach((_, level) => {
        slotsUsed[level] = 0;
      });
    }

    const updates = {
      currentHP: maxHP,
      spellSlotsUsed: slotsUsed,
    };
    onComplete(updates);
  }

  // Custom recovery
  function customRecovery() {
    const updates = {};

    if (customHP) {
      // Add custom amount but cap at max HP
      updates.currentHP = Math.min(maxHP, currentHP + customHPAmount);
    }

    if (customSlots && character.spellSlots) {
      const slotsUsed = {};
      character.spellSlots.forEach((_, level) => {
        slotsUsed[level] = 0;
      });
      updates.spellSlotsUsed = slotsUsed;
    }

    onComplete(updates);
  }

  function cancel() {
    // Reset state when canceling
    shortRestRoll = null;
    customHP = false;
    customHPAmount = 0;
    customSlots = false;
    onClose(); // Close modal
  }
</script>

<div class="manage-panel">
  <h3>Rest & Recovery</h3>

  <div class="rest-options">
    <!-- Short Rest -->
    <div class="rest-option panel">
      <div class="rest-header">
        <h4>Short Rest (1 hour)</h4>
      </div>
      <div class="rest-description">
        <p>Roll {hitDie} for HP recovery</p>
        <p class="meta-text">No spell slot recovery</p>
        <p class="meta-text">Current HP: {currentHP} / {maxHP}</p>
      </div>
      {#if shortRestRoll !== null}
        <div class="rest-result">
          Rolled {hitDie}: {shortRestRoll} HP restored
        </div>
      {/if}
      <button class="btn-primary" onclick={takeShortRest}>
        Take Short Rest
      </button>
    </div>

    <!-- Long Rest -->
    <div class="rest-option panel">
      <div class="rest-header">
        <h4>Long Rest (8 hours)</h4>
      </div>
      <div class="rest-description">
        <p>Recover full HP</p>
        <p>Restore all spell slots</p>
        <p class="meta-text">All memorized spells restored</p>
      </div>
      <button class="btn-primary" onclick={takeLongRest}>
        Take Long Rest
      </button>
    </div>

    <!-- Custom Recovery -->
    <div class="rest-option panel">
      <div class="rest-header">
        <h4>Custom Recovery</h4>
      </div>
      <div class="rest-description">
        <div class="custom-checkbox">
          <label>
            <input type="checkbox" bind:checked={customHP} />
            Recover HP:
          </label>
          {#if customHP}
            <input
              type="number"
              bind:value={customHPAmount}
              min="0"
              max={maxHP - currentHP}
              class="custom-input-sm"
            />
            HP
          {/if}
        </div>
        <div class="custom-checkbox">
          <label>
            <input type="checkbox" bind:checked={customSlots} />
            Restore all spell slots
          </label>
        </div>
      </div>
      <button
        class="btn-secondary"
        onclick={customRecovery}
        disabled={!customHP && !customSlots}
      >
        Apply Custom Recovery
      </button>
    </div>
  </div>

  <div class="panel-actions">
    <button class="btn-secondary" onclick={cancel}>Cancel</button>
  </div>
</div>
