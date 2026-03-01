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

<div class="item-list panel">
  <header class="item-list-header">
    <h4>{typeLabels[itemType]}</h4>
    <span class="item-count">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
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
    <div class="item-actions">
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

<style lang="scss">
  @import '../styles/shared';

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-secondary);
  }

  .item-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);

    h4 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .item-count {
      padding: 0.25rem 0.5rem;
      background: var(--color-primary);
      color: white;
      font-size: 0.75rem;
      border-radius: 4px;
      font-weight: 600;
    }
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .item-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: var(--color-bg-primary);
    border-radius: 4px;
    font-size: 0.875rem;

    .item-description {
      flex: 1;
      color: var(--color-text-primary);
    }

    .item-value {
      font-weight: 600;
      color: #d4af37;
      white-space: nowrap;
      margin-left: 1rem;
    }
  }

  .item-actions {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover {
          background: var(--color-primary-dark);
        }
      }

      &.btn-danger {
        background: var(--color-danger);
        color: white;

        &:hover {
          background: var(--color-danger-dark);
        }
      }
    }
  }
</style>
