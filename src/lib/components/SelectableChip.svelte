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

<style lang="scss">
  @import '../../styles/mixins.scss';

  .selectable-chip {
    @include selectable-chip;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.4rem;
    width: 100%;
    text-align: left;

    &:hover:not(.disabled):not(.auto):not(.locked) {
      color: var(--text-hover);
    }

    &.auto {
      border-color: var(--border-strong);
      cursor: default;
      opacity: 0.9;
    }

    &.locked {
      cursor: default;
      opacity: 0.7;
    }

    // When using children snippet with complex content
    &:has(.item-name) {
      flex-direction: column;
      align-items: flex-start;
      padding: 0.6rem 0.8rem;
    }
  }

  .chip-name {
    flex: 1;
  }

  .chip-meta {
    padding: 0.1rem 0.3rem;
    background: var(--bg-panel);
    border-radius: 2px;
    flex-shrink: 0;
  }

  .chip-cost {
    color: var(--gold-dark);
    padding: 0.1rem 0.35rem;
    background: rgba(201, 162, 39, 0.15);
    border: 1px solid rgba(201, 162, 39, 0.3);
    border-radius: 2px;
    flex-shrink: 0;
  }

  .chip-lock {
    font-size: 0.7em;
    margin-left: 0.3rem;
    flex-shrink: 0;
  }
</style>
