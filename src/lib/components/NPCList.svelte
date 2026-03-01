<script>
  import NPCStatBlock from './NPCStatBlock.svelte';

  let { npcs, onSave = null, onDelete = null, title = 'NPCs', saved = false } = $props();

  // For saved NPCs, extract the .data field; for generated NPCs, use as-is
  const displayNPCs = $derived(
    saved ? npcs.map(entry => ({ ...entry.data, savedEntryId: entry.id })) : npcs
  );
</script>

<div class="npc-list">
  <header class="list-header">
    <h3>{title}</h3>
    <span class="count">{npcs.length} {npcs.length === 1 ? 'NPC' : 'NPCs'}</span>
  </header>

  <div class="list-grid">
    {#each displayNPCs as npc (npc.id || npc.savedEntryId)}
      <NPCStatBlock
        {npc}
        onSave={saved ? null : onSave}
        onDelete={saved ? (() => onDelete(npc.savedEntryId)) : null}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  @import '../styles/shared';

  .npc-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-border);

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .count {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      font-weight: 600;
    }
  }

  .list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
</style>
