<script>
  let {
    savedCharacters = [],
    wipPrompt = null,
    onLaunchCharacterCreator,
    onLoadCharacter,
    onDeleteCharacter,
    onImportCharacter,
    onResumeWip = null,
    onDiscardWip = null
  } = $props();

  let showAllSaves = $state(false);

  const displayedCharacters = $derived(
    showAllSaves ? savedCharacters : savedCharacters.slice(0, 5)
  );
</script>

<div class="splash-container">
  <!-- Hero Section -->
  <header class="splash-hero">
    <h1>Backdraft Forge</h1>
    <p class="tagline">Advanced Dungeons & Dragons 2nd Edition Tools</p>
  </header>

  <!-- WIP Prompt -->
  {#if wipPrompt}
    <div class="wip-prompt alert alert-info">
      <span>Unfinished character found — {wipPrompt.character.race?.name || '?'} {wipPrompt.character.kit?.name || wipPrompt.character.wizardSchool?.name || wipPrompt.character.cls?.name || '?'}</span>
      <div class="wip-actions">
        <button class="btn-primary btn-sm" onclick={onResumeWip}>Resume</button>
        <button class="btn-ghost btn-sm" onclick={onDiscardWip}>Discard</button>
      </div>
    </div>
  {/if}

  <!-- Main Actions -->
  <div class="splash-actions">
    <button class="btn-primary btn-lg" onclick={onLaunchCharacterCreator}>
      Create New Character
    </button>
    <button class="btn-ghost" onclick={onImportCharacter}>
      📥 Import Character Code
    </button>
  </div>

  <!-- Tool Grid -->
  <section class="tool-grid">
    <button class="tool-card available" onclick={onLaunchCharacterCreator}>
      <div class="tool-icon">⚔️</div>
      <h2>Character Creator</h2>
      <p>Create player characters with full AD&D 2E rules</p>
      <span class="tool-status">Available</span>
    </button>

    <div class="tool-card coming-soon">
      <div class="tool-icon">👥</div>
      <h2>NPC Generator</h2>
      <p>Quickly generate NPCs with random or custom stats</p>
      <span class="tool-status">Coming Soon</span>
    </div>

    <div class="tool-card coming-soon">
      <div class="tool-icon">🐉</div>
      <h2>Monster Bestiary</h2>
      <p>Browse monsters, generate encounters, stat blocks</p>
      <span class="tool-status">Coming Soon</span>
    </div>

    <div class="tool-card coming-soon">
      <div class="tool-icon">💰</div>
      <h2>Treasure Generator</h2>
      <p>Generate treasure hoards by type or monster</p>
      <span class="tool-status">Coming Soon</span>
    </div>

    <div class="tool-card coming-soon">
      <div class="tool-icon">📜</div>
      <h2>Name Generator</h2>
      <p>Generate names for NPCs, taverns, towns, and more</p>
      <span class="tool-status">Coming Soon</span>
    </div>
  </section>

  <!-- Saved Characters Sidebar -->
  {#if savedCharacters.length > 0}
    <aside class="saved-data">
      <h3>Recent Characters</h3>
      <div class="save-list">
        {#each displayedCharacters as entry (entry.id)}
          <div class="save-entry">
            <button class="save-load" onclick={() => onLoadCharacter(entry)}>
              <span class="save-name">{entry.name}</span>
              <span class="save-meta">{entry.race} {entry.cls}{entry.level > 1 ? ` · Lvl ${entry.level}` : ''}</span>
            </button>
            <button class="save-delete" onclick={() => onDeleteCharacter(entry.id)} title="Delete save" aria-label="Delete {entry.name}">&times;</button>
          </div>
        {/each}
      </div>
      {#if savedCharacters.length > 5}
        <button class="view-all-btn" onclick={() => showAllSaves = !showAllSaves}>
          {showAllSaves ? 'Show Less' : `View All (${savedCharacters.length})`}
        </button>
      {/if}
    </aside>
  {/if}

  <!-- Footer -->
  <footer class="splash-footer">
    <p>Backdraft Forge v1.0 • Open Source AD&D 2E Tools</p>
    <p class="legal">AD&D is a trademark of Wizards of the Coast. Not affiliated.</p>
  </footer>
</div>

<style lang="scss">
  @import './styles/splash';
</style>
