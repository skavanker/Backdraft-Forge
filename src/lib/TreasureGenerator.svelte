<script>
  import { onMount } from 'svelte';
  import TreasureGeneratorForm from './components/TreasureGeneratorForm.svelte';
  import TreasureHoard from './components/TreasureHoard.svelte';
  import TreasureItemList from './components/TreasureItemList.svelte';
  import { generateTreasure, generateBulkTreasure, generateTreasureByLevel, generateTreasureByValue } from './generators/treasureGenerator.js';
  import { loadTreasures, saveTreasure, deleteTreasure } from './treasurePersistence.svelte.js';

  let generatedHoards = $state([]);
  let savedHoards = $state([]);
  let isGenerating = $state(false);

  onMount(() => {
    savedHoards = loadTreasures();
  });

  function handleGenerate(options) {
    isGenerating = true;

    setTimeout(async () => {
      try {
        let hoards;

        if (options.method === 'single-item') {
          // Generate single items
          const { generateSingleItems } = await import('./generators/treasureGenerator.js');
          hoards = [generateSingleItems(options.itemType, options.count)];
        } else if (options.method === 'by-value') {
          // Generate by target value
          hoards = [generateTreasureByValue(options.targetValue, options.source)];
        } else if (options.method === 'cr') {
          // Generate by CR
          hoards = options.count > 1
            ? Array.from({ length: options.count }, () => generateTreasureByLevel(options.cr))
            : [generateTreasureByLevel(options.cr)];
        } else {
          // Generate by treasure type
          hoards = options.count > 1
            ? generateBulkTreasure(options.count, options.treasureType, options.source)
            : [generateTreasure(options.treasureType, options.source)];
        }

        generatedHoards = hoards;
      } catch (error) {
        console.error('Failed to generate treasure:', error);
        alert('Failed to generate treasure. Please try again.');
      } finally {
        isGenerating = false;
      }
    }, 100);
  }

  function handleSave(hoard) {
    savedHoards = saveTreasure(hoard, savedHoards);
    alert('Treasure hoard saved successfully!');
  }

  function handleDelete(id) {
    if (confirm('Are you sure you want to delete this treasure hoard?')) {
      savedHoards = deleteTreasure(id, savedHoards);
    }
  }

  function handleClearGenerated() {
    if (confirm('Clear all generated treasure hoards?')) {
      generatedHoards = [];
    }
  }

  // Calculate total value of all generated hoards
  const totalGeneratedValue = $derived(
    generatedHoards.reduce((sum, hoard) => sum + hoard.totalValue, 0)
  );

  const totalSavedValue = $derived(
    savedHoards.reduce((sum, entry) => sum + entry.totalValue, 0)
  );
</script>

<div class="treasure-generator">
  <header class="generator-header">
    <h2>Treasure Generator</h2>
    <p class="subtitle">
      Generate treasure hoards using AD&D 2E treasure types (A-O)
    </p>
  </header>

  <!-- Generation Form -->
  <div class="generator-section">
    <TreasureGeneratorForm onGenerate={handleGenerate} />
  </div>

  <!-- Loading State -->
  {#if isGenerating}
    <div class="loading-state">
      <p>Generating treasure...</p>
    </div>
  {/if}

  <!-- Generated Hoards -->
  {#if generatedHoards.length > 0 && !isGenerating}
    <div class="generator-section">
      <div class="section-header">
        <div class="header-info">
          <h3>Generated Hoards</h3>
          <span class="total-value">
            Total: {totalGeneratedValue.toLocaleString()} gp
          </span>
        </div>
        <button class="btn-clear" onclick={handleClearGenerated}>
          Clear All
        </button>
      </div>
      <div class="hoard-grid">
        {#each generatedHoards as hoard (hoard.id)}
          {#if hoard.type === 'gem' || hoard.type === 'art' || hoard.type === 'magic' || hoard.type === 'mundane'}
            <TreasureItemList items={hoard.items} itemType={hoard.type} onSave={() => handleSave(hoard)} />
          {:else}
            <TreasureHoard treasure={hoard} onSave={handleSave} />
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Saved Hoards -->
  {#if savedHoards.length > 0}
    <div class="generator-section">
      <div class="section-header">
        <div class="header-info">
          <h3>Saved Hoards</h3>
          <span class="total-value">
            Total: {totalSavedValue.toLocaleString()} gp
          </span>
        </div>
      </div>
      <div class="hoard-grid">
        {#each savedHoards as entry (entry.id)}
          {#if entry.data.type === 'gem' || entry.data.type === 'art' || entry.data.type === 'magic' || entry.data.type === 'mundane'}
            <TreasureItemList items={entry.data.items} itemType={entry.data.type} onDelete={() => handleDelete(entry.id)} />
          {:else}
            <TreasureHoard
              treasure={entry.data}
              onDelete={() => handleDelete(entry.id)}
              showActions={true}
            />
          {/if}
        {/each}
      </div>
    </div>
  {/if}

  <!-- Empty State -->
  {#if generatedHoards.length === 0 && savedHoards.length === 0 && !isGenerating}
    <div class="empty-state">
      <p>No treasure hoards yet. Use the form above to generate your first hoard!</p>
    </div>
  {/if}
</div>

<style lang="scss">
  @import './styles/shared';

  .treasure-generator {
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

    .header-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      h3 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .total-value {
        padding: 0.25rem 0.75rem;
        background: #d4af37;
        color: #000;
        font-size: 0.875rem;
        font-weight: 700;
        border-radius: 4px;
      }
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

  .hoard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
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
