<script>
  /**
   * GearSection - Reusable section for equipment/gear grids
   * Left-click to add, right-click to remove. Hold Shift for ×5.
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
  <div class="item-grid" class:small>
    {#each items as item}
      {@const selected = selectedGear.find(g => g.key === item.key)}
      {@const affordable = canAfford(item.price) || selected}
      <button
        class="item-card"
        class:small
        class:selected
        class:disabled={!affordable && !selected}
        onclick={(e) => addGear(item, e.shiftKey ? 5 : 1)}
        oncontextmenu={(e) => { e.preventDefault(); removeGear(item, e.shiftKey ? 5 : 1); }}
        onkeydown={(e) => { if (e.key === 'Backspace' && selected) { e.preventDefault(); removeGear(item, e.shiftKey ? 5 : 1); } }}
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

