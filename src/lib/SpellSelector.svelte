<script>
  import { isSpellcaster } from '../data/spells.js';
  import SpellSelectorCreation from './SpellSelectorCreation.svelte';
  import SpellSelectorManage from './SpellSelectorManage.svelte';

  let {
    classKey,
    wizardSchool = null,
    abilities,
    existingSpells = null,
    onComplete,
    mode = 'creation',
    characterLevel = 1,
    deityKey = null,
    onCancel = null
  } = $props();

  let isCaster = $derived(isSpellcaster(classKey, characterLevel));
  let isWizard = $derived(['mage', 'specialist'].includes(classKey));
  let isBard = $derived(classKey === 'bard');
  let isDivine = $derived(['cleric', 'druid', 'paladin', 'ranger'].includes(classKey));
  let usesArcane = $derived(isWizard || isBard || classKey === 'ranger');
  let usesDivine = $derived(['cleric', 'druid', 'paladin', 'ranger'].includes(classKey));
</script>

<div class="flex-column gap-lg">
  {#if mode === 'manage'}
    <SpellSelectorManage
      {classKey}
      {wizardSchool}
      {existingSpells}
      {characterLevel}
      {deityKey}
      {isWizard}
      {isBard}
      {usesArcane}
      {usesDivine}
      {onComplete}
      {onCancel}
    />
  {:else}
    <SpellSelectorCreation
      {classKey}
      {wizardSchool}
      {abilities}
      {existingSpells}
      {deityKey}
      {isCaster}
      {isWizard}
      {isDivine}
      {onComplete}
    />
  {/if}
</div>

<style lang="scss">
  @import './styles/shared';
  @import './styles/spells';
</style>
