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

<style lang="scss">@import '../styles/widgets';</style>
