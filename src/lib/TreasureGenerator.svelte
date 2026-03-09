<script>
  import { onMount } from 'svelte';
  import TreasureGeneratorForm from './components/TreasureGeneratorForm.svelte';
  import TreasureHoard from './components/TreasureHoard.svelte';
  import TreasureItemList from './components/TreasureItemList.svelte';
  import { generateTreasure, generateBulkTreasure, generateTreasureByLevel, generateTreasureByValue, generateSingleItems } from './generators/treasureGenerator.js';
  import { loadTreasures, saveTreasure, deleteTreasure } from './treasurePersistence.svelte.js';
  import { useToast } from './utils/stateUtils.svelte.js';
  import ConfirmButton from './components/ConfirmButton.svelte';
  import GeneratorPage from './components/GeneratorPage.svelte';

  const toast = useToast();
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
        toast.flash('Failed to generate treasure. Please try again.');
      } finally {
        isGenerating = false;
      }
    }, 100);
  }

  function handleSave(hoard) {
    savedHoards = saveTreasure(hoard, savedHoards);
    toast.flash('Treasure hoard saved successfully!');
  }

  function handleDelete(id) {
    savedHoards = deleteTreasure(id, savedHoards);
  }

  function handleClearGenerated() {
    generatedHoards = [];
  }

  // Calculate total value of all generated hoards
  const totalGeneratedValue = $derived(
    generatedHoards.reduce((sum, hoard) => sum + hoard.totalValue, 0)
  );

  const totalSavedValue = $derived(
    savedHoards.reduce((sum, entry) => sum + entry.totalValue, 0)
  );
</script>

<GeneratorPage {toast}>

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
        <ConfirmButton label="Clear All" onconfirm={handleClearGenerated} />
      </div>
      <div class="grid-xl animate-in">
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
      <div class="grid-xl animate-in">
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
    <div class="panel-dashed">
      <p>No treasure hoards yet. Use the form above to generate your first hoard!</p>
    </div>
  {/if}
</GeneratorPage>

<style lang="scss">

  .section-header .header-info {
    display: flex;
    align-items: center;
    gap: $space-md;

    .total-value {
      background: var(--gold-dark); color: white;
    }
  }

  // .hoard-grid → uses .grid-xl utility class on element
</style>
