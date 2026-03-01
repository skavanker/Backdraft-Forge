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

  const quantities = [1, 3, 5, 10];

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

    <!-- Settlements -->
    <div class="type-category">
      <h5 class="category-label">Settlements</h5>
      <div class="grid-chips gap-sm">
        {#each placeTypes.settlements as type}
          <SelectableChip
            label={type.label}
            selected={options.placeType === type.value}
            onclick={() => handleChange('placeType', type.value)}
          />
        {/each}
      </div>
    </div>

    <!-- Landmarks -->
    <div class="type-category">
      <h5 class="category-label">Landmarks</h5>
      <div class="grid-chips gap-sm">
        {#each placeTypes.landmarks as type}
          <SelectableChip
            label={type.label}
            selected={options.placeType === type.value}
            onclick={() => handleChange('placeType', type.value)}
          />
        {/each}
      </div>
    </div>

    <!-- Buildings -->
    <div class="type-category">
      <h5 class="category-label">Buildings</h5>
      <div class="grid-chips gap-sm">
        {#each placeTypes.buildings as type}
          <SelectableChip
            label={type.label}
            selected={options.placeType === type.value}
            onclick={() => handleChange('placeType', type.value)}
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- Geography -->
  <div class="form-section">
    <h4 class="form-label">Geography</h4>
    <div class="grid-chips gap-sm">
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

  <!-- Style (for taverns and shops only) -->
  {#if showStyleOption()}
    <div class="form-section">
      <h4 class="form-label">Naming Style</h4>
      <div class="grid-chips gap-sm">
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
    <div class="grid-chips gap-sm">
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

<style lang="scss">
  @import '../styles/name-generator';
</style>
