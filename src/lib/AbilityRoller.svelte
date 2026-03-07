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

<div class="flex-column gap-lg">
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

