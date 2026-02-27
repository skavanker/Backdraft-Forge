<script>
  import ImportArea from '../ImportArea.svelte';

  let {
    menuOpen,
    onSave,
    onShare,
    onExportCode,
    onImport,
    onUndo,
    onPrint,
    onResetLevel,
    canUndo = false,
    shareLinkWarning = '',
    charLevel = 1,
    confirmResetLevel
  } = $props();

  function handleKeydown(e) {
    if (e.key === 'Escape') menuOpen.close();
  }

  function handleClickOutside(e) {
    if (menuOpen.value && !e.target.closest('.action-menu') && !e.target.closest('.hamburger-btn')) {
      menuOpen.close();
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onkeydown={handleKeydown} onclick={handleClickOutside}>
  <button class="hamburger-btn" onclick={menuOpen.toggle} title="Actions menu">&#9776;</button>
  {#if menuOpen.value}
    <div class="action-menu">
      <div class="menu-group">
        <button class="menu-item" onclick={() => { onSave(); menuOpen.close(); }}>Save</button>
        <button class="menu-item" onclick={() => { onShare(); menuOpen.close(); }}>Share Link{shareLinkWarning ? ' ⚠' : ''}</button>
        <button class="menu-item" onclick={() => { onExportCode(); menuOpen.close(); }}>Export Code</button>
      </div>
      <div class="menu-group">
        <ImportArea {onImport} />
      </div>
      <div class="menu-group">
        {#if canUndo}
          <button class="menu-item" onclick={() => { onUndo(); menuOpen.close(); }}>Undo</button>
        {/if}
        <button class="menu-item" onclick={() => { onPrint(); menuOpen.close(); }}>Print</button>
        {#if charLevel > 1}
          {#if confirmResetLevel.value}
            <div class="menu-confirm">
              <span>Reset to level 1?</span>
              <button class="btn-danger btn-sm" onclick={() => { onResetLevel(); menuOpen.close(); }}>Yes</button>
              <button class="btn-ghost btn-sm" onclick={confirmResetLevel.close}>No</button>
            </div>
          {:else}
            <button class="menu-item" onclick={confirmResetLevel.open}>Reset Level</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</div>
