<script>
  import { onMount } from 'svelte';
  import ManualEntry from './ManualEntry.svelte';
  import DiceRoller from './DiceRoller.svelte';

  let { onComplete, onImport, existingAbilities = null, existingRollData = null } = $props();

  let manualMode = $state(false);

  onMount(() => {
    if (existingAbilities && !existingRollData) {
      manualMode = true;
    }
  });
</script>

<div class="roller">
  {#if manualMode}
    <ManualEntry
      {onComplete}
      {existingAbilities}
      {existingRollData}
      onBack={existingAbilities ? null : () => { manualMode = false; }}
    />
  {:else}
    <DiceRoller
      {onComplete}
      {onImport}
      {existingRollData}
      onManualMode={() => { manualMode = true; }}
    />
  {/if}
</div>

<style lang="scss">
  .roller {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }
</style>
