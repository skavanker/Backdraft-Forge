<script>
  /**
   * SelectableChip - Reusable selectable chip component
   * Used in ProficiencySelector, SpellSelector, EquipmentSelector
   */
  let {
    label,
    selected = false,
    disabled = false,
    locked = false,
    auto = false,
    metadata = null,
    cost = null,
    onclick = null,
    oncontextmenu = null,
    children
  } = $props();

  function handleClick() {
    if (!disabled && !locked && !auto && onclick) {
      onclick();
    }
  }

  function handleContext(e) {
    if (oncontextmenu && !disabled && !locked && !auto) {
      e.preventDefault();
      oncontextmenu();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Backspace' && selected && oncontextmenu && !disabled && !locked && !auto) {
      e.preventDefault();
      oncontextmenu();
    }
  }
</script>

<button
  class="selectable-chip"
  class:selected
  class:disabled
  class:locked
  class:auto
  disabled={disabled || locked || auto}
  aria-pressed={selected}
  onclick={handleClick}
  oncontextmenu={handleContext}
  onkeydown={handleKeydown}
>
  {#if children}
    {@render children()}
  {:else}
    <span class="chip-name">{label}</span>
    {#if metadata}
      <span class="chip-meta">{metadata}</span>
    {/if}
    {#if cost !== null && cost > 1}
      <span class="chip-cost">{cost}</span>
    {/if}
  {/if}
  {#if locked}
    <span class="chip-lock" aria-hidden="true">🔒</span>
  {/if}
</button>

