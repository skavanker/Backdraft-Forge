<script>
  import { onMount } from 'svelte';
  import NPCGeneratorForm from './components/NPCGeneratorForm.svelte';
  import NPCList from './components/NPCList.svelte';
  import { generateNPC, generateBulkNPCs } from './generators/npcGenerator.js';
  import { initNameGen } from './generators/nameGenerator.js';
  import { loadNPCs, saveNPC, deleteNPC } from './npcPersistence.svelte.js';
  import { useToast } from './utils/stateUtils.svelte.js';

  const toast = useToast();
  let generatedNPCs = $state([]);
  let savedNPCs = $state([]);
  let isGenerating = $state(false);

  onMount(() => {
    initNameGen();
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
        toast.flash('Failed to generate NPCs. Please try again.');
      } finally {
        isGenerating = false;
      }
    }, 100);
  }

  function handleSave(npc) {
    savedNPCs = saveNPC(npc, savedNPCs);
    toast.flash(`${npc.name} saved successfully!`);
  }

  function handleDelete(id) {
    savedNPCs = deleteNPC(id, savedNPCs);
  }

  let clearGeneratedConfirm = $state(false);

  function handleClearGenerated() {
    if (clearGeneratedConfirm) {
      generatedNPCs = [];
      clearGeneratedConfirm = false;
    } else {
      clearGeneratedConfirm = true;
    }
  }
</script>

<div class="npc-generator">
  {#if toast.visible}
    <div class="save-toast alert alert-info">{toast.message}</div>
  {/if}
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
        {#if clearGeneratedConfirm}
          <span class="text-muted" style="--fs: 0.8rem; font-size: var(--fs)">Sure?</span>
          <button class="btn-danger btn-sm" onclick={handleClearGenerated}>Yes</button>
          <button class="btn-secondary btn-sm" onclick={() => clearGeneratedConfirm = false}>No</button>
        {:else}
          <button class="btn-danger btn-sm" onclick={handleClearGenerated}>Clear All</button>
        {/if}
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
    <div class="panel-dashed">
      <p>No NPCs yet. Use the form above to generate your first NPC!</p>
    </div>
  {/if}
</div>

