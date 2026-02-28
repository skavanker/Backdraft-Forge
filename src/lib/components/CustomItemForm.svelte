<script>
  let {
    customName = $bindable(''),
    customPrice = $bindable(null),
    customWeight = $bindable(null),
    selectedGear = [],
    addCustomItem,
    addGear,
    removeGear
  } = $props();
</script>

<!-- Custom Item Form -->
<div class="section">
  <h3>Custom Item</h3>
  <p class="section-hint">Add items not found in the equipment lists above</p>
  <div class="custom-gear-form">
    <input placeholder="Item name" aria-label="Custom item name" bind:value={customName} />
    <input type="number" placeholder="Price (gp)" aria-label="Custom item price in gold" bind:value={customPrice} min="0" />
    <input type="number" placeholder="Weight (lbs)" aria-label="Custom item weight" bind:value={customWeight} min="0" />
    <button class="btn-add" onclick={addCustomItem} disabled={!customName.trim()}>Add</button>
  </div>
</div>

<!-- Selected custom items -->
{#if selectedGear.some(g => g.key.startsWith('custom_'))}
  <div class="section">
    <h3>Custom Items</h3>
    <div class="item-grid small">
      {#each selectedGear.filter(g => g.key.startsWith('custom_')) as item}
        <button
          class="item-card small selected"
          onclick={() => addGear(item)}
          oncontextmenu={(e) => { e.preventDefault(); removeGear(item); }}
          onkeydown={(e) => { if (e.key === 'Backspace') { e.preventDefault(); removeGear(item); } }}
        >
          <span class="item-name">{item.name}</span>
          <span class="item-price">{item.price?.gp || 0} gp</span>
          {#if item.qty > 1}
            <span class="qty-badge">&times;{item.qty}</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
{/if}
