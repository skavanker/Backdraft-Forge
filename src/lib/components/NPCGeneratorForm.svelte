<script>
  import { getAllArchetypes } from '../generators/npcArchetypes.js';
  import { races } from '../../data/races.js';
  import { classes } from '../../data/classes.js';
  import BtnSelect from './BtnSelect.svelte';

  let { onGenerate } = $props();

  const archetypes = getAllArchetypes();
  const raceList = Object.entries(races).map(([key, race]) => ({ key, name: race.name }));
  const classList = Object.entries(classes).map(([key, cls]) => ({ key, name: cls.name }));

  const archetypeGroups = [
    { label: 'Combat',  keys: ['townGuard', 'merchantGuard', 'sellsword', 'thug', 'bandit', 'scout'] },
    { label: 'Social',  keys: ['noble', 'innkeeper'] },
    { label: 'Arcane',  keys: ['apprentice', 'sage'] },
    { label: 'Divine',  keys: ['acolyte', 'cultist'] },
  ];
  const archetypeMap = Object.fromEntries(archetypes.map(a => [a.key, a]));

  const QUICK_COUNTS = [1, 3, 5, 10];

  let options = $state({
    method: '4d6',
    levelMin: 1,
    levelMax: 1,
    raceKey: null,
    classKey: null,
    archetypeKey: null,
    sex: null,
    count: 1
  });

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate(options);
  }

  function selectArchetype(key) {
    options.archetypeKey = key;
    if (key) {
      options.raceKey = null;
      options.classKey = null;
    }
  }

  function clampLevelMin() {
    if (options.levelMin > options.levelMax) options.levelMax = options.levelMin;
  }

  function clampLevelMax() {
    if (options.levelMax < options.levelMin) options.levelMin = options.levelMax;
  }
</script>

<form class="npc-form" onsubmit={handleSubmit}>

  <!-- Archetype Selection -->
  <div class="form-section">
    <h4 class="form-label">Archetype</h4>
    <div class="archetype-groups">
      <div class="grid-compact gap-sm archetype-custom-row">
        <BtnSelect
          label="Custom"
          metadata="Set your own options below"
          selected={options.archetypeKey === null}
          onclick={() => selectArchetype(null)}
        />
      </div>
      {#each archetypeGroups as group}
        <div class="archetype-group">
          <span class="archetype-group-label">{group.label}</span>
          <div class="grid-compact gap-sm">
            {#each group.keys as key}
              {#if archetypeMap[key]}
                <BtnSelect
                  label={archetypeMap[key].name}
                  metadata={archetypeMap[key].description}
                  selected={options.archetypeKey === key}
                  onclick={() => selectArchetype(key)}
                />
              {/if}
            {/each}
          </div>
        </div>
      {/each}
    </div>
    {#if options.archetypeKey}
      <p class="section-hint">Archetype sets level range and class — override race or ability method below if needed.</p>
    {/if}
  </div>

  {#if !options.archetypeKey}
    <!-- Level Range -->
    <div class="form-section">
      <h4 class="form-label">Level Range</h4>
      <div class="level-inputs">
        <label class="input-label">
          Min
          <input type="number" bind:value={options.levelMin} min="1" max="20" oninput={clampLevelMin} />
        </label>
        <span class="level-separator">to</span>
        <label class="input-label">
          Max
          <input type="number" bind:value={options.levelMax} min="1" max="20" oninput={clampLevelMax} />
        </label>
      </div>
    </div>

    <!-- Race Constraint -->
    <div class="form-section">
      <h4 class="form-label" id="npc-race">Race</h4>
      <div class="grid-compact gap-sm" role="group" aria-labelledby="npc-race">
        <BtnSelect
          label="Random"
          selected={options.raceKey === null}
          onclick={() => options.raceKey = null}
        />
        {#each raceList as race}
          <BtnSelect
            label={race.name}
            selected={options.raceKey === race.key}
            onclick={() => options.raceKey = race.key}
          />
        {/each}
      </div>
    </div>

    <!-- Class Constraint -->
    <div class="form-section">
      <h4 class="form-label" id="npc-class">Class</h4>
      <div class="grid-compact gap-sm" role="group" aria-labelledby="npc-class">
        <BtnSelect
          label="Random"
          selected={options.classKey === null}
          onclick={() => options.classKey = null}
        />
        {#each classList as cls}
          <BtnSelect
            label={cls.name}
            selected={options.classKey === cls.key}
            onclick={() => options.classKey = cls.key}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Sex -->
  <div class="form-section">
    <h4 class="form-label">Sex</h4>
    <div class="button-row">
      <BtnSelect label="Random" selected={options.sex === null} onclick={() => options.sex = null} />
      <BtnSelect label="Male"   selected={options.sex === 'Male'}   onclick={() => options.sex = 'Male'} />
      <BtnSelect label="Female" selected={options.sex === 'Female'} onclick={() => options.sex = 'Female'} />
    </div>
  </div>

  <!-- Ability Score Method -->
  <div class="form-section">
    <h4 class="form-label">Ability Scores</h4>
    <div class="button-row">
      <BtnSelect label="4d6 Drop Lowest" selected={options.method === '4d6'}     onclick={() => options.method = '4d6'} />
      <BtnSelect label="3d6"             selected={options.method === '3d6'}     onclick={() => options.method = '3d6'} />
      <BtnSelect label="Average"         selected={options.method === 'average'} onclick={() => options.method = 'average'} />
    </div>
  </div>

  <!-- Quantity -->
  <div class="form-section">
    <h4 class="form-label">Quantity</h4>
    <div class="count-options">
      {#each QUICK_COUNTS as n}
        <button
          type="button"
          class="btn-secondary btn-sm"
          class:selected={options.count === n}
          onclick={() => options.count = n}
        >{n}</button>
      {/each}
      <input
        class="count-input"
        type="number"
        bind:value={options.count}
        min="1"
        max="20"
        aria-label="Custom count"
      />
    </div>
  </div>

  <!-- Generate Button -->
  <button type="submit" class="btn-primary btn-lg">
    Generate {options.count > 1 ? `${options.count} NPCs` : 'NPC'}
  </button>
</form>
