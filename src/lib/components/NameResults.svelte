<script>
  import { useCopyFeedback } from '../utils/stateUtils.svelte.js';

  let { names } = $props();

  const copied = useCopyFeedback();

  /**
   * Copy a single name to clipboard
   */
  async function copyName(name, index) {
    try {
      await navigator.clipboard.writeText(name);
      copied.flash(index);
    } catch (err) {
      console.error('Failed to copy:', err);
      copied.flash(index, true);
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
          {copied.activeIndex === index ? (copied.isError ? '✗' : '✓') : '📋'}
        </span>
      </button>
    {/each}
  </div>
</div>