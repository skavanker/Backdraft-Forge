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

  const SAVES_KEY = 'backdraft-forge-saves';
  const OLD_SAVE_KEY = 'backdraft-forge-character';

  let savedCharacters = $state([]);

  function loadSavesList() {
    try {
      const raw = localStorage.getItem(SAVES_KEY);
      savedCharacters = raw ? JSON.parse(raw) : [];
    } catch { savedCharacters = []; }
  }

  function persistSavesList() {
    localStorage.setItem(SAVES_KEY, JSON.stringify(savedCharacters));
  }

  function saveToLocalStorage() {
    try {
      const encoded = encodeCharacter(character);
      if (!encoded) return;
      const entry = {
        id: Date.now(),
        name: character.name || 'Unnamed Hero',
        race: character.race?.name || '?',
        cls: character.wizardSchool?.name || character.cls?.name || '?',
        code: encoded,
      };
      // Replace existing save with same name+race+class, or add new
      const idx = savedCharacters.findIndex(s =>
        s.name === entry.name && s.race === entry.race && s.cls === entry.cls
      );
      if (idx >= 0) {
        savedCharacters[idx] = entry;
      } else {
        savedCharacters = [entry, ...savedCharacters];
      }
      persistSavesList();
    } catch (e) { /* silently fail */ }
  }

  async function loadSavedCharacter(entry) {
    try {
      const restored = await decodeCharacter(entry.code);
      if (restored) {
        character = restored;
        currentStep = 8;
        return;
      }
    } catch (e) { /* ignore */ }
    // If load failed, remove bad entry
    deleteSavedCharacter(entry.id);
  }

  function deleteSavedCharacter(id) {
    savedCharacters = savedCharacters.filter(s => s.id !== id);
    persistSavesList();
  }

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

    // Migrate old single-save format
    try {
      const oldSave = localStorage.getItem(OLD_SAVE_KEY);
      if (oldSave) {
        const restored = await decodeCharacter(oldSave);
        if (restored) {
          const encoded = encodeCharacter(restored);
          const entry = {
            id: Date.now(),
            name: restored.name || 'Unnamed Hero',
            race: restored.race?.name || '?',
            cls: restored.wizardSchool?.name || restored.cls?.name || '?',
            code: encoded,
          };
          loadSavesList();
          savedCharacters = [entry, ...savedCharacters];
          persistSavesList();
        }
        localStorage.removeItem(OLD_SAVE_KEY);
      }
    } catch (e) { /* ignore */ }

    loadSavesList();
  });

  function handleThemeToggle() {
    theme = toggleTheme();
  }

  const stepFields = {
    0: { fields: ['abilities', 'rollData'], next: 1 },
    1: { fields: ['raceKey', 'race', 'adjustedAbilities'], next: 2 },
    2: { fields: ['classKey', 'cls', 'levelLimit', 'xpBonus', 'wizardSchool'], next: 3 },
    4: { fields: ['proficiencies'], next: 5 },
    5: { fields: ['equipment'], next: 6 },
    6: { fields: ['spells'], next: 7 },
    7: { fields: ['name', 'sex', 'alignment', 'backstory', 'age', 'height', 'weight', 'eyes', 'hair', 'deity'], next: 8, after: saveToLocalStorage },
  };

  function completeStep(step, data) {
    // Step 0 special case: if abilities changed, clear forward progress
    if (step === 0 && character.abilities) {
      const a = character.abilities, b = data.abilities;
      const changed = a.STR !== b.STR || a.DEX !== b.DEX || a.CON !== b.CON ||
        a.INT !== b.INT || a.WIS !== b.WIS || a.CHA !== b.CHA ||
        a.exceptionalStr !== b.exceptionalStr;
      if (changed) {
        const empty = makeEmptyCharacter();
        for (const key of Object.keys(empty)) {
          if (key !== 'abilities' && key !== 'rollData') character[key] = empty[key];
        }
      }
    }

    const config = stepFields[step];
    for (const field of config.fields) {
      character[field] = data[field] ?? null;
    }
    currentStep = config.next;
    config.after?.();
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
    <h1 class="logo" onclick={() => goToStep(0)}>Backdraft Forge</h1>
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
    {#if savedCharacters.length > 0 && currentStep === 0}
      <div class="saved-characters">
        <h3>Saved Characters</h3>
        <div class="save-list">
          {#each savedCharacters as entry (entry.id)}
            <div class="save-entry">
              <button class="save-load" onclick={() => loadSavedCharacter(entry)}>
                <span class="save-name">{entry.name}</span>
                <span class="save-meta">{entry.race} {entry.cls}</span>
              </button>
              <button class="save-delete" onclick={() => deleteSavedCharacter(entry.id)} title="Delete save">&times;</button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if currentStep === 0}
      <h2>Roll Your Abilities</h2>
      <CharacterSummary {character} />
      <AbilityRoller
        onComplete={(data) => completeStep(0, data)}
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
        onComplete={(data) => completeStep(1, data)}
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
        onComplete={(data) => completeStep(2, data)}
      />

    {:else if currentStep === 3}
      <h2>Review Your Character</h2>
      <ReviewStep {character} onContinue={() => { currentStep = 4; }} />

    {:else if currentStep === 4}
      <h2>Choose Proficiencies</h2>
      <CharacterSummary {character} />
      <ProficiencySelector
        abilities={character.adjustedAbilities}
        race={{ ...character.race, key: character.raceKey }}
        cls={{ ...character.cls, key: character.classKey }}
        existingProficiencies={character.proficiencies}
        onComplete={(data) => completeStep(4, { proficiencies: data })}
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
        onComplete={(data) => completeStep(5, { equipment: data })}
      />

    {:else if currentStep === 6}
      <h2>Spells</h2>
      <CharacterSummary {character} />
      <SpellSelector
        classKey={character.classKey}
        wizardSchool={character.wizardSchool}
        abilities={character.adjustedAbilities}
        existingSpells={character.spells}
        onComplete={(data) => completeStep(6, { spells: data })}
      />

    {:else if currentStep === 7}
      <h2>Backstory</h2>
      <CharacterSummary {character} />
      <BackstoryEditor
        {character}
        onComplete={(data) => completeStep(7, data)}
      />

    {:else if currentStep === 8}
      <CharacterSheet {character} onImport={handleImportCharacter} onSave={saveToLocalStorage} />
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .saved-characters {
    margin-bottom: 1.5rem;

    h3 {
      margin: 0 0 0.75rem;
    }
  }

  .save-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .save-entry {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .save-load {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.2s;
    text-align: left;

    &:hover {
      border-color: var(--gold);
    }

    .save-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .save-meta {
      color: var(--text-muted);
      font-size: 0.875rem;
    }
  }

  .save-delete {
    background: transparent;
    border: none;
    color: var(--text-faint);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
    opacity: 0.4;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
      color: var(--red);
    }
  }

  .header {
    text-align: center;
  }

  .logo {
    cursor: pointer;
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
    background: var(--red);
    color: white;
    border: 1px solid var(--red-dark);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: var(--red-dark);
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
