<script>
  import { getXPForNextLevel, getXPNeededForNextLevel, canLevelUp } from '../../utils/xpUtils.js';

  let {
    character,
    onClose,
    onComplete,
  } = $props();

  // Working copy of XP
  let xpWorking = $state(character.xp || 0);
  let customAmount = $state(100);

  // Derived values
  let nextLevelXP = $derived(getXPForNextLevel(character));
  let xpNeeded = $derived(Math.max(0, (nextLevelXP || 0) - xpWorking));
  let canLevel = $derived(nextLevelXP && xpWorking >= nextLevelXP);

  // Quick adjustment functions
  function adjustXP(amount) {
    xpWorking = Math.max(0, xpWorking + amount);
  }

  function save() {
    onComplete({ xp: xpWorking });
  }

  function cancel() {
    onClose(); // Close modal
  }
</script>

<div class="manage-panel">
  <h3>Experience Points</h3>

  <div class="xp-display panel flex-column gap-sm">
    <div class="xp-current">
      <span class="label">Current XP</span>
      <span class="value">{xpWorking.toLocaleString()}</span>
    </div>
    {#if nextLevelXP}
      <div class="xp-next">
        <span class="label">Next Level</span>
        <span class="value">{nextLevelXP.toLocaleString()}</span>
      </div>
      <div class="xp-needed">
        <span class="label">XP Needed</span>
        <span class="value">{xpNeeded.toLocaleString()}</span>
      </div>
    {:else}
      <div class="xp-max">
        <span class="label">Status</span>
        <span class="value">Max Level</span>
      </div>
    {/if}
  </div>

  {#if canLevel}
    <div class="alert alert-success">
      You have enough XP to level up!
    </div>
  {/if}

  <div class="quick-buttons">
    <div class="button-group">
      <span class="group-label">Add XP</span>
      <button class="btn-secondary" onclick={() => adjustXP(100)}>+100</button>
      <button class="btn-secondary" onclick={() => adjustXP(500)}>+500</button>
      <button class="btn-secondary" onclick={() => adjustXP(1000)}>+1,000</button>
      <button class="btn-secondary" onclick={() => adjustXP(5000)}>+5,000</button>
    </div>

    <div class="button-group">
      <span class="group-label">Remove XP</span>
      <button class="btn-secondary" onclick={() => adjustXP(-100)}>-100</button>
      <button class="btn-secondary" onclick={() => adjustXP(-500)}>-500</button>
      <button class="btn-secondary" onclick={() => adjustXP(-1000)}>-1,000</button>
      <button class="btn-secondary" onclick={() => adjustXP(-5000)}>-5,000</button>
    </div>
  </div>

  <div class="custom-adjust panel flex-column gap-sm">
    <span class="label">Custom Amount</span>
    <div class="custom-inputs">
      <input
        type="number"
        bind:value={customAmount}
        min="0"
        step="10"
        class="custom-input"
      />
      <button class="btn-secondary" onclick={() => adjustXP(customAmount)}>Add</button>
      <button class="btn-secondary" onclick={() => adjustXP(-customAmount)}>Remove</button>
    </div>
  </div>

  <div class="action-bar end gap-md">
    <button class="btn-secondary" onclick={cancel}>Cancel</button>
    <button class="btn-primary" onclick={save}>Save Changes</button>
  </div>
</div>
