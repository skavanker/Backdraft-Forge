<script>
  import { useCopyFeedback } from '../utils/stateUtils.svelte.js';
  import { nameMetaText } from '../utils/formatUtils.js';

  let { names, favorites = [], onregenerate, onfavorite } = $props();

  const copied = useCopyFeedback();

  async function copyName(name, index) {
    try {
      await navigator.clipboard.writeText(name);
      copied.flash(index);
    } catch (err) {
      console.error('Failed to copy:', err);
      copied.flash(index, true);
    }
  }

  function isFavorited(name) {
    return favorites.some(f => f.name === name);
  }
</script>

<div class="name-results">
  <div class="names-list">
    {#each names as nameObj, index}
      {@const name = nameObj.name}
      <div class="name-item">
        <div class="name-main">
          <span class="name-text">{name}</span>
          <span class="name-meta">{nameMetaText(nameObj.meta)}</span>
        </div>
        <div class="name-actions">
          <button
            class="name-action-btn"
            class:is-starred={isFavorited(name)}
            onclick={() => onfavorite(nameObj)}
            title={isFavorited(name) ? 'Remove from favorites' : 'Save to favorites'}
          >★</button>
          <button
            class="name-action-btn"
            onclick={() => onregenerate(index)}
            title="Regenerate"
          >↻</button>
          <button
            class="name-action-btn"
            onclick={() => copyName(name, index)}
            title="Copy to clipboard"
          >{copied.activeIndex === index ? (copied.isError ? '✗' : '✓') : '⎘'}</button>
        </div>
      </div>
    {/each}
  </div>
</div>
