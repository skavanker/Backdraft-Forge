<script>
  import { onMount } from 'svelte';
  import NPCGeneratorForm from './components/NPCGeneratorForm.svelte';
  import NPCList from './components/NPCList.svelte';
  import { generateNPC, generateBulkNPCs } from './generators/npcGenerator.js';
  import { loadNPCs, saveNPC, deleteNPC } from './npcPersistence.svelte.js';

  let generatedNPCs = $state([]);
  let savedNPCs = $state([]);
  let isGenerating = $state(false);

  onMount(() => {
    savedNPCs = loadNPCs();
  });

  function handleGenerate(options) {
    isGenerating = true;

    // Small delay to show loading state
    setTimeout(() => {
      try {
        const npcs = options.count > 1
          ? generateBulkNPCs(options.count, options)
          : [generateNPC(options)];

        generatedNPCs = npcs;
      } catch (error) {
        console.error('Failed to generate NPCs:', error);
        alert('Failed to generate NPCs. Please try again.');
      } finally {
        isGenerating = false;
      }
    }, 100);
  }

  function handleSave(npc) {
    savedNPCs = saveNPC(npc, savedNPCs);
    alert(`${npc.name} saved successfully!`);
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this NPC?')) {
      savedNPCs = deleteNPC(id, savedNPCs);
    }
  }

  function handleClearGenerated() {
    if (confirm('Clear all generated NPCs?')) {
      generatedNPCs = [];
    }
  }
</script>

<div class="npc-generator">
  <header class="generator-header">
    <h2>NPC Generator</h2>
    <p class="subtitle">
      Generate random NPCs with weighted equipment packages and archetype templates
    </p>
  </header>

  <!-- Generation Form -->
  <div class="generator-section">
    <NPCGeneratorForm onGenerate={handleGenerate} />
  </div>

  <!-- Loading State -->
  {#if isGenerating}
    <div class="loading-state">
      <p>Generating NPCs...</p>
    </div>
  {/if}

  <!-- Generated NPCs -->
  {#if generatedNPCs.length > 0 && !isGenerating}
    <div class="generator-section">
      <div class="section-header">
        <h3>Generated NPCs</h3>
        <button class="btn-clear" onclick={handleClearGenerated}>
          Clear All
        </button>
      </div>
      <NPCList npcs={generatedNPCs} onSave={handleSave} title="Recently Generated" />
    </div>
  {/if}

  <!-- Saved NPCs -->
  {#if savedNPCs.length > 0}
    <div class="generator-section">
      <NPCList npcs={savedNPCs} onDelete={handleDelete} title="Saved NPCs" saved={true} />
    </div>
  {/if}

  <!-- Empty State -->
  {#if generatedNPCs.length === 0 && savedNPCs.length === 0 && !isGenerating}
    <div class="empty-state">
      <p>No NPCs yet. Use the form above to generate your first NPC!</p>
    </div>
  {/if}
</div>

<style lang="scss">
  @import './styles/shared';

  .npc-generator {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .generator-header {
    text-align: center;
    padding: 1rem;
    border-bottom: 2px solid var(--color-border);

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .subtitle {
      margin: 0;
      font-size: 1rem;
      color: var(--color-text-secondary);
    }
  }

  .generator-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .btn-clear {
      padding: 0.5rem 1rem;
      background: var(--color-danger);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--color-danger-dark);
      }
    }
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background: var(--color-bg-secondary);
    border-radius: 4px;
    border: 1px dashed var(--color-border);

    p {
      margin: 0;
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    background: var(--color-bg-secondary);
    border-radius: 4px;
    border: 1px dashed var(--color-border);

    p {
      margin: 0;
      font-size: 1.125rem;
      color: var(--color-text-secondary);
      text-align: center;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
