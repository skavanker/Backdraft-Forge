<script>
  import { calcTotalHP } from '../../utils/hpUtils.js';
  import { useAbilityModifiers } from '../../utils/stateUtils.svelte.js';
  import { untrack } from 'svelte';

  let {
    character,
    onClose,
    onComplete,
  } = $props();

  // Calculate actual max HP from hpHistory (same as CharacterSheet)
  const abilityMods = useAbilityModifiers(untrack(() => character));
  let conMods = $derived(abilityMods.con);
  let maxHP = $derived(calcTotalHP(character.hpHistory, character.cls.hitDie, conMods.hpAdj));

  // Working copy of HP
  let hpWorking = $state(untrack(() => character.currentHP ?? maxHP));
  let customAmount = $state(5);

  // Derived values for display
  let hpPercentage = $derived(maxHP > 0 ? Math.min(100, (hpWorking / maxHP) * 100) : 0);
  let hpColor = $derived(
    hpPercentage > 66 ? 'healthy' :
    hpPercentage > 33 ? 'wounded' :
    'critical'
  );
  let hpLabel = $derived(
    hpColor === 'healthy' ? 'Healthy' :
    hpColor === 'wounded' ? 'Wounded' :
    'Critical'
  );
  let isAboveMax = $derived(hpWorking > maxHP);

  // Adjustment functions
  function heal(amount) {
    hpWorking = hpWorking + amount; // No max constraint
  }

  function damage(amount) {
    hpWorking = Math.max(0, hpWorking - amount); // Min 0
  }

  function fullHeal() {
    hpWorking = maxHP;
  }

  function save() {
    onComplete({ currentHP: hpWorking });
  }

  function cancel() {
    onClose(); // Close modal
  }
</script>

<div class="manage-panel">
  <h3>Hit Points</h3>

  <div class="hp-display panel flex-column gap-md panel-lg">
    <div class="hp-numbers">
      <span class="hp-current {hpColor}">{hpWorking}</span>
      <span class="hp-separator">/</span>
      <span class="hp-max">{maxHP}</span>
      {#if isAboveMax}
        <span class="hp-temp">+{hpWorking - maxHP} temp</span>
      {/if}
    </div>
    <div class="hp-bar" aria-hidden="true">
      <div class="hp-bar-fill {hpColor}" style="--hp-width: {hpPercentage}%"></div>
    </div>
    <span class="sr-only">{hpLabel}</span>
  </div>

  <div class="quick-buttons">
    <div class="button-group">
      <span class="group-label">Heal</span>
      <button class="btn-secondary" onclick={() => heal(1)}>+1</button>
      <button class="btn-secondary" onclick={() => heal(5)}>+5</button>
      <button class="btn-secondary" onclick={() => heal(10)}>+10</button>
      <button class="btn-secondary" onclick={fullHeal}>Full Heal</button>
    </div>

    <div class="button-group">
      <span class="group-label">Damage</span>
      <button class="btn-secondary" onclick={() => damage(1)}>-1</button>
      <button class="btn-secondary" onclick={() => damage(5)}>-5</button>
      <button class="btn-secondary" onclick={() => damage(10)}>-10</button>
    </div>
  </div>

  <div class="custom-adjust panel flex-column gap-sm">
    <span class="label">Custom Amount</span>
    <div class="custom-inputs">
      <input
        type="number"
        bind:value={customAmount}
        min="0"
        step="1"
        class="custom-input"
      />
      <button class="btn-secondary" onclick={() => heal(customAmount)}>Heal</button>
      <button class="btn-secondary" onclick={() => damage(customAmount)}>Damage</button>
    </div>
  </div>

  <div class="panel-note">
    <p class="meta-text">
      HP can exceed maximum (temp HP from Aid, potions, etc.)
    </p>
  </div>

  <div class="action-bar end gap-md">
    <button class="btn-secondary" onclick={cancel}>Cancel</button>
    <button class="btn-primary" onclick={save}>Save Changes</button>
  </div>
</div>
