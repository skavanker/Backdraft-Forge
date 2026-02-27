<script>
  import { settings } from '../settings.svelte.js';
  import ImportArea from '../ImportArea.svelte';

  let {
    open = false,
    onClose,
    showActions = false,
    // Action callbacks (only used when showActions is true)
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
  } = $props();

  let confirmResetLevel = $state(false);

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose?.();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="settings-backdrop" onclick={handleBackdropClick} onkeydown={handleKeydown}>
    <div class="settings-panel" role="dialog" aria-label="Settings">
      <div class="settings-header">
        <h3>Settings</h3>
        <button class="settings-close" onclick={onClose}>&times;</button>
      </div>

      <!-- Preferences -->
      <div class="settings-section">
        <div class="settings-section-title">Preferences</div>

        <div class="setting-row">
          <span class="setting-label">Theme</span>
          <div class="toggle-group">
            <button class="toggle-option" class:active={settings.theme === 'light'} onclick={() => settings.theme = 'light'}>Light</button>
            <button class="toggle-option" class:active={settings.theme === 'dark'} onclick={() => settings.theme = 'dark'}>Dark</button>
            <button class="toggle-option" class:active={settings.theme === 'auto'} onclick={() => settings.theme = 'auto'}>Auto</button>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">Units</span>
          <div class="toggle-group">
            <button class="toggle-option" class:active={settings.units === 'imperial'} onclick={() => settings.units = 'imperial'}>Imperial</button>
            <button class="toggle-option" class:active={settings.units === 'metric'} onclick={() => settings.units = 'metric'}>Metric</button>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">Default Roll</span>
          <div class="toggle-group">
            <button class="toggle-option" class:active={settings.rollMethod === '4d6drop'} onclick={() => settings.rollMethod = '4d6drop'}>4d6 Drop</button>
            <button class="toggle-option" class:active={settings.rollMethod === '3d6'} onclick={() => settings.rollMethod = '3d6'}>3d6</button>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">Font Size</span>
          <div class="toggle-group">
            <button class="toggle-option" class:active={settings.fontSize === 'small'} onclick={() => settings.fontSize = 'small'}>S</button>
            <button class="toggle-option" class:active={settings.fontSize === 'medium'} onclick={() => settings.fontSize = 'medium'}>M</button>
            <button class="toggle-option" class:active={settings.fontSize === 'large'} onclick={() => settings.fontSize = 'large'}>L</button>
          </div>
        </div>

        <label class="setting-checkbox">
          <input type="checkbox" checked={settings.autoRandomize} onchange={(e) => settings.autoRandomize = e.target.checked} />
          <div class="setting-checkbox-text">
            <div class="setting-label">Auto-Randomize Details</div>
            <div class="setting-description">Auto-fill age, height, weight, eyes, and hair on the backstory step</div>
          </div>
        </label>

        <label class="setting-checkbox">
          <input type="checkbox" checked={settings.lenientMode} onchange={(e) => settings.lenientMode = e.target.checked} />
          <div class="setting-checkbox-text">
            <div class="setting-label">Lenient DM Mode</div>
            <div class="setting-description">Relaxes race/class restrictions, ability minimums, level limits, and alignment requirements</div>
          </div>
        </label>
      </div>

      <!-- Actions (character sheet only) -->
      {#if showActions}
        <div class="settings-section">
          <div class="settings-section-title">Actions</div>
          <div class="settings-actions">
            <button class="settings-action-btn" onclick={() => { onSave?.(); onClose?.(); }}>Save</button>
            <button class="settings-action-btn" onclick={() => { onShare?.(); onClose?.(); }}>Share Link{shareLinkWarning ? ' \u26A0' : ''}</button>
            <button class="settings-action-btn" onclick={() => { onExportCode?.(); onClose?.(); }}>Export Code</button>
            <ImportArea {onImport} />
            {#if canUndo}
              <button class="settings-action-btn" onclick={() => { onUndo?.(); onClose?.(); }}>Undo</button>
            {/if}
            <button class="settings-action-btn" onclick={() => { onPrint?.(); onClose?.(); }}>Print</button>
            {#if charLevel > 1}
              {#if confirmResetLevel}
                <div class="settings-confirm-row">
                  <span>Reset to level 1?</span>
                  <button class="btn-danger btn-sm" onclick={() => { onResetLevel?.(); confirmResetLevel = false; onClose?.(); }}>Yes</button>
                  <button class="btn-ghost btn-sm" onclick={() => confirmResetLevel = false}>No</button>
                </div>
              {:else}
                <button class="settings-action-btn danger" onclick={() => confirmResetLevel = true}>Reset Level</button>
              {/if}
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">@import '../styles/settings';</style>
