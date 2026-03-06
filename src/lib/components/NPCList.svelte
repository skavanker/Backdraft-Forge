<script>
  import NPCStatBlock from './NPCStatBlock.svelte';

  let { npcs, onSave = null, onDelete = null, title = 'NPCs', saved = false } = $props();

  // For saved NPCs, extract the .data field; for generated NPCs, use as-is
  const displayNPCs = $derived(
    saved ? npcs.map(entry => ({ ...entry.data, savedEntryId: entry.id })) : npcs
  );
</script>

<div class="npc-list">
  <header class="section-header">
    <h3>{title}</h3>
    <span class="count">{npcs.length} {npcs.length === 1 ? 'NPC' : 'NPCs'}</span>
  </header>

  <div class="grid-lg animate-in">
    {#each displayNPCs as npc (npc.id || npc.savedEntryId)}
      <NPCStatBlock
        {npc}
        onSave={saved ? null : onSave}
        onDelete={saved ? (() => onDelete(npc.savedEntryId)) : null}
      />
    {/each}
  </div>
</div>

<style lang="scss">@import '../styles/dm-tools';</style>
