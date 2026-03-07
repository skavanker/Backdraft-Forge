<script>
  import { ABILITIES } from '../data/constants.js';

  let { character } = $props();

  // Check what info is available
  let hasName = $derived(character.name && character.name.trim());
  let hasRace = $derived(character.race !== null);
  let hasClass = $derived(character.cls !== null);
  let hasAbilities = $derived(character.adjustedAbilities || character.abilities);
  let showSummary = $derived(hasName || hasRace || hasClass || hasAbilities);
</script>

{#if showSummary}
  <div class="character-summary panel">
    {#if hasName || hasRace || hasClass}
      <div class="summary-main">
        {#if hasName}
          <span>{character.name}</span>
          {#if hasRace || hasClass}
            <span class="meta-text">•</span>
          {/if}
        {/if}
        {#if hasRace}
          <span>{character.race.name}</span>
        {/if}
        {#if hasClass}
          <span class="char-class">
            {character.wizardSchool?.name || character.cls.name}
          </span>
        {/if}
      </div>
    {/if}

    {#if hasAbilities}
      {@const abilities = character.adjustedAbilities || character.abilities}
      <div class="summary-abilities">
        {#each ABILITIES as ability}
          <span class="ability-stat">
            <span class="meta-text">{ability}</span>
            <span>{abilities[ability]}</span>
          </span>
        {/each}
      </div>
    {/if}
  </div>
{/if}



