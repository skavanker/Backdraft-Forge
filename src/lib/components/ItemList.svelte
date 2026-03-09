<script>
  let {
    items,
    title = null,
    countLabel = 'item',
    emptyText = 'No items found.',
    keyFn = (item) => item,
    renderItem,
  } = $props();
</script>

{#if title}
  <header class="section-header">
    <h3>{title}</h3>
    <span class="count">{items.length} {items.length === 1 ? countLabel : countLabel + 's'}</span>
  </header>
{/if}

{#if items.length === 0}
  <div class="panel-dashed">
    <p>{emptyText}</p>
  </div>
{:else}
  <div class="grid-lg animate-in">
    {#each items as item (keyFn(item))}
      {@render renderItem(item)}
    {/each}
  </div>
{/if}
