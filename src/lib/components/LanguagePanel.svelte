<script>
  import SelectableChip from './SelectableChip.svelte';
  import { languages } from '../../data/languages.js';

  let {
    allSelectableLanguages,
    autoLanguages,
    selectedBonusLanguages,
    bonusLanguageSlots,
    bonusLanguageSlotsRemaining,
    onToggle
  } = $props();
</script>

<div class="section language-section">
  <h3 id="languages-heading">Languages</h3>
  <p class="section-hint">
    Select languages. Your race and class grant some automatically.
    {#if bonusLanguageSlots > 0}
      Your Intelligence grants {bonusLanguageSlots} additional language{bonusLanguageSlots !== 1 ? 's' : ''}.
      {#if bonusLanguageSlotsRemaining > 0}
        <span class="meta-text remaining">({bonusLanguageSlotsRemaining} bonus remaining)</span>
      {/if}
    {/if}
  </p>

  <div class="language-grid" role="group" aria-labelledby="languages-heading">
    {#each allSelectableLanguages() as key}
      {@const isAuto = autoLanguages.includes(key)}
      {@const selected = isAuto || selectedBonusLanguages.includes(key)}
      {@const disabled = isAuto || (!selected && bonusLanguageSlotsRemaining === 0)}
      <SelectableChip
        label={languages[key].name}
        {selected}
        {disabled}
        auto={isAuto}
        onclick={() => onToggle(key)}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  @import '../styles/proficiency';
  @import '../styles/widgets';
</style>
