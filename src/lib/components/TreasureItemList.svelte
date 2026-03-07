<script>
  let { items, itemType, onSave = null, onDelete = null } = $props();

  const typeLabels = {
    gem: 'Gems',
    art: 'Art Objects',
    magic: 'Magic Items',
    mundane: 'Mundane Items'
  };

  function formatNumber(num) {
    return num.toLocaleString();
  }
</script>

<div class="item-list panel-secondary flex-column gap-md">
  <header class="item-list-header">
    <h4>{typeLabels[itemType]}</h4>
    <span class="badge badge-primary">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
  </header>

  <div class="items">
    {#if itemType === 'gem'}
      {#each items as gem}
        <div class="item-entry gem-item">
          <span class="item-description">{gem.description}</span>
          <span class="item-value">{gem.value} gp</span>
        </div>
      {/each}
    {:else if itemType === 'art'}
      {#each items as art}
        <div class="item-entry art-item">
          <span class="item-description">{art.description}</span>
          <span class="item-value">{formatNumber(art.value)} gp</span>
        </div>
      {/each}
    {:else if itemType === 'magic'}
      {#each items as item}
        <div class="item-entry magic-item">
          <span class="item-description">{item.name}</span>
        </div>
      {/each}
    {:else if itemType === 'mundane'}
      {#each items as item}
        <div class="item-entry mundane-item">
          <span class="item-description">{item.description}</span>
        </div>
      {/each}
    {/if}
  </div>

  {#if onSave || onDelete}
    <div class="action-bar">
      {#if onSave}
        <button class="btn-sm btn-primary" onclick={onSave}>
          Save Items
        </button>
      {/if}
      {#if onDelete}
        <button class="btn-sm btn-danger" onclick={onDelete}>
          Delete
        </button>
      {/if}
    </div>
  {/if}
</div>

