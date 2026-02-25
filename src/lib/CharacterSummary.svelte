<script>
  let { character } = $props();

  // Check what info is available
  let hasName = $derived(character.name && character.name.trim());
  let hasRace = $derived(character.race !== null);
  let hasClass = $derived(character.cls !== null);
  let hasAbilities = $derived(character.adjustedAbilities || character.abilities);
  let showSummary = $derived(hasName || hasRace || hasClass || hasAbilities);
</script>

{#if showSummary}
  <div class="character-summary">
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
        {#each ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as ability}
          <span class="ability-stat">
            <span class="meta-text">{ability}</span>
            <span>{abilities[ability]}</span>
          </span>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @import '../styles/mixins.scss';

  .character-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-md;
    padding: $space-md;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: $space-lg;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-sm;
    }
  }

  .summary-main {
    display: flex;
    align-items: center;
    gap: $space-sm;

    .char-class {
      color: var(--gold-dark);
    }
  }

  .summary-abilities {
    display: flex;
    gap: $space-md;
    flex-wrap: wrap;
  }

  .ability-stat {
    display: flex;
    align-items: center;
    gap: $space-xs;
    padding: $space-xs $space-sm;
    background: var(--bg-input);
    border-radius: 2px;
  }
</style>
