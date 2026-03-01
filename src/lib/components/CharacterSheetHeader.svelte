<script>
  import EditableInput from './EditableInput.svelte';

  let {
    name,
    raceName,
    className,
    level,
    xp = 0,
    xpBonus = null,
    xpForNext,
    canLevelUp = false,
    atLevelLimit = false,
    onUpdateXP,
    onLevelUp
  } = $props();

  let xpProgress = $derived(xpForNext ? Math.min(100, (xp / xpForNext) * 100) : 0);
</script>

<style lang="scss">@import '../styles/sheet';</style>

<h1>{name}</h1>
<div class="subtitle">{raceName} {className} · Level {level}</div>

<!-- XP Bar -->
<div class="xp-section">
  <div class="xp-row">
    <EditableInput
      value={xp}
      label="XP"
      displayFormat={(v) => {
        const parts = [v.toLocaleString()];
        if (xpForNext) parts.push(' / ', xpForNext.toLocaleString());
        return parts.join('');
      }}
      min={0}
      onUpdate={onUpdateXP}
      title="Click to edit XP{xpBonus ? ` (${xpBonus}% XP bonus)` : ''}"
      buttonClass="xp-display-btn"
    />
    {#if xpBonus}
      <span class="xp-bonus">(+{xpBonus}%)</span>
    {/if}
    {#if canLevelUp}
      <button class="btn-primary" onclick={onLevelUp}>Level Up!</button>
    {:else if atLevelLimit}
      <span class="level-cap">Level limit reached</span>
    {/if}
  </div>
  {#if xpForNext}
    <div class="xp-bar">
      <div class="xp-fill" style="width: {xpProgress}%"></div>
    </div>
  {/if}
</div>
