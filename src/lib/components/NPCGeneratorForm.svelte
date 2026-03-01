<script>
  import { getAllArchetypes } from '../generators/npcArchetypes.js';
  import { races } from '../../data/races.js';
  import { classes } from '../../data/classes.js';

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

  function handleArchetypeChange(e) {
    options.archetypeKey = e.target.value || null;

    // Clear race/class when archetype is selected
    if (options.archetypeKey) {
      options.raceKey = null;
      options.classKey = null;
    }
  }
</script>

<form class="npc-form" onsubmit={handleSubmit}>
  <!-- Mode Selection -->
  <div class="form-section">
    <h3>Generation Mode</h3>
    <div class="radio-group">
      <label>
        <input type="radio" bind:group={options.mode} value="quick" />
        Quick (Auto-select proficiencies)
      </label>
      <label>
        <input type="radio" bind:group={options.mode} value="detailed" />
        Detailed (Full proficiencies)
      </label>
    </div>
  </div>

  <!-- Ability Score Method -->
  <div class="form-section">
    <h3>Ability Score Method</h3>
    <div class="radio-group">
      <label>
        <input type="radio" bind:group={options.method} value="4d6" />
        4d6 Drop Lowest
      </label>
      <label>
        <input type="radio" bind:group={options.method} value="3d6" />
        3d6
      </label>
      <label>
        <input type="radio" bind:group={options.method} value="average" />
        Average (10-11)
      </label>
    </div>
  </div>

  <!-- Archetype Selection -->
  <div class="form-section">
    <h3>Archetype (Optional)</h3>
    <select bind:value={options.archetypeKey} onchange={handleArchetypeChange}>
      <option value={null}>Random/Custom</option>
      {#each archetypes as archetype}
        <option value={archetype.key}>{archetype.name} - {archetype.description}</option>
      {/each}
    </select>
    {#if options.archetypeKey}
      <p class="help-text">Archetype will override level range and class selection</p>
    {/if}
  </div>

  {#if !options.archetypeKey}
    <!-- Level Range -->
    <div class="form-section">
      <h3>Level Range</h3>
      <div class="level-inputs">
        <label>
          Min:
          <input type="number" bind:value={options.levelMin} min="1" max="20" />
        </label>
        <label>
          Max:
          <input type="number" bind:value={options.levelMax} min="1" max="20" />
        </label>
      </div>
    </div>

    <!-- Race Constraint -->
    <div class="form-section">
      <h3>Race (Optional)</h3>
      <select bind:value={options.raceKey}>
        <option value={null}>Random</option>
        {#each raceList as race}
          <option value={race.key}>{race.name}</option>
        {/each}
      </select>
    </div>

    <!-- Class Constraint -->
    <div class="form-section">
      <h3>Class (Optional)</h3>
      <select bind:value={options.classKey}>
        <option value={null}>Random</option>
        {#each classList as cls}
          <option value={cls.key}>{cls.name}</option>
        {/each}
      </select>
    </div>
  {/if}

  <!-- Bulk Count -->
  <div class="form-section">
    <h3>Quantity</h3>
    <input
      type="number"
      bind:value={options.count}
      min="1"
      max="20"
      class="count-input"
    />
    <p class="help-text">Generate 1-20 NPCs at once</p>
  </div>

  <!-- Generate Button -->
  <button type="submit" class="btn-primary">
    Generate {options.count > 1 ? `${options.count} NPCs` : 'NPC'}
  </button>
</form>

<style lang="scss">
  @import '../styles/shared';

  .npc-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: var(--color-text-primary);
    }
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;

      input[type="radio"] {
        cursor: pointer;
      }
    }
  }

  select {
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-size: 0.875rem;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  .level-inputs {
    display: flex;
    gap: 1rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;

      input {
        width: 4rem;
        padding: 0.5rem;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        background: var(--color-bg-primary);
        color: var(--color-text-primary);
        font-size: 0.875rem;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }
    }
  }

  .count-input {
    width: 6rem;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }

  .help-text {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--color-primary-dark);
    }

    &:active {
      transform: translateY(1px);
    }
  }
</style>
