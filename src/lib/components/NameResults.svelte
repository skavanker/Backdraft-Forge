<script>
  let { names } = $props();

  let copiedIndex = $state(-1);
  let copyError = $state(false);

  /**
   * Copy a single name to clipboard
   */
  async function copyName(name, index) {
    try {
      await navigator.clipboard.writeText(name);
      copiedIndex = index;
      copyError = false;
      setTimeout(() => {
        copiedIndex = -1;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      copyError = true;
      copiedIndex = index;
      setTimeout(() => {
        copiedIndex = -1;
        copyError = false;
      }, 2000);
    }
  }
</script>

<div class="name-results">
  <div class="names-list">
    {#each names as nameObj, index}
      {@const name = nameObj.name}
      {@const meta = nameObj.meta}
      <button
        class="name-item"
        onclick={() => copyName(name, index)}
        aria-label="Copy {name}"
        title="Click to copy"
      >
        <span class="name-text">{name}</span>
        {#if meta}
          <span class="name-meta">
            {#if meta.race}
              {meta.race} • {meta.gender} • {meta.class} • {meta.socialClass} • {meta.style}
            {:else if meta.placeType}
              {meta.placeType} • {meta.geography}
            {/if}
          </span>
        {/if}
        <span class="copy-indicator">
          {copiedIndex === index ? (copyError ? '✗' : '✓') : '📋'}
        </span>
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  @import '../styles/name-generator';
</style>
