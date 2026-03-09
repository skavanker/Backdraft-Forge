<script>
  import NPCStatBlock from './NPCStatBlock.svelte';
  import ItemList from './ItemList.svelte';

  let { npcs, onSave = null, onDelete = null, title = 'NPCs', saved = false } = $props();

  // For saved NPCs, extract the .data field; for generated NPCs, use as-is
  const displayNPCs = $derived(
    saved ? npcs.map(entry => ({ ...entry.data, savedEntryId: entry.id })) : npcs
  );
</script>

<ItemList
  items={displayNPCs}
  {title}
  countLabel="NPC"
  emptyText="No NPCs yet."
  keyFn={(npc) => npc.id || npc.savedEntryId}
>
  {#snippet renderItem(npc)}
    <NPCStatBlock
      {npc}
      onSave={saved ? null : onSave}
      onDelete={saved ? (() => onDelete(npc.savedEntryId)) : null}
    />
  {/snippet}
</ItemList>
