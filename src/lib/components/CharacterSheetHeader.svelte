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
    onLevelUp,
    onOpenManagePanel,
    hasSpells = false
  } = $props();

  let xpProgress = $derived(xpForNext ? Math.min(100, (xp / xpForNext) * 100) : 0);
  let showDropdown = $state(false);

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function closeDropdown() {
    showDropdown = false;
  }

  function openPanel(panelId) {
    onOpenManagePanel?.(panelId);
    closeDropdown();
  }

  // Close dropdown when clicking outside
  function handleClickOutside(e) {
    if (showDropdown && !e.target.closest('.hamburger-container')) {
      closeDropdown();
    }
  }
</script>

<style lang="scss">@import '../styles/sheet';</style>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={handleClickOutside}>
  <div class="header-row">
    <h1>{name}</h1>
    {#if onOpenManagePanel}
      <div class="hamburger-container">
        <button class="hamburger-menu" onclick={toggleDropdown} aria-label="Character management menu" title="Character management">
          ☰
        </button>
        {#if showDropdown}
          <div class="hamburger-dropdown">
            <button class="dropdown-item" onclick={() => openPanel('xp')}>
              <span class="item-icon">⭐</span>
              <span class="item-label">Adjust XP</span>
            </button>
            <button class="dropdown-item" onclick={() => openPanel('gold')}>
              <span class="item-icon">💰</span>
              <span class="item-label">Manage Gold</span>
            </button>
            <button class="dropdown-item" onclick={() => openPanel('hp')}>
              <span class="item-icon">❤️</span>
              <span class="item-label">Adjust HP</span>
            </button>
            {#if hasSpells}
              <button class="dropdown-item" onclick={() => openPanel('spells')}>
                <span class="item-icon">✨</span>
                <span class="item-label">Spell Slots</span>
              </button>
            {/if}
            <button class="dropdown-item" onclick={() => openPanel('rest')}>
              <span class="item-icon">🛡️</span>
              <span class="item-label">Rest & Recover</span>
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <div class="subtitle">{raceName} {className} · Level {level}</div>
</div>

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
