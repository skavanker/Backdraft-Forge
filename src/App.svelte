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
  import { settings, initSettings } from './lib/settings.svelte.js';
  import { restoreCharacterObjects } from './lib/utils/characterRestore.svelte.js';
  import { setupAppKeyboardShortcuts } from './lib/utils/appKeyboardHandlers.svelte.js';
  import {
    steps,
    createStepFields,
    createStepGates,
    isStepLocked as _isStepLocked,
    canNavigateToStep as _canNavigateToStep,
    isStepIncomplete as _isStepIncomplete,
    completeStep as _completeStep
  } from './lib/utils/stepManager.svelte.js';
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

    return setupAppKeyboardShortcuts({
      getCurrentStep: () => currentStep,
      getSettingsOpen: () => settingsOpen,
      getShowResetConfirm: () => showResetConfirm,
      getUndoStack: () => undoStack,
      STEP_SHEET,
      saveMidCreation,
      exportCharacterCode,
      undo,
      setSettingsOpen: (v) => settingsOpen = v,
      setShowResetConfirm: (v) => showResetConfirm = v,
      goToStep
    });
  });

  // Step management using stepManager utility
  const stepFields = $derived(createStepFields(character, saveToLocalStorage, clearMidCreation));
  const stepGates = $derived(createStepGates(character));

  function completeStep(step, data) {
    currentStep = _completeStep(step, data, character, stepFields, makeEmptyCharacter);
  }

  function isStepLocked(index) {
    return _isStepLocked(index, character);
  }

  function canNavigateToStep(index) {
    return _canNavigateToStep(index, currentStep, stepGates, character);
  }

  function isStepIncomplete(index) {
    return _isStepIncomplete(index, stepGates);
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
    // Use JSON serialization to handle non-serializable objects (functions in data objects)
    undoStack = [...undoStack.slice(-(MAX_UNDO - 1)), JSON.parse(JSON.stringify(character))];
  }

  async function undo() {
    if (undoStack.length === 0 || currentStep !== STEP_SHEET) return;
    const prev = undoStack[undoStack.length - 1];
    undoStack = undoStack.slice(0, -1);

    const restored = await restoreCharacterObjects(prev);
    Object.assign(character, restored);
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

  async function resumeWip() {
    if (!wipPrompt) return;

    const restored = await restoreCharacterObjects(wipPrompt.character);
    Object.assign(character, restored);
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
  @import './lib/styles/app';
</style>
