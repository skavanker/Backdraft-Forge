<script>
  /**
   * MonsterBestiary - Main page for browsing and managing monsters
   * Allows users to search, filter, and save favorite monsters
   */
  import { onMount } from 'svelte';
  import MonsterBrowserForm from './components/MonsterBrowserForm.svelte';
  import MonsterList from './components/MonsterList.svelte';
  import { monsters } from '../data/monsters.js';
  import { loadMonsters, saveMonster, deleteMonster } from './monsterPersistence.svelte.js';

  let allMonsters = $state([...monsters]);
  let filteredMonsters = $state([...monsters]);
  let savedMonsters = $state([]);
  let searchQuery = $state('');
  let typeFilter = $state('all');

  // Derived: filter monsters based on search + type
  $effect(() => {
    let result = allMonsters;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(m => m.type === typeFilter);
    }

    // Search filter (name or description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
      );
    }

    filteredMonsters = result;
  });

  onMount(() => {
    savedMonsters = loadMonsters();
  });

  function handleSave(monster) {
    savedMonsters = saveMonster(monster, savedMonsters);
    alert(`${monster.name} saved to favorites!`);
  }

  function handleDelete(key) {
    if (confirm('Remove from favorites?')) {
      savedMonsters = deleteMonster(key, savedMonsters);
    }
  }

  function handleSearch(query) {
    searchQuery = query;
  }

  function handleTypeFilter(type) {
    typeFilter = type;
  }
</script>

<div class="monster-bestiary">
  <header class="generator-header">
    <h2>Monster Bestiary</h2>
    <p class="subtitle">Browse and search AD&D 2E monsters</p>
  </header>

  <!-- Search/Filter Form -->
  <div class="generator-section">
    <MonsterBrowserForm
      {searchQuery}
      {typeFilter}
      onSearch={handleSearch}
      onTypeFilter={handleTypeFilter}
    />
  </div>

  <!-- Browse Results -->
  <div class="generator-section">
    <h3>All Monsters ({filteredMonsters.length})</h3>
    <MonsterList
      monsters={filteredMonsters}
      onSave={handleSave}
      showSaveButton={true}
    />
  </div>

  <!-- Saved Favorites -->
  {#if savedMonsters.length > 0}
    <div class="generator-section">
      <h3>Saved Favorites ({savedMonsters.length})</h3>
      <MonsterList
        monsters={savedMonsters}
        onDelete={handleDelete}
        saved={true}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  @import './styles/shared';
  @import './styles/monster-bestiary';
</style>
