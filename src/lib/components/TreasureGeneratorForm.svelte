<script>
  import { treasureTypes } from '../../data/treasure.js';
  import SelectableChip from './SelectableChip.svelte';

  let { onGenerate } = $props();

  const treasureTypeList = Object.entries(treasureTypes).map(([key, data]) => ({
    key,
    name: data.name
  }));

  let options = $state({
    method: 'type', // 'type' | 'cr' | 'single-item' | 'by-value'
    treasureType: 'B',
    cr: 5,
    count: 1,
    source: '',
    itemType: 'gem', // 'gem' | 'art' | 'magic' | 'mundane'
    targetValue: 1000 // Target gold value
  });

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate(options);
  }
</script>

<form class="treasure-form" onsubmit={handleSubmit}>
  <!-- Generation Method -->
  <div class="form-section">
    <h4 class="form-label">Generation Method</h4>
    <div class="button-row">
      <button
        type="button"
        class="btn-primary"
        class:selected={options.method === 'type'}
        onclick={() => options.method = 'type'}
      >By Type</button>
      <button
        type="button"
        class="btn-primary"
        class:selected={options.method === 'cr'}
        onclick={() => options.method = 'cr'}
      >By CR</button>
      <button
        type="button"
        class="btn-primary"
        class:selected={options.method === 'single-item'}
        onclick={() => options.method = 'single-item'}
      >Single Item</button>
      <button
        type="button"
        class="btn-primary"
        class:selected={options.method === 'by-value'}
        onclick={() => options.method = 'by-value'}
      >By Value</button>
    </div>
  </div>

  {#if options.method === 'single-item'}
    <!-- Single Item Type Selection -->
    <div class="form-section">
      <h4 class="form-label" id="treasure-item-type">Item Type</h4>
      <div class="grid-compact gap-sm" role="group" aria-labelledby="treasure-item-type">
        <SelectableChip
          label="Gem"
          selected={options.itemType === 'gem'}
          onclick={() => options.itemType = 'gem'}
        />
        <SelectableChip
          label="Art Object"
          selected={options.itemType === 'art'}
          onclick={() => options.itemType = 'art'}
        />
        <SelectableChip
          label="Magic Item"
          selected={options.itemType === 'magic'}
          onclick={() => options.itemType = 'magic'}
        />
        <SelectableChip
          label="Mundane"
          selected={options.itemType === 'mundane'}
          onclick={() => options.itemType = 'mundane'}
        />
      </div>
    </div>

    <!-- Quantity for Single Items -->
    <div class="form-section">
      <h4 class="form-label">Quantity</h4>
      <input
        type="number"
        bind:value={options.count}
        min="1"
        max="20"
        class="count-input"
      />
      <p class="section-hint">Generate 1-20 items at once</p>
    </div>

  {:else if options.method === 'by-value'}
    <!-- Target Value Input -->
    <div class="form-section">
      <h4 class="form-label">Target Value</h4>
      <div class="value-input-group">
        <input
          type="number"
          bind:value={options.targetValue}
          min="10"
          max="1000000"
          step="10"
          class="value-input"
        />
        <span class="value-label">gp</span>
      </div>
      <p class="section-hint">Generate treasure worth approximately this amount</p>
    </div>

  {:else if options.method === 'type'}
    <!-- Treasure Type Selection -->
    <div class="form-section">
      <h4 class="form-label" id="treasure-type">Treasure Type</h4>
      <div class="grid-compact gap-sm" role="group" aria-labelledby="treasure-type">
        {#each treasureTypeList as type}
          <SelectableChip
            label={type.key}
            metadata={type.name}
            selected={options.treasureType === type.key}
            onclick={() => options.treasureType = type.key}
          />
        {/each}
      </div>
    </div>
  {:else}
    <!-- Challenge Rating -->
    <div class="form-section">
      <h4 class="form-label">Challenge Rating</h4>
      <input
        type="number"
        bind:value={options.cr}
        min="1"
        max="30"
        class="cr-input"
      />
      <p class="section-hint">Automatically selects appropriate treasure type based on CR</p>
    </div>
  {/if}

  <!-- Source Description -->
  <div class="form-section">
    <h4 class="form-label">Source</h4>
    <input
      type="text"
      bind:value={options.source}
      placeholder="e.g., Dragon's hoard, Bandit camp, Ancient tomb"
      class="source-input"
    />
    <p class="section-hint">Optional description of where this treasure came from</p>
  </div>

  <!-- Quantity -->
  <div class="form-section">
    <h4 class="form-label">Quantity</h4>
    <input
      type="number"
      bind:value={options.count}
      min="1"
      max="10"
      class="count-input"
    />
    <p class="section-hint">Generate 1-10 hoards at once</p>
  </div>

  <!-- Generate Button -->
  <button type="submit" class="btn-primary">
    {#if options.method === 'single-item'}
      Generate {options.count > 1 ? `${options.count} Items` : 'Item'}
    {:else}
      Generate {options.count > 1 ? `${options.count} Hoards` : 'Hoard'}
    {/if}
  </button>
</form>