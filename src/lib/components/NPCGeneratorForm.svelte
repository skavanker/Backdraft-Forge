<script>
  import { getAllArchetypes } from '../generators/npcArchetypes.js';
  import { races } from '../../data/races.js';
  import { classes } from '../../data/classes.js';
  import SelectableChip from './SelectableChip.svelte';

  let { onGenerate } = $props();

  const archetypes = getAllArchetypes();
  const raceList = Object.entries(races).map(([key, race]) => ({ key, name: race.name }));
  const classList = Object.entries(classes).map(([key, cls]) => ({ key, name: cls.name }));

  let options = $state({
    method: '4d6',
    mode: 'quick',
    levelMin: 1,
    levelMax: 1,
    raceKey: null,
    classKey: null,
    archetypeKey: null,
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
</script>

<form class="npc-form" onsubmit={handleSubmit}>
  <!-- Mode Selection -->
  <div class="form-section">
    <h4 class="form-label">Generation Mode</h4>
    <div class="button-row">
      <button
        type="button"
        class="btn-primary"
        class:selected={options.mode === 'quick'}
        onclick={() => options.mode = 'quick'}
      >Quick</button>
      <button
        type="button"
        class="btn-primary"
        class:selected={options.mode === 'detailed'}
        onclick={() => options.mode = 'detailed'}
      >Detailed</button>
    </div>
  </div>

  <!-- Ability Score Method -->
  <div class="form-section">
    <h4 class="form-label" id="npc-ability-method">Ability Score Method</h4>
    <div class="grid-compact gap-sm" role="group" aria-labelledby="npc-ability-method">
      <SelectableChip
        label="4d6 Drop Lowest"
        selected={options.method === '4d6'}
        onclick={() => options.method = '4d6'}
      />
      <SelectableChip
        label="3d6"
        selected={options.method === '3d6'}
        onclick={() => options.method = '3d6'}
      />
      <SelectableChip
        label="Average (10-11)"
        selected={options.method === 'average'}
        onclick={() => options.method = 'average'}
      />
    </div>
  </div>

  <!-- Archetype Selection -->
  <div class="form-section">
    <h4 class="form-label" id="npc-archetype">Archetype</h4>
    <div class="grid-compact gap-sm" role="group" aria-labelledby="npc-archetype">
      <SelectableChip
        label="None"
        metadata="Custom settings"
        selected={options.archetypeKey === null}
        onclick={() => selectArchetype(null)}
      />
      {#each archetypes as archetype}
        <SelectableChip
          label={archetype.name}
          metadata={archetype.description}
          selected={options.archetypeKey === archetype.key}
          onclick={() => selectArchetype(archetype.key)}
        />
      {/each}
    </div>
    {#if options.archetypeKey}
      <p class="section-hint">Archetype will override level range and class selection</p>
    {/if}
  </div>

  {#if !options.archetypeKey}
    <!-- Level Range -->
    <div class="form-section">
      <h4 class="form-label">Level Range</h4>
      <div class="level-inputs">
        <label class="input-label">
          Min:
          <input type="number" bind:value={options.levelMin} min="1" max="20" />
        </label>
        <label class="input-label">
          Max:
          <input type="number" bind:value={options.levelMax} min="1" max="20" />
        </label>
      </div>
    </div>

    <!-- Race Constraint -->
    <div class="form-section">
      <h4 class="form-label" id="npc-race">Race</h4>
      <div class="grid-compact gap-sm" role="group" aria-labelledby="npc-race">
        <SelectableChip
          label="Random"
          selected={options.raceKey === null}
          onclick={() => options.raceKey = null}
        />
        {#each raceList as race}
          <SelectableChip
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
        <SelectableChip
          label="Random"
          selected={options.classKey === null}
          onclick={() => options.classKey = null}
        />
        {#each classList as cls}
          <SelectableChip
            label={cls.name}
            selected={options.classKey === cls.key}
            onclick={() => options.classKey = cls.key}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Bulk Count -->
  <div class="form-section">
    <h4 class="form-label">Quantity</h4>
    <input
      type="number"
      bind:value={options.count}
      min="1"
      max="20"
    />
    <p class="section-hint">Generate 1-20 NPCs at once</p>
  </div>

  <!-- Generate Button -->
  <button type="submit" class="btn-primary">
    Generate {options.count > 1 ? `${options.count} NPCs` : 'NPC'}
  </button>
</form>