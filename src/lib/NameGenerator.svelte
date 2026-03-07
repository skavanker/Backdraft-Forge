<script>
  import { generateCharacterNames } from './generators/nameGenerator.js';
  import { generatePlaceNames } from './generators/placeNameGenerator.js';
  import { names } from '../data/names.js';
  import { getAvailableNamingStyles } from '../data/races.js';
  import NameGeneratorForm from './components/NameGeneratorForm.svelte';
  import PlaceGeneratorForm from './components/PlaceGeneratorForm.svelte';
  import NameResults from './components/NameResults.svelte';

  // Mode: 'character' or 'place'
  let mode = $state('character');

  // Character generation options
  let characterOptions = $state({
    race: 'random',
    gender: 'random',
    class: 'random',
    settlement: 'random',
    geography: 'random',
    socialClass: 'random',
    style: 'random',
    quantity: 5
  });

  // Place generation options
  let placeOptions = $state({
    placeType: 'random-settlements',
    geography: 'random',
    style: 'random',
    quantity: 5
  });

  let generatedNames = $state([]);

  /**
   * Generate names based on current mode
   */
  function generateNames() {
    if (mode === 'character') {
      generatedNames = generateCharacterNames(names, characterOptions, characterOptions.quantity);
    } else {
      generatedNames = generatePlaceNames(names, placeOptions, placeOptions.quantity);
    }
  }

  /**
   * Update character options from form
   */
  function handleCharacterOptionsChange(newOptions) {
    const updated = { ...characterOptions, ...newOptions };

    // Auto-reset style if it becomes unavailable for the new race
    // Skip this check if race is 'random' (style should remain flexible)
    if (newOptions.race && newOptions.race !== 'random' && updated.style !== 'random') {
      const availableStyles = getAvailableNamingStyles(newOptions.race);
      if (!availableStyles.includes(updated.style)) {
        updated.style = 'standard';
      }
    }

    characterOptions = updated;
  }

  /**
   * Update place options from form
   */
  function handlePlaceOptionsChange(newOptions) {
    placeOptions = { ...placeOptions, ...newOptions };
  }

  /**
   * Switch mode and clear generated names
   */
  function handleModeChange(newMode) {
    mode = newMode;
    generatedNames = [];
  }

  /**
   * Clear generated names
   */
  function handleClearGenerated() {
    if (confirm('Clear all generated names?')) {
      generatedNames = [];
    }
  }
</script>

<div class="flex-column gap-lg">
  <header class="generator-header">
    <h2>Name Generator</h2>
    <p class="subtitle">
      Generate contextually appropriate names for AD&D 2E characters, NPCs, and places
    </p>
  </header>

  <!-- Mode Selector -->
  <div class="mode-selector">
    <h4 class="form-label">What to Generate</h4>
    <div class="button-row">
      <button
        class="btn-primary"
        class:selected={mode === 'character'}
        onclick={() => handleModeChange('character')}
      >
        Character/NPC
      </button>
      <button
        class="btn-primary"
        class:selected={mode === 'place'}
        onclick={() => handleModeChange('place')}
      >
        Place
      </button>
    </div>
  </div>

  <!-- Character Mode -->
  {#if mode === 'character'}
    <!-- How It Works -->
    <div class="panel">
      <h3>Character Names</h3>
      <p>
        This generator creates names using <strong>weighted syllable selection</strong> based on your choices.
        Names are assembled from syllables that match your character's background.
      </p>
      <ul>
        <li><strong>Class</strong> influences name style (warrior names sound bold, scholar names sound refined)</li>
        <li><strong>Settlement Type</strong> affects cultural origin (city names are cosmopolitan, village names are rustic)</li>
        <li><strong>Geography</strong> shapes surnames (coastal, mountain, forest, plains, swamp, desert themes)</li>
        <li><strong>Social Class</strong> affects sophistication (nobles get refined names, poor characters may get single-word surnames like "Stone")</li>
        <li><strong>Naming Style</strong>: Standard, Patronymic (son/daughter of), Clan (dwarves), House (elves/humans)</li>
      </ul>
    </div>

    <!-- Generation Form -->
    <NameGeneratorForm options={characterOptions} onchange={handleCharacterOptionsChange} />
  {/if}

  <!-- Place Mode -->
  {#if mode === 'place'}
    <!-- How It Works -->
    <div class="panel">
      <h3>Place Names</h3>
      <p>
        Generate names for settlements, landmarks, taverns, shops, and other locations.
        Place names are themed by geography and type.
      </p>
      <ul>
        <li><strong>Settlements</strong>: Cities, towns, villages (Stormhaven, Ironforge, Greenwood)</li>
        <li><strong>Landmarks</strong>: Natural features (Iron Mountain, Shadow Forest, Bay Lake)</li>
        <li><strong>Taverns</strong>: Pattern-based (The Prancing Pony) or owner-based (The Ironforge Inn)</li>
        <li><strong>Shops</strong>: Descriptive (The Golden Scale) or owner-based (Thorin's Emporium)</li>
        <li><strong>Dungeons</strong>: Atmospheric ruins and dungeons (The Forgotten Halls, Sunless Depths)</li>
        <li><strong>Buildings</strong>: Towers, castles, temples, libraries</li>
      </ul>
    </div>

    <!-- Generation Form -->
    <PlaceGeneratorForm options={placeOptions} onchange={handlePlaceOptionsChange} />
  {/if}

  <!-- Generate Button -->
  <button class="btn-primary" onclick={generateNames}>
    Generate Names
  </button>

  <!-- Generated Names -->
  {#if generatedNames.length > 0}
    <div class="section-header">
      <h3>Generated Names</h3>
      <button class="btn-danger btn-sm" onclick={handleClearGenerated}>
        Clear All
      </button>
    </div>
    <NameResults names={generatedNames} />
  {/if}

  <!-- Empty State -->
  {#if generatedNames.length === 0}
    <div class="panel-dashed">
      <p>No names generated yet. Click "Generate Names" to begin!</p>
    </div>
  {/if}
</div>

