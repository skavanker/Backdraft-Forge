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

    // Step 2 special case: handle exceptional strength from class selection
    if (step === 2 && data.exceptionalStr !== undefined) {
      if (!character.abilities) character.abilities = {};
      character.abilities.exceptionalStr = data.exceptionalStr;
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
    // Use JSON serialization to handle non-serializable objects (functions in data objects)
    undoStack = [...undoStack.slice(-(MAX_UNDO - 1)), JSON.parse(JSON.stringify(character))];
  }

  async function undo() {
    if (undoStack.length === 0 || currentStep !== STEP_SHEET) return;
    const prev = undoStack[undoStack.length - 1];
    undoStack = undoStack.slice(0, -1);

    // Restore objects from keys
    const { races } = await import('./data/races.js');
    const { classes, wizardSchools } = await import('./data/classes.js');
    const { kits } = await import('./data/kits.js');
    const { deities } = await import('./data/deities.js');
    const { weapons, nonWeaponProficiencies } = await import('./data/proficiencies.js');
    const { languages } = await import('./data/languages.js');
    const { equipment } = await import('./data/equipment.js');
    const { wizardSpells, priestSpells } = await import('./data/spells.js');

    const restored = {
      ...prev,
      race: prev.raceKey ? races[prev.raceKey] : null,
      cls: prev.classKey ? classes[prev.classKey] : null,
      wizardSchool: prev.wizardSchool?.key ? { key: prev.wizardSchool.key, ...wizardSchools[prev.wizardSchool.key] } : null,
      kit: prev.kitKey && kits[prev.kitKey] ? { key: prev.kitKey, ...kits[prev.kitKey] } : null,
      deity: prev.deityKey && deities[prev.deityKey] ? { key: prev.deityKey, ...deities[prev.deityKey] } : null
    };

    // Restore proficiencies
    if (prev.proficiencies) {
      restored.proficiencies = {
        weapons: prev.proficiencies.weapons?.map(w => ({ key: w.key, ...weapons[w.key] })) || [],
        nonWeapon: prev.proficiencies.nonWeapon?.map(p => ({ key: p.key, ...nonWeaponProficiencies[p.key] })) || [],
        languages: prev.proficiencies.languages?.map(l => ({ key: l.key, ...languages[l.key] })) || []
      };
    }

    // Restore equipment
    if (prev.equipment) {
      restored.equipment = {
        remaining: prev.equipment.remaining,
        armor: prev.equipment.armor ? equipment.armor.find(a => a.key === prev.equipment.armor.key) : null,
        shield: prev.equipment.shield ? equipment.shields.find(s => s.key === prev.equipment.shield.key) : null,
        weapons: prev.equipment.weapons?.map(w => equipment.weapons.find(wep => wep.key === w.key)).filter(Boolean) || [],
        gear: prev.equipment.gear?.map(g => {
          if (g.key?.startsWith('custom_')) return g; // Custom items
          const found = [...equipment.ammunition, ...equipment.adventuringGear, ...equipment.clothing].find(item => item.key === g.key);
          return found ? { ...found, qty: g.qty } : null;
        }).filter(Boolean) || []
      };
    }

    // Restore spells
    if (prev.spells) {
      if (prev.spells.type === 'arcane') {
        restored.spells = {
          type: 'arcane',
          spellbook: prev.spells.spellbook?.map(s => wizardSpells.find(spell => spell.key === s.key)).filter(Boolean) || [],
          memorized: prev.spells.memorized?.map(s => wizardSpells.find(spell => spell.key === s.key)).filter(Boolean) || [],
          spellsPerDay: prev.spells.spellsPerDay
        };
      } else if (prev.spells.type === 'divine') {
        restored.spells = {
          type: 'divine',
          prepared: prev.spells.prepared?.map(s => priestSpells.find(spell => spell.key === s.key)).filter(Boolean) || [],
          spellsPerDay: prev.spells.spellsPerDay
        };
      }
    }

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

    // Restore objects from keys (same as undo)
    const { races } = await import('./data/races.js');
    const { classes, wizardSchools } = await import('./data/classes.js');
    const { kits } = await import('./data/kits.js');
    const { deities } = await import('./data/deities.js');
    const { weapons, nonWeaponProficiencies } = await import('./data/proficiencies.js');
    const { languages } = await import('./data/languages.js');
    const { equipment } = await import('./data/equipment.js');
    const { wizardSpells, priestSpells } = await import('./data/spells.js');

    const wip = wipPrompt.character;
    const restored = {
      ...wip,
      race: wip.raceKey ? races[wip.raceKey] : null,
      cls: wip.classKey ? classes[wip.classKey] : null,
      wizardSchool: wip.wizardSchool?.key ? { key: wip.wizardSchool.key, ...wizardSchools[wip.wizardSchool.key] } : null,
      kit: wip.kitKey && kits[wip.kitKey] ? { key: wip.kitKey, ...kits[wip.kitKey] } : null,
      deity: wip.deityKey && deities[wip.deityKey] ? { key: wip.deityKey, ...deities[wip.deityKey] } : null
    };

    // Restore proficiencies
    if (wip.proficiencies) {
      restored.proficiencies = {
        weapons: wip.proficiencies.weapons?.map(w => ({ key: w.key, ...weapons[w.key] })) || [],
        nonWeapon: wip.proficiencies.nonWeapon?.map(p => ({ key: p.key, ...nonWeaponProficiencies[p.key] })) || [],
        languages: wip.proficiencies.languages?.map(l => ({ key: l.key, ...languages[l.key] })) || []
      };
    }

    // Restore equipment
    if (wip.equipment) {
      restored.equipment = {
        remaining: wip.equipment.remaining,
        armor: wip.equipment.armor ? equipment.armor.find(a => a.key === wip.equipment.armor.key) : null,
        shield: wip.equipment.shield ? equipment.shields.find(s => s.key === wip.equipment.shield.key) : null,
        weapons: wip.equipment.weapons?.map(w => equipment.weapons.find(wep => wep.key === w.key)).filter(Boolean) || [],
        gear: wip.equipment.gear?.map(g => {
          if (g.key?.startsWith('custom_')) return g;
          const found = [...equipment.ammunition, ...equipment.adventuringGear, ...equipment.clothing].find(item => item.key === g.key);
          return found ? { ...found, qty: g.qty } : null;
        }).filter(Boolean) || []
      };
    }

    // Restore spells
    if (wip.spells) {
      if (wip.spells.type === 'arcane') {
        restored.spells = {
          type: 'arcane',
          spellbook: wip.spells.spellbook?.map(s => wizardSpells.find(spell => spell.key === s.key)).filter(Boolean) || [],
          memorized: wip.spells.memorized?.map(s => wizardSpells.find(spell => spell.key === s.key)).filter(Boolean) || [],
          spellsPerDay: wip.spells.spellsPerDay
        };
      } else if (wip.spells.type === 'divine') {
        restored.spells = {
          type: 'divine',
          prepared: wip.spells.prepared?.map(s => priestSpells.find(spell => spell.key === s.key)).filter(Boolean) || [],
          spellsPerDay: wip.spells.spellsPerDay
        };
      }
    }

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
