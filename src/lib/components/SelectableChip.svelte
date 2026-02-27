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
    children
  } = $props();

  function handleClick() {
    if (!disabled && !locked && !auto && onclick) {
      onclick();
    }
  }
</script>

<button
  class="selectable-chip"
  class:selected
  class:disabled
  class:locked
  class:auto
  onclick={handleClick}
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
    <span class="chip-lock">🔒</span>
  {/if}
</button>

<style lang="scss">@import '../styles/widgets';</style>
