<script>
  let { savedCharacters = [], onLoad, onDelete } = $props();

  let showAllSaves = $state(false);
  let displayed = $derived(showAllSaves ? savedCharacters : savedCharacters.slice(0, 5));
</script>

{#if savedCharacters.length > 0}
  <aside class="saved-data">
    <h3>Recent Characters</h3>
    <div class="save-list">
      {#each displayed as entry (entry.id)}
        <div class="save-entry">
          <button class="save-load" onclick={() => onLoad(entry)}>
            <span class="save-name">{entry.name}</span>
            <span class="save-meta">{entry.race} {entry.cls}{entry.level > 1 ? ` · Lvl ${entry.level}` : ''}</span>
          </button>
          <button class="save-delete" onclick={() => onDelete(entry.id)} title="Delete save" aria-label="Delete {entry.name}">&times;</button>
        </div>
      {/each}
    </div>
    {#if savedCharacters.length > 5}
      <button class="view-all-btn" onclick={() => showAllSaves = !showAllSaves}>
        {showAllSaves ? 'Show Less' : `View All (${savedCharacters.length})`}
      </button>
    {/if}
  </aside>
{/if}
