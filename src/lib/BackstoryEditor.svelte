<script>
  import { onMount } from 'svelte';
  import { getRandomName } from '../data/names.js';
  import Tooltip from './Tooltip.svelte';

  let { character, onComplete } = $props();

  let name = $state(character.name || '');
  let sex = $state(character.sex || 'Male');
  let alignment = $state(character.alignment || 'True Neutral');
  let backstory = $state(character.backstory || '');
  let age = $state(character.age || '');
  let height = $state(character.height || '');
  let weight = $state(character.weight || '');
  let eyes = $state(character.eyes || '');
  let hair = $state(character.hair || '');
  let deity = $state(character.deity || '');

  // Tooltip hints showing typical ranges for the selected race
  let raceHints = $derived(() => {
    const r = raceDetails[character.raceKey] || raceDetails.human;
    const raceName = character.race?.name || 'Human';
    const isElven = character.raceKey === 'elf' || character.raceKey === 'halfElf';
    return {
      age: `${raceName}: typically ${r.age[0]}–${r.age[1]} years`,
      height: `${raceName}: M ${formatHeight(r.heightM[0])}–${formatHeight(r.heightM[1])}, F ${formatHeight(r.heightF[0])}–${formatHeight(r.heightF[1])}`,
      weight: `${raceName}: M ${r.weightM[0]}–${r.weightM[1]} lbs, F ${r.weightF[0]}–${r.weightF[1]} lbs`,
      eyes: `Common: ${(isElven ? elfEyeColors : eyeColors).join(', ')}`,
      hair: `Common: ${(isElven ? elfHairColors : hairColors).join(', ')}`,
    };
  });

  const alignments = [
    'Lawful Good', 'Neutral Good', 'Chaotic Good',
    'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
  ];

  // 2E PHB-inspired random ranges by race
  const raceDetails = {
    human:    { age: [16, 25], heightM: [60, 78], heightF: [58, 74], weightM: [140, 220], weightF: [100, 170] },
    dwarf:    { age: [40, 100], heightM: [43, 51], heightF: [41, 49], weightM: [130, 170], weightF: [105, 145] },
    elf:      { age: [100, 175], heightM: [55, 65], heightF: [50, 61], weightM: [90, 120], weightF: [70, 100] },
    gnome:    { age: [60, 120], heightM: [38, 44], heightF: [36, 42], weightM: [72, 88], weightF: [68, 82] },
    halfElf:  { age: [22, 65], heightM: [60, 72], heightF: [58, 68], weightM: [110, 175], weightF: [85, 140] },
    halfling: { age: [22, 55], heightM: [32, 38], heightF: [30, 36], weightM: [52, 60], weightF: [48, 56] },
  };

  const eyeColors = ['Brown', 'Hazel', 'Green', 'Blue', 'Grey', 'Amber', 'Black'];
  const hairColors = ['Black', 'Dark Brown', 'Brown', 'Auburn', 'Red', 'Blonde', 'Sandy', 'Grey', 'White'];
  const elfEyeColors = ['Green', 'Blue', 'Violet', 'Gold', 'Silver', 'Amber'];
  const elfHairColors = ['Silver', 'Gold', 'Blonde', 'Black', 'Copper', 'White'];

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatHeight(inches) {
    const ft = Math.floor(inches / 12);
    const ins = inches % 12;
    return `${ft}'${ins}"`;
  }

  function randomizeDetails() {
    const r = raceDetails[character.raceKey] || raceDetails.human;
    const isFemale = sex === 'Female';
    age = String(rand(r.age[0], r.age[1]));
    const h = rand(isFemale ? r.heightF[0] : r.heightM[0], isFemale ? r.heightF[1] : r.heightM[1]);
    height = formatHeight(h);
    weight = String(rand(isFemale ? r.weightF[0] : r.weightF[1], isFemale ? r.weightF[1] : r.weightM[1])) + ' lbs';
    const isElven = character.raceKey === 'elf' || character.raceKey === 'halfElf';
    eyes = pick(isElven ? elfEyeColors : eyeColors);
    hair = pick(isElven ? elfHairColors : hairColors);
  }

  function confirm() {
    onComplete({
      name: name.trim() || 'Unnamed Hero',
      sex,
      alignment,
      backstory: backstory.trim(),
      age: age.trim(),
      height: height.trim(),
      weight: weight.trim(),
      eyes: eyes.trim(),
      hair: hair.trim(),
      deity: deity.trim(),
    });
  }

  function randomizeName() {
    name = getRandomName(character.raceKey, sex);
  }

  function generatePlaceholder() {
    const race = character.race?.name || 'mysterious';
    const cls = character.wizardSchool?.name || character.cls?.name || 'adventurer';
    return `Write your character's backstory here...\n\nWho is this ${race} ${cls}? Where did they come from? What drives them to adventure?`;
  }

  let charCount = $derived(backstory.length);
</script>

<div class="backstory-editor">
  <div class="name-section">
    <label for="char-name">Character Name</label>
    <div class="name-row">
      <input
        id="char-name"
        type="text"
        bind:value={name}
        placeholder="Enter your character's name"
        maxlength="50"
      />
      <button class="btn-random" onclick={randomizeName} title="Generate random name">
        Random Name
      </button>
    </div>
  </div>

  <div class="sex-section">
    <label>Sex</label>
    <div class="sex-buttons">
      <button
        class="sex-btn"
        class:selected={sex === 'Male'}
        onclick={() => sex = 'Male'}
      >
        Male
      </button>
      <button
        class="sex-btn"
        class:selected={sex === 'Female'}
        onclick={() => sex = 'Female'}
      >
        Female
      </button>
    </div>
  </div>

  <div class="alignment-section">
    <label>Alignment</label>
    <div class="alignment-grid">
      {#each alignments as align}
        <button
          class="alignment-btn"
          class:selected={alignment === align}
          onclick={() => alignment = align}
        >
          {align}
        </button>
      {/each}
    </div>
  </div>

  <!-- Physical Details -->
  <div class="details-section">
    <div class="details-header">
      <label>Physical Details</label>
      <button class="btn-random small" onclick={randomizeDetails} title="Randomize all details">
        Randomize
      </button>
    </div>
    <div class="details-grid">
      <Tooltip text={raceHints().age} position="bottom">
        <div class="detail-field">
          <label for="char-age">Age ⓘ</label>
          <input id="char-age" type="text" bind:value={age} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().height} position="bottom">
        <div class="detail-field">
          <label for="char-height">Height ⓘ</label>
          <input id="char-height" type="text" bind:value={height} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().weight} position="bottom">
        <div class="detail-field">
          <label for="char-weight">Weight ⓘ</label>
          <input id="char-weight" type="text" bind:value={weight} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().eyes} position="bottom">
        <div class="detail-field">
          <label for="char-eyes">Eyes ⓘ</label>
          <input id="char-eyes" type="text" bind:value={eyes} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().hair} position="bottom">
        <div class="detail-field">
          <label for="char-hair">Hair ⓘ</label>
          <input id="char-hair" type="text" bind:value={hair} placeholder="—" />
        </div>
      </Tooltip>
      <div class="detail-field">
        <label for="char-deity">Deity</label>
        <input id="char-deity" type="text" bind:value={deity} placeholder="—" />
      </div>
    </div>
  </div>

  <div class="backstory-section">
    <label for="backstory">Backstory</label>
    <textarea
      id="backstory"
      bind:value={backstory}
      placeholder={generatePlaceholder()}
      rows="12"
      maxlength="2000"
    ></textarea>
    <div class="backstory-meta">
      <p class="hint">Optional — you can always add this later.</p>
      <span class="char-count" class:near-limit={charCount > 1800}>{charCount} / 2000</span>
    </div>
  </div>

  <div class="ai-coming-soon">
    <span class="badge">Coming Soon</span>
    <span class="text">AI-generated backstory suggestions</span>
  </div>

  <button class="btn-primary" onclick={confirm}>
    {name ? `Continue as ${name}` : 'Continue'} → Character Sheet
  </button>
</div>

<style lang="scss">
  .backstory-editor {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .name-section,
  .sex-section,
  .alignment-section,
  .backstory-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: var(--text-body);
    }
  }

  .sex-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .sex-btn {
    @include selectable-card($lift: 0);
    flex: 1;
    padding: 0.75rem;
    transition: all 0.15s;
    color: var(--text-body);
    font-size: 1rem;

    &.selected {
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .alignment-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .alignment-btn {
    @include selectable-card($lift: 0);
    padding: 0.5rem;
    transition: all 0.15s;
    color: var(--text-body);
    font-size: 0.875rem;
    text-align: center;

    &.selected {
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .name-row {
    display: flex;
    gap: 0.5rem;
    align-items: stretch;

    input[type="text"] {
      flex: 1;
    }
  }

  .btn-random {
    padding: 0.5rem 1rem;
    border: 2px solid var(--gold);
    border-radius: 4px;
    background: rgba(201, 162, 39, 0.1);
    color: var(--gold);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;

    &:hover {
      background: rgba(201, 162, 39, 0.25);
      color: var(--text-primary);
    }

    &:active {
      background: rgba(201, 162, 39, 0.35);
    }

    &.small {
      padding: 0.3rem 0.75rem;
      font-size: 0.8rem;
    }
  }

  .details-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: var(--text-body);
    }
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;

    @media (max-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .detail-field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    input {
      padding: 0.4rem 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 0.9rem;
      width: 100%;

      &:focus {
        outline: none;
        border-color: var(--gold);
      }
    }
  }

  input[type="text"] {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    font-size: 1.1rem;
    font-family: 'Cinzel', serif;

    &:focus {
      outline: none;
      border-color: var(--gold);
    }
  }

  textarea {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    font-size: 0.95rem;
    line-height: 1.6;
    resize: vertical;
    min-height: 200px;

    &:focus {
      outline: none;
      border-color: var(--gold);
    }

    &::placeholder {
      color: var(--text-faint);
    }
  }

  .backstory-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hint {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0;
  }

  .char-count {
    font-size: 0.8rem;
    color: var(--text-muted);

    &.near-limit {
      color: var(--red);
    }
  }

  .ai-coming-soon {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--bg-panel);
    border-radius: 4px;
    border: 1px dashed var(--border-color);

    .badge {
      padding: 0.2rem 0.5rem;
      background: var(--gold-dark);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 2px;
    }

    .text {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  }

  .btn-primary {
    align-self: center;
  }
</style>
