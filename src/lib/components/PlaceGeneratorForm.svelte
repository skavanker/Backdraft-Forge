<script>
  import SelectableChip from './SelectableChip.svelte';

  let { options, onchange } = $props();

  // Place types organized by category
  const placeTypes = {
    settlements: [
      { value: 'city', label: 'City' },
      { value: 'town', label: 'Town' },
      { value: 'village', label: 'Village' }
    ],
    landmarks: [
      { value: 'mountain', label: 'Mountain' },
      { value: 'forest', label: 'Forest' },
      { value: 'river', label: 'River' },
      { value: 'lake', label: 'Lake' },
      { value: 'cave', label: 'Cave' },
      { value: 'bridge', label: 'Bridge' },
      { value: 'road', label: 'Road' },
      { value: 'graveyard', label: 'Graveyard' },
      { value: 'ruins', label: 'Ruins' }
    ],
    buildings: [
      { value: 'tavern', label: 'Tavern/Inn' },
      { value: 'shop', label: 'Shop' },
      { value: 'temple', label: 'Temple' },
      { value: 'tower', label: 'Tower' },
      { value: 'castle', label: 'Castle' },
      { value: 'library', label: 'Library' },
      { value: 'dungeon', label: 'Dungeon' }
    ]
  };

  const geographies = ['Coastal', 'Mountain', 'Forest', 'Plains', 'Swamp', 'Desert'];

  const quantities = [1, 3, 5, 10, 100];

  // Track which category is currently selected
  let selectedCategory = $state('settlements');

  // Auto-detect which category contains the current placeType
  $effect(() => {
    const currentType = options.placeType;

    // Check for random-category format
    if (currentType.startsWith('random-')) {
      selectedCategory = currentType.replace('random-', '');
      return;
    }

    // Check for specific types
    if (placeTypes.settlements.some(t => t.value === currentType)) {
      selectedCategory = 'settlements';
    } else if (placeTypes.landmarks.some(t => t.value === currentType)) {
      selectedCategory = 'landmarks';
    } else if (placeTypes.buildings.some(t => t.value === currentType)) {
      selectedCategory = 'buildings';
    }
  });

  /**
   * Handle selection change
   */
  function handleChange(field, value) {
    onchange({ [field]: value });
  }

  /**
   * Check if style option should be shown for current place type
   */
  function showStyleOption() {
    return options.placeType === 'tavern' || options.placeType === 'shop';
  }
</script>

<div class="place-generator-form">
  <!-- Place Type Selection -->
  <div class="form-section">
    <h4 class="form-label">Place Type</h4>

    <!-- Category Buttons -->
    <div class="button-row">
      <button
        class="btn-primary"
        class:selected={selectedCategory === 'settlements'}
        onclick={() => {
          selectedCategory = 'settlements';
          handleChange('placeType', 'random-settlements');
        }}
      >
        Settlements
      </button>
      <button
        class="btn-primary"
        class:selected={selectedCategory === 'landmarks'}
        onclick={() => {
          selectedCategory = 'landmarks';
          handleChange('placeType', 'random-landmarks');
        }}
      >
        Landmarks
      </button>
      <button
        class="btn-primary"
        class:selected={selectedCategory === 'buildings'}
        onclick={() => {
          selectedCategory = 'buildings';
          handleChange('placeType', 'random-buildings');
        }}
      >
        Buildings
      </button>
    </div>

    <!-- Type Options for Selected Category (with Random option) -->
    <div class="grid-compact gap-sm">
      <SelectableChip
        label="Random"
        selected={options.placeType === `random-${selectedCategory}`}
        onclick={() => handleChange('placeType', `random-${selectedCategory}`)}
      />
      {#each placeTypes[selectedCategory] as type}
        <SelectableChip
          label={type.label}
          selected={options.placeType === type.value}
          onclick={() => handleChange('placeType', type.value)}
        />
      {/each}
    </div>
  </div>

  <!-- Location (only for settlements and buildings, not landmarks) -->
  {#if selectedCategory !== 'landmarks'}
    <div class="form-section">
      <h4 class="form-label">Location</h4>
      <div class="grid-compact gap-sm">
        <SelectableChip
          label="Random"
          selected={options.geography === 'random'}
          onclick={() => handleChange('geography', 'random')}
        />
        {#each geographies as geography}
          <SelectableChip
            label={geography}
            selected={options.geography === geography.toLowerCase()}
            onclick={() => handleChange('geography', geography.toLowerCase())}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Style (for taverns and shops only) -->
  {#if showStyleOption()}
    <div class="form-section">
      <h4 class="form-label">Naming Style</h4>
      <div class="grid-compact gap-sm">
        <SelectableChip
          label="Random"
          selected={options.style === 'random'}
          onclick={() => handleChange('style', 'random')}
        />
        <SelectableChip
          label="Pattern"
          selected={options.style === 'pattern'}
          onclick={() => handleChange('style', 'pattern')}
        />
        <SelectableChip
          label="Owner"
          selected={options.style === 'owner'}
          onclick={() => handleChange('style', 'owner')}
        />
      </div>
      <p class="section-hint">
        Pattern: The [Adjective] [Noun] • Owner: [Character Name]'s [Type]
      </p>
    </div>
  {/if}

  <!-- Quantity -->
  <div class="form-section">
    <h4 class="form-label">Quantity</h4>
    <div class="grid-compact gap-sm">
      {#each quantities as qty}
        <SelectableChip
          label={qty.toString()}
          selected={options.quantity === qty}
          onclick={() => handleChange('quantity', qty)}
        />
      {/each}
    </div>
  </div>
</div>