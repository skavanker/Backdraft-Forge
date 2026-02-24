<script>
  import { onMount } from 'svelte';
  import AbilityRoller from './lib/AbilityRoller.svelte';
  import RaceSelector from './lib/RaceSelector.svelte';
  import ClassSelector from './lib/ClassSelector.svelte';
  import ProficiencySelector from './lib/ProficiencySelector.svelte';
  import EquipmentSelector from './lib/EquipmentSelector.svelte';
  import SpellSelector from './lib/SpellSelector.svelte';
  import BackstoryEditor from './lib/BackstoryEditor.svelte';
  import CharacterSheet from './lib/CharacterSheet.svelte';
  import CharacterSummary from './lib/CharacterSummary.svelte';
  import ReviewStep from './lib/ReviewStep.svelte';
  import { initTheme, toggleTheme } from './lib/theme.js';
  import { getCharacterFromUrl, encodeCharacter, decodeCharacter } from './lib/shareCharacter.js';

  const steps = [
    'Roll Abilities',
    'Choose Race',
    'Choose Class',
    'Review Stats',
    'Proficiencies',
    'Equipment',
    'Spells',
    'Backstory',
    'Character Sheet'
  ];

  let currentStep = $state(0);
  let theme = $state('light');

  function makeEmptyCharacter() {
    return {
      abilities: null,
      rollData: null,
      adjustedAbilities: null,
      raceKey: null,
      race: null,
      classKey: null,
      cls: null,
      levelLimit: null,
      xpBonus: 0,
      wizardSchool: null,
      proficiencies: null,
      equipment: null,
      spells: null,
      name: null,
      backstory: null,
      sex: null,
      alignment: null,
      age: null,
      height: null,
      weight: null,
      eyes: null,
      hair: null,
      deity: null,
    };
  }

  let character = $state(makeEmptyCharacter());

  const SAVE_KEY = 'backdraft-forge-character';

  function saveToLocalStorage() {
    try {
      const encoded = encodeCharacter(character);
      if (encoded) localStorage.setItem(SAVE_KEY, encoded);
    } catch (e) { /* silently fail */ }
  }

  function clearSavedCharacter() {
    localStorage.removeItem(SAVE_KEY);
  }

  async function loadSavedCharacter() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const restored = await decodeCharacter(saved);
        if (restored) {
          character = restored;
          currentStep = 8;
          hasSavedCharacter = false;
          return;
        }
      }
    } catch (e) { /* ignore */ }
    // If load failed, clear bad data
    clearSavedCharacter();
    hasSavedCharacter = false;
  }

  let hasSavedCharacter = $state(false);

  onMount(async () => {
    initTheme();
    theme = document.documentElement.getAttribute('data-theme') || 'light';

    // Check if character data is in URL (shared link)
    const sharedCharacter = await getCharacterFromUrl();
    if (sharedCharacter) {
      character = sharedCharacter;
      currentStep = 8;
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    // Check for saved character in localStorage
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const restored = await decodeCharacter(saved);
        if (restored) {
          hasSavedCharacter = true;
        }
      }
    } catch (e) { /* ignore corrupt data */ }
  });

  function handleThemeToggle() {
    theme = toggleTheme();
  }

  function handleAbilitiesComplete({ abilities, rollData }) {
    // Check if abilities changed - if so, clear forward progress
    const abilitiesChanged = character.abilities && (
      character.abilities.STR !== abilities.STR ||
      character.abilities.DEX !== abilities.DEX ||
      character.abilities.CON !== abilities.CON ||
      character.abilities.INT !== abilities.INT ||
      character.abilities.WIS !== abilities.WIS ||
      character.abilities.CHA !== abilities.CHA ||
      character.abilities.exceptionalStr !== abilities.exceptionalStr
    );

    if (abilitiesChanged) {
      // Clear all forward progress since abilities changed
      character.raceKey = null;
      character.race = null;
      character.adjustedAbilities = null;
      character.classKey = null;
      character.cls = null;
      character.levelLimit = null;
      character.xpBonus = 0;
      character.wizardSchool = null;
      character.proficiencies = null;
      character.equipment = null;
      character.spells = null;
      character.name = null;
      character.backstory = null;
    }

    character.abilities = abilities;
    character.rollData = rollData;  // Always update rollData (could be reassignment)
    currentStep = 1;
  }

  function handleRaceComplete({ raceKey, race, adjustedAbilities }) {
    character.raceKey = raceKey;
    character.race = race;
    character.adjustedAbilities = adjustedAbilities;
    currentStep = 2;
  }

  function handleClassComplete({ classKey, cls, levelLimit, xpBonus, wizardSchool }) {
    character.classKey = classKey;
    character.cls = cls;
    character.levelLimit = levelLimit;
    character.xpBonus = xpBonus;
    character.wizardSchool = wizardSchool ?? null;
    currentStep = 3;
  }

  function handleProficienciesComplete(proficiencies) {
    character.proficiencies = proficiencies;
    currentStep = 5;
  }

  function handleEquipmentComplete(equipment) {
    character.equipment = equipment;
    currentStep = 6;
  }

  function handleSpellsComplete(spells) {
    character.spells = spells;
    currentStep = 7;
  }

  function handleBackstoryComplete({ name, sex, alignment, backstory, age, height, weight, eyes, hair, deity }) {
    character.name = name;
    character.sex = sex;
    character.alignment = alignment;
    character.backstory = backstory;
    character.age = age;
    character.height = height;
    character.weight = weight;
    character.eyes = eyes;
    character.hair = hair;
    character.deity = deity;
    currentStep = 8;
    saveToLocalStorage();
  }

  function continueToStep(step) {
    currentStep = step;
  }

  // Each gate returns true when the step's data is complete.
  // canNavigateToStep: index reachable if <= currentStep OR gate(index) passes.
  // isStepIncomplete: gate(index) hasn't been satisfied yet.
  const stepGates = [
    () => character.abilities !== null,   // 0 Roll Abilities
    () => character.race !== null,         // 1 Choose Race
    () => character.cls !== null,          // 2 Choose Class
    () => true,                            // 3 Review (no completion needed)
    () => character.proficiencies !== null, // 4 Proficiencies
    () => character.equipment !== null,     // 5 Equipment
    () => character.spells !== null,        // 6 Spells
    () => character.name !== null,          // 7 Backstory
    () => true,                            // 8 Character Sheet
  ];

  function canNavigateToStep(index) {
    if (index <= currentStep) return true;
    // Can jump forward only if preceding gate satisfied
    // For steps 3 and 4: both require cls (gate index 2)
    const gateIndex = index === 3 || index === 4 ? 2 : index - 1;
    return gateIndex >= 0 && stepGates[gateIndex]();
  }

  function isStepIncomplete(index) {
    return !stepGates[index]();
  }

  function handleImportCharacter(importedCharacter) {
    character = importedCharacter;
    currentStep = 8;
    saveToLocalStorage();
  }

  let showResetConfirm = $state(false);

  function resetAll() {
    character = makeEmptyCharacter();
    currentStep = 0;
    showResetConfirm = false;
    hasSavedCharacter = false;
    clearSavedCharacter();
  }


  function goToStep(index) {
    if (canNavigateToStep(index)) {
      currentStep = index;
    }
  }

</script>

<button class="theme-toggle" onclick={handleThemeToggle} title="Toggle theme">
  {theme === 'dark' ? '☀️' : '🌙'}
</button>

<main>
  <header class="header">
    <h1>Backdraft Forge</h1>
    <p class="tagline">AD&D 2nd Edition Character Creator</p>
    {#if character.abilities}
      <div class="header-actions">
        {#if showResetConfirm}
          <span class="reset-confirm">Start over? All progress will be lost.</span>
          <button class="btn-danger btn-sm" onclick={resetAll}>Yes, reset</button>
          <button class="btn-ghost btn-sm" onclick={() => showResetConfirm = false}>Cancel</button>
        {:else}
          <button class="btn-ghost btn-sm" onclick={() => showResetConfirm = true}>
            🗑 Start Over
          </button>
        {/if}
      </div>
    {/if}
  </header>

  <nav class="step-nav">
    {#each steps as step, i}
      <button
        class="step-item"
        class:active={i === currentStep}
        class:completed={i < currentStep || canNavigateToStep(i)}
        class:incomplete={i <= currentStep && isStepIncomplete(i)}
        class:future={i > currentStep && !canNavigateToStep(i)}
        onclick={() => goToStep(i)}
        disabled={!canNavigateToStep(i)}
      >
        <span class="step-number">{i + 1}</span>
        <span class="step-label">{step}</span>
      </button>
    {/each}
  </nav>

  <section class="content card">
    {#if hasSavedCharacter && currentStep === 0}
      <div class="resume-prompt">
        <p>You have a saved character from a previous session.</p>
        <div class="resume-buttons">
          <button class="btn-primary" onclick={loadSavedCharacter}>
            Resume Saved Character
          </button>
          <button class="btn-ghost" onclick={() => { hasSavedCharacter = false; clearSavedCharacter(); }}>
            Start Fresh
          </button>
        </div>
      </div>
    {/if}

    {#if currentStep === 0}
      <h2>Roll Your Abilities</h2>
      <CharacterSummary {character} />
      <AbilityRoller
        onComplete={handleAbilitiesComplete}
        onImport={handleImportCharacter}
        existingAbilities={character.abilities}
        existingRollData={character.rollData}
      />

    {:else if currentStep === 1}
      <h2>Choose Your Race</h2>
      <CharacterSummary {character} />
      <RaceSelector
        abilities={character.abilities}
        existingRaceKey={character.raceKey}
        onComplete={handleRaceComplete}
      />

    {:else if currentStep === 2}
      <h2>Choose Your Class</h2>
      <CharacterSummary {character} />
      <ClassSelector
        abilities={character.adjustedAbilities}
        race={character.race}
        raceKey={character.raceKey}
        existingClassKey={character.classKey}
        existingWizardSchool={character.wizardSchool}
        onComplete={handleClassComplete}
      />

    {:else if currentStep === 3}
      <h2>Review Your Character</h2>
      <ReviewStep {character} onContinue={() => continueToStep(4)} />

    {:else if currentStep === 4}
      <h2>Choose Proficiencies</h2>
      <CharacterSummary {character} />
      <ProficiencySelector
        abilities={character.adjustedAbilities}
        race={{ ...character.race, key: character.raceKey }}
        cls={{ ...character.cls, key: character.classKey }}
        existingProficiencies={character.proficiencies}
        onComplete={handleProficienciesComplete}
      />

    {:else if currentStep === 5}
      <h2>Buy Equipment</h2>
      <CharacterSummary {character} />
      <EquipmentSelector
        cls={{ ...character.cls, key: character.classKey }}
        weaponProficiencies={character.proficiencies.weapons}
        existingEquipment={character.equipment}
        str={character.adjustedAbilities.STR}
        exceptionalStr={character.abilities.exceptionalStr}
        onComplete={handleEquipmentComplete}
      />

    {:else if currentStep === 6}
      <h2>Spells</h2>
      <CharacterSummary {character} />
      <SpellSelector
        classKey={character.classKey}
        wizardSchool={character.wizardSchool}
        abilities={character.adjustedAbilities}
        existingSpells={character.spells}
        onComplete={handleSpellsComplete}
      />

    {:else if currentStep === 7}
      <h2>Backstory</h2>
      <CharacterSummary {character} />
      <BackstoryEditor
        {character}
        onComplete={handleBackstoryComplete}
      />

    {:else if currentStep === 8}
      <CharacterSheet {character} onImport={handleImportCharacter} />
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .resume-prompt {
    text-align: center;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 2px solid var(--gold);
    border-radius: 4px;
    background: rgba(201, 162, 39, 0.08);

    p {
      margin: 0 0 1rem;
      color: var(--text-body);
      font-size: 1.05rem;
    }
  }

  .resume-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .header {
    text-align: center;
  }

  .tagline {
    font-style: italic;
    color: var(--text-muted);
    margin-top: -0.5rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .btn-sm {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }

  .btn-danger {
    background: #b43c28;
    color: white;
    border: 1px solid #932f1f;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #932f1f;
    }
  }

  .reset-confirm {
    font-size: 0.85rem;
    color: var(--text-muted);
  }


  .step-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
    padding: 1rem;
    background: var(--bg-subtle);
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    background: transparent;
    border: none;
    box-shadow: none;
    color: var(--text-faint);
    font-size: 0.8rem;
    cursor: default;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: none;
      box-shadow: none;
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.4em;
      height: 1.4em;
      border-radius: 50%;
      background: var(--bg-panel);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .step-label {
      display: none;
      @media (min-width: 640px) {
        display: inline;
      }
    }

    &.active {
      color: var(--text-primary);
      font-weight: 600;

      .step-number {
        background: var(--gold);
        color: var(--text-primary);
      }
    }

    &.completed {
      color: var(--text-body);
      cursor: pointer;

      .step-number {
        background: var(--gold-dark);
        color: white;
      }

      &:hover {
        color: var(--text-primary);
      }
    }

    &.incomplete {
      .step-number {
        background: rgba(196, 74, 45, 0.2);
        border: 2px solid var(--red);
        color: var(--red);
      }
    }

    &.future {
      opacity: 0.5;
    }
  }

  .content {
    min-height: 400px;
  }

  /* Print Styles */
  @media print {
    .header, .navigation, .theme-toggle {
      display: none !important;
    }

    .container {
      padding: 0;
      max-width: 100%;
    }

    .content {
      min-height: auto;
    }

    /* Only show character sheet on print */
    body {
      background: white !important;
    }
  }

</style>
