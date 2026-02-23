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
          <span class="char-name">{character.name}</span>
          {#if hasRace || hasClass}
            <span class="separator">•</span>
          {/if}
        {/if}
        {#if hasRace}
          <span class="char-race">{character.race.name}</span>
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
            <span class="ability-abbr">{ability}</span>
            <span class="ability-num">{abilities[ability]}</span>
          </span>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .character-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  .summary-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 1rem;

    .char-name {
      color: var(--text-primary);
      font-weight: 600;
    }

    .separator {
      color: var(--text-muted);
    }

    .char-race {
      color: var(--text-body);
    }

    .char-class {
      color: var(--gold-dark);
      font-weight: 600;
    }
  }

  .summary-abilities {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .ability-stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-input);
    border-radius: 2px;

    .ability-abbr {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .ability-num {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
</style>
