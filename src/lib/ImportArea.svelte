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
      aria-label="Character import code"
    ></textarea>
    <button class="btn-primary" onclick={loadImportedCharacter}>
      Load Character
    </button>
    {#if importError}
      <p class="import-error">{importError}</p>
    {/if}
  </div>
{/if}

<style lang="scss">@import './styles/widgets';</style>
