<script>
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
    const { decodeCharacter } = await import('./shareCharacter.js');
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

<button class="btn-ghost btn-sm" onclick={() => showImportArea = !showImportArea}>
  📥 Import character code
</button>
{#if showImportArea}
  <div class="import-area">
    <textarea
      bind:value={importCode}
      placeholder="Paste character code here..."
      rows="6"
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
  @import '../styles/mixins.scss';

  .import-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-sm;
    width: 100%;
    max-width: 500px;

    textarea {
      width: 100%;
      padding: $space-md;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-input);
      resize: vertical;
    }
  }

  .import-error {
    padding: $space-sm $space-md;
    background: rgba(180, 60, 40, 0.15);
    border: 1px solid rgba(180, 60, 40, 0.3);
    border-radius: 4px;
    color: var(--red);
  }
</style>
