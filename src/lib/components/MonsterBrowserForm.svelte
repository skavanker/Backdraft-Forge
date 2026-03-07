<script>
  /**
   * MonsterBrowserForm - Search and filter controls for monster browsing
   * Provides text search and type-based filtering
   */
  import { getMonsterTypes } from '../../data/monsters.js';

  let {
    searchQuery = '',
    typeFilter = 'all',
    onSearch = () => {},
    onTypeFilter = () => {}
  } = $props();

  const monsterTypes = getMonsterTypes();

  function handleSearchInput(e) {
    onSearch(e.target.value);
  }

  function handleTypeChange(type) {
    onTypeFilter(type);
  }
</script>

<div class="monster-browser-form">
  <!-- Search Input -->
  <div class="form-section">
    <label for="monster-search">Search Monsters</label>
    <input
      id="monster-search"
      type="text"
      value={searchQuery}
      oninput={handleSearchInput}
      placeholder="Search by name or description..."
    />
  </div>

  <!-- Type Filter (Chips) -->
  <div class="form-section">
    <p class="form-label">Filter by Type</p>
    <div class="type-filter-chips">
      {#each monsterTypes as type}
        <button
          class="chip-button"
          class:selected={typeFilter === type.key}
          onclick={() => handleTypeChange(type.key)}
        >
          {type.name}
        </button>
      {/each}
    </div>
  </div>
</div>