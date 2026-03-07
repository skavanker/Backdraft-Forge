<script>
  /**
   * MonsterList - Grid wrapper for displaying multiple monsters
   * Handles the grid layout and empty states
   */
  import MonsterStatBlock from './MonsterStatBlock.svelte';

  let {
    monsters = [],
    onSave = null,
    onDelete = null,
    saved = false
  } = $props();
</script>

{#if monsters.length === 0}
  <div class="panel-dashed">
    <p>No monsters found.</p>
  </div>
{:else}
  <div class="grid-lg animate-in">
    {#each monsters as monster (monster.key)}
      <MonsterStatBlock
        {monster}
        {onSave}
        {onDelete}
        {saved}
      />
    {/each}
  </div>
{/if}