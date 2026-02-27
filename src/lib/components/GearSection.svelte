<script>
  /**
   * GearSection - Reusable section for equipment/gear grids
   * Handles common pattern for left-click add, right-click remove
   */
  import { formatPrice } from '../../data/equipment.js';

  let {
    title,
    items,
    selectedGear,
    canAfford,
    addGear,
    removeGear,
    small = false
  } = $props();
</script>

<div class="section">
  <h3>{title}</h3>
  <p class="section-hint">Left-click to add, right-click to remove</p>
  <div class="item-grid" class:small>
    {#each items as item}
      {@const selected = selectedGear.find(g => g.key === item.key)}
      {@const affordable = canAfford(item.price) || selected}
      <button
        class="item-card"
        class:small
        class:selected
        class:disabled={!affordable && !selected}
        onclick={() => addGear(item)}
        oncontextmenu={(e) => { e.preventDefault(); removeGear(item); }}
      >
        <span class="item-name">{item.name}</span>
        <span class="item-price">{formatPrice(item.price)}</span>
        {#if selected?.qty > 1}
          <span class="qty-badge">&times;{selected.qty}</span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  @import '../../styles/mixins.scss';

  .item-card {
    @include selectable-chip;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.8rem;
    text-align: left;
    width: 100%;
    position: relative;

    &.small {
      padding: 0.4rem 0.6rem;
    }

    &:hover:not(.disabled) {
      .item-name {
        color: var(--text-hover);
      }
    }
  }

  .item-name {
    flex: 1;
  }

  .item-price {
    color: var(--gold-dark);
    margin-left: $space-sm;
  }

  .qty-badge {
    background: var(--gold);
    color: var(--bg-card);
    border-radius: 8px;
    padding: 0 0.35rem;
    margin-left: $space-xs;
    line-height: 1.4;
    font-size: $text-xs;
  }
</style>
