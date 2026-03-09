<script>
  /**
   * MonsterBestiary - Main page for browsing and managing monsters
   * Allows users to search, filter, and save favorite monsters
   */
  import { onMount } from 'svelte';
  import MonsterBrowserForm from './components/MonsterBrowserForm.svelte';
  import MonsterStatBlock from './components/MonsterStatBlock.svelte';
  import ItemList from './components/ItemList.svelte';
  import GeneratorPage from './components/GeneratorPage.svelte';
  import { monsters } from '../data/monsters.js';
  import { loadMonsters, saveMonster, deleteMonster } from './monsterPersistence.svelte.js';
  import { useToast } from './utils/stateUtils.svelte.js';

  const toast = useToast();
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
    toast.flash(`${monster.name} saved to favorites!`);
  }

  function handleDelete(key) {
    savedMonsters = deleteMonster(key, savedMonsters);
  }

  function handleSearch(query) {
    searchQuery = query;
  }

  function handleTypeFilter(type) {
    typeFilter = type;
  }
</script>

<GeneratorPage {toast}>

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
    <ItemList
      items={filteredMonsters}
      title="All Monsters"
      countLabel="monster"
      emptyText="No monsters match your search."
      keyFn={(m) => m.key}
    >
      {#snippet renderItem(monster)}
        <MonsterStatBlock {monster} onSave={handleSave} />
      {/snippet}
    </ItemList>
  </div>

  <!-- Saved Favorites -->
  {#if savedMonsters.length > 0}
    <div class="generator-section">
      <ItemList
        items={savedMonsters}
        title="Saved Favorites"
        countLabel="monster"
        keyFn={(m) => m.key}
      >
        {#snippet renderItem(monster)}
          <MonsterStatBlock {monster} onDelete={() => handleDelete(monster.key)} saved={true} />
        {/snippet}
      </ItemList>
    </div>
  {/if}
</GeneratorPage>