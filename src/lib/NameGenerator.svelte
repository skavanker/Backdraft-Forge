<script>
  import { generateCharacterNames, initNameGen } from './generators/nameGenerator.js';
  import { onMount } from 'svelte';

  let chainsReady = $state(false);
  onMount(async () => {
    await initNameGen();
    chainsReady = true;
  });
  import { generatePlaceNames } from './generators/placeNameGenerator.js';
  import { nameMetaText } from './utils/formatUtils.js';
  import ConfirmButton from './components/ConfirmButton.svelte';
  import NameGeneratorForm from './components/NameGeneratorForm.svelte';
  import PlaceGeneratorForm from './components/PlaceGeneratorForm.svelte';
  import NameResults from './components/NameResults.svelte';
  import GeneratorPage from './components/GeneratorPage.svelte';

  // ─── Mode ─────────────────────────────────────────
  let mode = $state('character');

  // ─── Generation options ────────────────────────────
  let characterOptions = $state({
    race: 'random',
    gender: 'random',
    geography: 'random',
    style: 'random',
    quantity: 5
  });

  let placeOptions = $state({
    placeType: 'random-settlements',
    geography: 'random',
    style: 'random',
    quantity: 5
  });

  // ─── Results ───────────────────────────────────────
  let generatedNames = $state([]);

  // ─── Favorites ────────────────────────────────────
  const FAVORITES_KEY = 'backdraft-name-favorites';

  function loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    } catch {
      return [];
    }
  }

  let favorites = $state(loadFavorites());

  function persistFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  // ─── Copy-all feedback ─────────────────────────────
  let copyAllDone = $state(false);
  let copyFavsDone = $state(false);

  // ─── Handlers ─────────────────────────────────────

  function generateNames() {
    if (mode === 'character') {
      generatedNames = generateCharacterNames(characterOptions, characterOptions.quantity);
    } else {
      generatedNames = generatePlaceNames(placeOptions, placeOptions.quantity);
    }
  }

  function handleRegenerate(index) {
    let replacement;
    if (mode === 'character') {
      replacement = generateCharacterNames(characterOptions, 1)[0];
    } else {
      replacement = generatePlaceNames(placeOptions, 1)[0];
    }
    if (replacement) {
      generatedNames = generatedNames.map((n, i) => i === index ? replacement : n);
    }
  }

  async function handleCopyAll() {
    try {
      const text = generatedNames.map(n => n.name).join('\n');
      await navigator.clipboard.writeText(text);
      copyAllDone = true;
      setTimeout(() => copyAllDone = false, 1200);
    } catch {
      // clipboard unavailable (HTTP, permissions, private browsing) — fail silently
    }
  }

  function handleFavorite(nameObj) {
    const exists = favorites.some(f => f.name === nameObj.name);
    if (exists) {
      favorites = favorites.filter(f => f.name !== nameObj.name);
    } else {
      favorites = [...favorites, nameObj];
    }
    persistFavorites();
  }

  function removeFavorite(name) {
    favorites = favorites.filter(f => f.name !== name);
    persistFavorites();
  }

  async function handleCopyFavorites() {
    try {
      const text = favorites.map(f => f.name).join('\n');
      await navigator.clipboard.writeText(text);
      copyFavsDone = true;
      setTimeout(() => copyFavsDone = false, 1200);
    } catch {
      // clipboard unavailable (HTTP, permissions, private browsing) — fail silently
    }
  }

  function handleClearFavorites() {
    favorites = [];
    persistFavorites();
  }

  function handleCharacterOptionsChange(newOptions) {
    characterOptions = { ...characterOptions, ...newOptions };
  }

  function handlePlaceOptionsChange(newOptions) {
    placeOptions = { ...placeOptions, ...newOptions };
  }

  function handleModeChange(newMode) {
    mode = newMode;
    generatedNames = [];
  }

  function handleClearGenerated() {
    generatedNames = [];
  }

</script>

<GeneratorPage>

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
    <div class="panel">
      <h3>Character Names</h3>
      <p>
        Names are generated using <strong>Markov chains</strong> trained on race-appropriate name lists.
        Each race has a distinct phonetic identity.
      </p>
      <ul>
        <li><strong>Race</strong> determines the sound and feel of the first name (elves sound elvish, dwarves sound Norse)</li>
        <li><strong>Location</strong> shapes human and half-elf surnames (coastal, mountain, forest, plains, swamp, desert)</li>
        <li><strong>Naming Style</strong>: Standard surname, Patronymic (son/daughter of), or Clan/House lineage name</li>
      </ul>
    </div>
    <NameGeneratorForm options={characterOptions} onchange={handleCharacterOptionsChange} />
  {/if}

  <!-- Place Mode -->
  {#if mode === 'place'}
    <div class="panel">
      <h3>Place Names</h3>
      <p>
        Generate names for settlements, landmarks, taverns, shops, and other locations.
        Place names are themed by geography and type.
      </p>
      <ul>
        <li><strong>Settlements</strong>: Cities, towns, villages — Markov-generated, geography-flavoured</li>
        <li><strong>Landmarks</strong>: Natural features (Iron Mountain, Shadow Forest, Bay Lake)</li>
        <li><strong>Taverns</strong>: Pattern-based (The Prancing Pony) or owner-based (The Ironforge Inn)</li>
        <li><strong>Shops</strong>: Descriptive (The Golden Scale) or owner-based (Thorin's Emporium)</li>
        <li><strong>Dungeons</strong>: Atmospheric ruins and dungeons (The Forgotten Halls, Sunless Depths)</li>
        <li><strong>Buildings</strong>: Towers, castles, temples, libraries</li>
      </ul>
    </div>
    <PlaceGeneratorForm options={placeOptions} onchange={handlePlaceOptionsChange} />
  {/if}

  <!-- Generate Button -->
  <button class="btn-primary" onclick={generateNames} disabled={!chainsReady}>
    {chainsReady ? 'Generate Names' : 'Loading…'}
  </button>

  <!-- Generated Names -->
  {#if generatedNames.length > 0}
    <div class="section-header">
      <h3>Generated Names</h3>
      <div class="action-bar end gap-sm">
        <button class="btn-secondary btn-sm" onclick={handleCopyAll}>
          {copyAllDone ? '✓ Copied' : 'Copy All'}
        </button>
        <ConfirmButton onconfirm={handleClearGenerated} />
      </div>
    </div>
    <NameResults
      names={generatedNames}
      {favorites}
      onregenerate={handleRegenerate}
      onfavorite={handleFavorite}
    />
  {/if}

  <!-- Empty State -->
  {#if generatedNames.length === 0}
    <div class="panel-dashed">
      <p>No names generated yet. Click "Generate Names" to begin!</p>
    </div>
  {/if}

  <!-- Favorites -->
  {#if favorites.length > 0}
    <div class="section-header">
      <h3>Favorites ★</h3>
      <div class="action-bar end gap-sm">
        <button class="btn-secondary btn-sm" onclick={handleCopyFavorites}>
          {copyFavsDone ? '✓ Copied' : 'Copy All'}
        </button>
        <ConfirmButton onconfirm={handleClearFavorites} />
      </div>
    </div>
    <div class="favorites-list">
      {#each favorites as fav}
        <div class="name-item">
          <div class="name-main">
            <span class="name-text">{fav.name}</span>
            <span class="name-meta">{nameMetaText(fav.meta)}</span>
          </div>
          <div class="name-actions">
            <button
              class="name-action-btn is-starred"
              onclick={() => removeFavorite(fav.name)}
              title="Remove from favorites"
            >★</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</GeneratorPage>
