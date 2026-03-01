<script>
  import { treasureTypes } from '../../data/treasure.js';

  let { onGenerate } = $props();

  const treasureTypeList = Object.entries(treasureTypes).map(([key, data]) => ({
    key,
    name: data.name
  }));

  let options = $state({
    method: 'type', // 'type' | 'cr' | 'single-item' | 'by-value'
    treasureType: 'B',
    cr: 5,
    count: 1,
    source: '',
    itemType: 'gem', // 'gem' | 'art' | 'magic' | 'mundane'
    targetValue: 1000 // Target gold value
  });

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate(options);
  }
</script>

<form class="treasure-form" onsubmit={handleSubmit}>
  <!-- Generation Method -->
  <div class="form-section">
    <h3>Generation Method</h3>
    <div class="radio-group">
      <label>
        <input type="radio" bind:group={options.method} value="type" />
        Full Hoard (By Treasure Type)
      </label>
      <label>
        <input type="radio" bind:group={options.method} value="cr" />
        Full Hoard (By Challenge Rating)
      </label>
      <label>
        <input type="radio" bind:group={options.method} value="single-item" />
        Single Item Only
      </label>
      <label>
        <input type="radio" bind:group={options.method} value="by-value" />
        By Target Value
      </label>
    </div>
  </div>

  {#if options.method === 'single-item'}
    <!-- Single Item Type Selection -->
    <div class="form-section">
      <h3>Item Type</h3>
      <select bind:value={options.itemType}>
        <option value="gem">Random Gem</option>
        <option value="art">Random Art Object</option>
        <option value="magic">Random Magic Item</option>
        <option value="mundane">Random Mundane Item</option>
      </select>
      <p class="help-text">
        Generate a single random item
      </p>
    </div>

    <!-- Quantity for Single Items -->
    <div class="form-section">
      <h3>Quantity</h3>
      <input
        type="number"
        bind:value={options.count}
        min="1"
        max="20"
        class="count-input"
      />
      <p class="help-text">Generate 1-20 items at once</p>
    </div>

  {:else if options.method === 'by-value'}
    <!-- Target Value Input -->
    <div class="form-section">
      <h3>Target Value</h3>
      <div class="value-input-group">
        <input
          type="number"
          bind:value={options.targetValue}
          min="10"
          max="1000000"
          step="10"
          class="value-input"
        />
        <span class="value-label">gp</span>
      </div>
      <p class="help-text">
        Generate treasure worth approximately this amount
      </p>
    </div>

    <!-- Source Description -->
    <div class="form-section">
      <h3>Source (Optional)</h3>
      <input
        type="text"
        bind:value={options.source}
        placeholder="e.g., Quest reward, Chest contents"
        class="source-input"
      />
    </div>

  {:else if options.method === 'type'}
    <!-- Treasure Type Selection -->
    <div class="form-section">
      <h3>Treasure Type</h3>
      <select bind:value={options.treasureType}>
        {#each treasureTypeList as type}
          <option value={type.key}>{type.key} — {type.name}</option>
        {/each}
      </select>
      <p class="help-text">
        {treasureTypes[options.treasureType]?.name}
      </p>
    </div>
  {:else}
    <!-- Challenge Rating -->
    <div class="form-section">
      <h3>Challenge Rating</h3>
      <input
        type="number"
        bind:value={options.cr}
        min="1"
        max="30"
        class="cr-input"
      />
      <p class="help-text">
        Automatically selects appropriate treasure type based on CR
      </p>
    </div>
  {/if}

  <!-- Source Description -->
  <div class="form-section">
    <h3>Source (Optional)</h3>
    <input
      type="text"
      bind:value={options.source}
      placeholder="e.g., Dragon's hoard, Bandit camp, Ancient tomb"
      class="source-input"
    />
    <p class="help-text">
      Optional description of where this treasure came from
    </p>
  </div>

  <!-- Quantity -->
  <div class="form-section">
    <h3>Quantity</h3>
    <input
      type="number"
      bind:value={options.count}
      min="1"
      max="10"
      class="count-input"
    />
    <p class="help-text">Generate 1-10 hoards at once</p>
  </div>

  <!-- Generate Button -->
  <button type="submit" class="btn-primary">
    {#if options.method === 'single-item'}
      Generate {options.count > 1 ? `${options.count} Items` : 'Item'}
    {:else}
      Generate {options.count > 1 ? `${options.count} Hoards` : 'Hoard'}
    {/if}
  </button>
</form>

<style lang="scss">
  @import '../styles/shared';

  .treasure-form {
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

  select,
  input[type="text"],
  input[type="number"] {
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

  select {
    cursor: pointer;
  }

  .cr-input,
  .count-input {
    width: 6rem;
  }

  .value-input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .value-input {
      width: 10rem;
    }

    .value-label {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      font-weight: 600;
    }
  }

  .source-input {
    width: 100%;
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
