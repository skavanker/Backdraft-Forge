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
  import { getCharacterFromUrl, encodeCharacter } from './lib/shareCharacter.js';
  import { isSpellcaster } from './data/spells.js';
  import { isTyping } from './lib/utils/keyboard.js';
  import { settings, initSettings } from './lib/settings.svelte.js';
  import SettingsPanel from './lib/components/SettingsPanel.svelte';
  import { STEP_SHEET, TOAST_DURATION } from './data/constants.js';
  import { useToast } from './lib/utils/stateUtils.svelte.js';
  import {
    loadSavesList as loadSaves,
    saveToLocalStorage as persistSave,
    loadSavedCharacter as loadSaved,
    deleteSavedCharacter as deleteSave,
    saveMidCreation as persistWip,
    clearMidCreation,
    loadMidCreation
  } from './lib/persistence.svelte.js';

  const steps = [
    'Abilities',
    'Race',
    'Class',
    'Review',
    'Proficiencies',
    'Equipment',
    'Spells',
    'Backstory',
    'Sheet'
  ];

  let currentStep = $state(0);
  let settingsOpen = $state(false);

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
      kitKey: null,
      kit: null,
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
      deityKey: null,
      level: 1,
      xp: 0,
      hpHistory: [],
      currentHP: null,
      thiefSkills: null,
      speciesEnemy: null,
      notes: '',
    };
  }

  let character = $state(makeEmptyCharacter());

  let savedCharacters = $state([]);

  function saveToLocalStorage() {
    savedCharacters = persistSave(character, savedCharacters);
  }

  async function loadSavedCharacter(entry) {
    const restored = await loadSaved(entry);
    if (restored) {
      character = restored;
      currentStep = STEP_SHEET;
    } else {
      savedCharacters = deleteSave(entry.id, savedCharacters);
    }
  }

  function deleteSavedCharacter(id) {
    savedCharacters = deleteSave(id, savedCharacters);
  }

  onMount(() => {
    initSettings();

    // Async init (shared links, migration)
    (async () => {
      // Check if character data is in URL (shared link)
      const sharedCharacter = await getCharacterFromUrl();
      if (sharedCharacter) {
        character = sharedCharacter;
        currentStep = STEP_SHEET;
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }

      // Load saved characters
      savedCharacters = loadSaves();

      const wip = loadMidCreation();
      if (wip) wipPrompt = wip;
    })();

    function handleKeydown(e) {
      // Ctrl+S — save progress
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveMidCreation();
        return;
      }

      // Ctrl+E — export character code (on sheet step)
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        if (currentStep === STEP_SHEET) {
          e.preventDefault();
          exportCharacterCode();
        }
        return;
      }

      // Ctrl+Z — undo on character sheet
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (currentStep === STEP_SHEET && undoStack.length > 0) {
          e.preventDefault();
          undo();
        }
        return;
      }

      // Escape — close settings/reset popup or go back a step
      if (e.key === 'Escape') {
        if (settingsOpen) {
          settingsOpen = false;
        } else if (showResetConfirm) {
          showResetConfirm = false;
        } else if (currentStep > 0 && currentStep < STEP_SHEET) {
          goToStep(currentStep - 1);
        }
        return;
      }

      // Arrow keys — move focus like Tab/Shift+Tab
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (isTyping()) return;
        const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
        const focusable = [...document.querySelectorAll(
          '.content button:not(:disabled), .content input:not(:disabled), .content select:not(:disabled), .content textarea:not(:disabled), .content [tabindex]:not([tabindex="-1"])'
        )];
        if (focusable.length === 0) return;
        const idx = focusable.indexOf(document.activeElement);
        const next = forward
          ? (idx + 1) % focusable.length
          : (idx - 1 + focusable.length) % focusable.length;
        e.preventDefault();
        focusable[next].focus();
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  const stepFields = {
    0: { fields: ['abilities', 'rollData'], next: 1 },
    1: { fields: ['raceKey', 'race', 'adjustedAbilities'], next: 2 },
    2: { fields: ['classKey', 'cls', 'levelLimit', 'xpBonus', 'wizardSchool', 'deityKey', 'kitKey', 'kit', 'speciesEnemy'], next: 3 },
    4: { fields: ['proficiencies'], next: 5 },
    5: { fields: ['equipment'], get next() { return isSpellcaster(character.classKey) ? 6 : 7; }, after() { if (!isSpellcaster(character.classKey)) character.spells = []; } },
    6: { fields: ['spells'], next: 7 },
    7: { fields: ['name', 'sex', 'alignment', 'backstory', 'age', 'height', 'weight', 'eyes', 'hair', 'deity'], next: STEP_SHEET, after() { saveToLocalStorage(); clearMidCreation(); } },
  };

  function clearForwardProgress(keepFields = []) {
    const empty = makeEmptyCharacter();
    for (const key of Object.keys(empty)) {
      if (!keepFields.includes(key)) character[key] = empty[key];
    }
  }

  function completeStep(step, data) {
    // Step 0 special case: if abilities changed, clear forward progress
    if (step === 0 && character.abilities) {
      const a = character.abilities, b = data.abilities;
      const changed = a.STR !== b.STR || a.DEX !== b.DEX || a.CON !== b.CON ||
        a.INT !== b.INT || a.WIS !== b.WIS || a.CHA !== b.CHA ||
        a.exceptionalStr !== b.exceptionalStr;
      if (changed) {
        clearForwardProgress(['abilities', 'rollData']);
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

  // Steps 0-2 (abilities, race, class) are locked once character is level 2+
  function isStepLocked(index) {
    return index <= 2 && (character.level || 1) > 1;
  }

  function canNavigateToStep(index) {
    if (isStepLocked(index)) return false;
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
    currentStep = STEP_SHEET;
    saveToLocalStorage();
  }

  // Undo stack for character sheet edits (Ctrl+Z)
  const MAX_UNDO = 20;
  let undoStack = $state([]);
  const undoToast = useToast(TOAST_DURATION);
  const saveToast = useToast(TOAST_DURATION);

  function pushUndo() {
    undoStack = [...undoStack.slice(-(MAX_UNDO - 1)), JSON.parse(JSON.stringify(character))];
  }

  function undo() {
    if (undoStack.length === 0 || currentStep !== STEP_SHEET) return;
    const prev = undoStack[undoStack.length - 1];
    undoStack = undoStack.slice(0, -1);
    Object.assign(character, prev);
    saveToLocalStorage();
    undoToast.flash('Undone');
  }

  function handleCharacterUpdate(updated) {
    pushUndo();
    Object.assign(character, updated);
    saveToLocalStorage();
  }

  let showResetConfirm = $state(false);
  let wipPrompt = $state(null);

  function flashSave(msg = 'Progress saved') {
    saveToast.flash(msg);
  }

  function saveMidCreation() {
    if (currentStep === STEP_SHEET) {
      saveToLocalStorage();
      flashSave('Character saved');
      return;
    }
    persistWip(character, currentStep);
    flashSave();
  }

  function resumeWip() {
    if (!wipPrompt) return;
    Object.assign(character, wipPrompt.character);
    currentStep = wipPrompt.currentStep;
    wipPrompt = null;
    clearMidCreation();
  }

  function discardWip() {
    wipPrompt = null;
    clearMidCreation();
  }

  async function exportCharacterCode() {
    const encoded = encodeCharacter(character);
    if (!encoded) { flashSave('Failed to generate code'); return; }
    const { copyToClipboard } = await import('./lib/shareCharacter.js');
    const success = await copyToClipboard(encoded);
    flashSave(success ? 'Character code copied!' : 'Failed to copy code');
  }

  function resetAll() {
    character = makeEmptyCharacter();
    currentStep = 0;
    showResetConfirm = false;
    clearMidCreation();
  }


  function goToStep(index) {
    if (canNavigateToStep(index)) {
      currentStep = index;
    }
  }

</script>

<div class="top-buttons">
  {#if showResetConfirm}
    <div class="reset-confirm-popup">
      <span>Start over?</span>
      <button class="btn-danger btn-sm" onclick={resetAll}>Yes</button>
      <button class="btn-ghost btn-sm" onclick={() => showResetConfirm = false}>No</button>
    </div>
  {:else}
    <button class="reset-toggle" onclick={() => showResetConfirm = true} title="Start over" aria-label="Start over">
      &times;
    </button>
  {/if}
  <button class="settings-toggle" onclick={() => settingsOpen = !settingsOpen} title="Settings" aria-label="Settings">
    &#9881;
  </button>
</div>

<SettingsPanel
  open={settingsOpen}
  onClose={() => settingsOpen = false}
  showActions={currentStep === STEP_SHEET}
  onSave={() => { saveToLocalStorage(); flashSave('Character saved'); }}
  onShare={async () => {
    const { generateShareableUrl, copyToClipboard } = await import('./lib/shareCharacter.js');
    const url = generateShareableUrl(character);
    if (!url) { flashSave('Failed to generate link'); return; }
    const success = await copyToClipboard(url);
    flashSave(success ? 'Link copied to clipboard!' : 'Failed to copy');
  }}
  onExportCode={exportCharacterCode}
  onImport={handleImportCharacter}
  onUndo={undo}
  onPrint={() => window.print()}
  onResetLevel={() => {
    handleCharacterUpdate({
      level: 1, xp: 0, hpHistory: [],
      currentHP: null, thiefSkills: null, spells: null, proficiencies: null,
    });
  }}
  canUndo={undoStack.length > 0}
  charLevel={character.level || 1}
/>

<main>
  <header class="header">
    <h1><button class="logo" type="button" onclick={() => isStepLocked(0) ? showResetConfirm = true : goToStep(0)}>Backdraft Forge</button></h1>
    <p class="tagline">AD&D 2nd Edition Character Creator</p>
  </header>

  <nav class="step-nav">
    {#each steps as step, i}
      <button
        class="step-item"
        class:active={i === currentStep}
        class:completed={i < currentStep || canNavigateToStep(i)}
        class:incomplete={i <= currentStep && isStepIncomplete(i)}
        class:future={i > currentStep && !canNavigateToStep(i)}
        class:locked={isStepLocked(i)}
        onclick={() => goToStep(i)}
        disabled={!canNavigateToStep(i)}
        title={isStepLocked(i) ? 'Locked — cannot change after leveling up' : ''}
      >
        <span class="step-number">{#if isStepLocked(i)}<span aria-hidden="true">🔒</span>{:else}{i + 1}{/if}</span>
        <span class="step-label">{step}</span>
      </button>
    {/each}
  </nav>

  <section class="content card">
    {#if wipPrompt && currentStep === 0}
      <div class="wip-prompt alert alert-info">
        <span>Unfinished character found — {wipPrompt.character.race?.name || '?'} {wipPrompt.character.kit?.name || wipPrompt.character.wizardSchool?.name || wipPrompt.character.cls?.name || '?'} (Step {wipPrompt.currentStep + 1}: {steps[wipPrompt.currentStep]})</span>
        <div class="wip-actions">
          <button class="btn-primary btn-sm" onclick={resumeWip}>Resume</button>
          <button class="btn-ghost btn-sm" onclick={discardWip}>Discard</button>
        </div>
      </div>
    {/if}

    {#if savedCharacters.length > 0 && currentStep === 0}
      <div class="saved-characters">
        <h3>Saved Characters</h3>
        <div class="save-list">
          {#each savedCharacters as entry (entry.id)}
            <div class="save-entry">
              <button class="save-load" onclick={() => loadSavedCharacter(entry)}>
                <span class="save-name">{entry.name}</span>
                <span class="save-meta">{entry.race} {entry.cls}{entry.level > 1 ? ` · Lvl ${entry.level}` : ''}</span>
              </button>
              <button class="save-delete" onclick={() => deleteSavedCharacter(entry.id)} title="Delete save" aria-label="Delete save">&times;</button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if currentStep === 0}
      <h2>Roll Your Abilities</h2>
      <CharacterSummary {character} />
      {#key character.rollData}
        <AbilityRoller
          onComplete={(data) => completeStep(0, data)}
          onImport={handleImportCharacter}
          existingAbilities={character.abilities}
          existingRollData={character.rollData}
        />
      {/key}

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
        existingDeityKey={character.deityKey}
        existingKitKey={character.kitKey}
        existingSpeciesEnemy={character.speciesEnemy}
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
        kit={character.kit}
        level={character.level || 1}
        existingProficiencies={character.proficiencies}
        onComplete={(data) => completeStep(4, { proficiencies: data })}
      />

    {:else if currentStep === 5}
      <h2>Buy Equipment</h2>
      <CharacterSummary {character} />
      <EquipmentSelector
        cls={{ ...character.cls, key: character.classKey }}
        kit={character.kit}
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
        deityKey={character.deityKey}
        mode={character.level > 1 ? 'manage' : 'creation'}
        characterLevel={character.level || 1}
        onComplete={(data) => completeStep(6, { spells: data })}
      />

    {:else if currentStep === 7}
      <h2>Backstory</h2>
      <CharacterSummary {character} />
      <BackstoryEditor
        {character}
        onComplete={(data) => completeStep(7, data)}
      />

    {:else if currentStep === STEP_SHEET}
      <CharacterSheet {character} onCharacterUpdate={handleCharacterUpdate} undoMessage={undoToast.message} showUndoMessage={undoToast.visible} />
    {/if}
  </section>
</main>

{#if saveToast.visible}
  <div class="save-toast">{saveToast.message}</div>
{/if}

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
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
  }

  .tagline {
    font-style: italic;
    color: var(--text-muted);
    margin-top: -0.5rem;
  }

  .btn-sm {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }

  .btn-danger {
    background: var(--red);
    color: white;
    border: 1px solid var(--red);
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      filter: brightness(0.9);
    }
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

    &.locked {
      opacity: 0.35;
      cursor: not-allowed;

      .step-number {
        background: var(--bg-subtle);
        font-size: 0.65rem;
      }
    }
  }

  .content {
    min-height: 400px;
  }

  .wip-prompt {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .wip-actions {
    display: flex;
    gap: 0.5rem;
  }

  :global(.save-toast) {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    background: var(--bg-panel);
    border: 1px solid var(--gold);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    z-index: 1000;
    animation: fade-in 0.15s ease-out;
  }

  /* Print Styles */
  @media print {
    .header, .step-nav {
      display: none !important;
    }

    .content {
      min-height: auto;
    }
  }

</style>
