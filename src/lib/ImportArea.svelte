<script>
  import { decodeCharacter } from './shareCharacter.js';

  let { onImport } = $props();

  let showImportArea = $state(false);
  let importCode = $state('');
  let importError = $state('');

  async function loadImportedCharacter() {
    importError = '';
    const trimmed = importCode.trim();
    if (!trimmed) {
      importError = 'Please paste a character code';
      return;
    }
    const imported = await decodeCharacter(trimmed);
    if (!imported) {
      importError = 'Invalid character code';
      return;
    }
    onImport?.(imported);
    showImportArea = false;
    importCode = '';
  }
</script>

<button class="btn-ghost toggle-btn" onclick={() => showImportArea = !showImportArea}>
  📥 Import character code
</button>
{#if showImportArea}
  <div class="import-area">
    <textarea
      bind:value={importCode}
      placeholder="Paste character code here..."
      rows="3"
    ></textarea>
    <button class="btn-primary" onclick={loadImportedCharacter}>
      Load Character
    </button>
    {#if importError}
      <p class="import-error">{importError}</p>
    {/if}
  </div>
{/if}

<style lang="scss">
  .toggle-btn {
    font-size: 0.85rem;
    padding: 0.35rem 0.75rem;
  }

  .import-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    max-width: 500px;

    textarea {
      width: 100%;
      padding: 0.75rem;
      font-family: monospace;
      font-size: 0.8rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-input);
      color: var(--text-body);
      resize: vertical;
    }
  }

  .import-error {
    margin: 0;
    padding: 0.5rem 1rem;
    background: rgba(180, 60, 40, 0.15);
    border: 1px solid rgba(180, 60, 40, 0.3);
    border-radius: 4px;
    color: #b43c28;
    font-size: 0.875rem;
  }
</style>
