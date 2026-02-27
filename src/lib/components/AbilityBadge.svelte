<script>
  /**
   * AbilityBadge - Reusable component for displaying ability scores
   * Used in ReviewStep and CharacterSheet
   */
  let {
    ability,
    score,
    exceptionalStr = null,
    modifier = null,
    variant = 'simple'
  } = $props();

  let displayScore = $derived(() => {
    if (ability === 'STR' && exceptionalStr) {
      return `${score}/${exceptionalStr.toString().padStart(2, '0')}`;
    }
    return score;
  });
</script>

{#if variant === 'simple'}
  <div class="ability-badge">
    <span class="meta-text">{ability}</span>
    <span class="text-xl">{displayScore()}</span>
  </div>
{:else if variant === 'detailed'}
  <div class="ability">
    <div class="name meta-text">{ability}</div>
    <div class="score">{displayScore()}</div>
    {#if modifier !== null}
      <div class="mod meta-text">{modifier}</div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @import '../../styles/mixins.scss';

  /* Simple variant (ReviewStep) */
  .ability-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-sm $space-md;
    background: rgba(201, 162, 39, 0.15);
    border: 1px solid rgba(201, 162, 39, 0.3);
    border-radius: 4px;
    min-width: 50px;
  }

  /* Detailed variant (CharacterSheet) */
  .ability {
    border: 2px solid var(--border-color);
    padding: $space-md $space-xs;
    background: var(--bg-input);
    text-align: center;
  }

  /* Print styles */
  @media print {
    .ability .name,
    .ability .score,
    .ability .mod {
      color: #000 !important;
    }

    .ability {
      background: white !important;
      border-color: #000 !important;
    }
  }
</style>
