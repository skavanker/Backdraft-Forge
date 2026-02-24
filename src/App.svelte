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
  import { getCharacterWarnings } from './data/classes.js';
  import { initTheme, toggleTheme } from './lib/theme.js';
  import { getCharacterFromUrl } from './lib/shareCharacter.js';

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

  // Character data
  let character = $state({
    abilities: null,        // Base abilities from rolling
    rollData: null,         // Original roll data (dice, method, etc.) for reassignment
    adjustedAbilities: null, // After racial adjustments
    raceKey: null,
    race: null,
    classKey: null,
    cls: null,
    levelLimit: null,
    xpBonus: 0,
    wizardSchool: null,     // For specialist wizards
    proficiencies: null,    // Weapon and non-weapon proficiencies
    equipment: null,        // Purchased equipment
    spells: null,           // Spellbook/prepared spells
    name: null,             // Character name
    backstory: null,        // Character backstory
  });

  onMount(async () => {
    initTheme();
    theme = document.documentElement.getAttribute('data-theme') || 'light';

    // Check if character data is in URL (shared link)
    const sharedCharacter = await getCharacterFromUrl();
    if (sharedCharacter) {
      // Load the shared character
      character = sharedCharacter;
      // Navigate to final sheet to view it
      currentStep = 8;
      // Clear the hash to clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    }
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
  }

  function continueToStep(step) {
    currentStep = step;
  }

  function canNavigateToStep(index) {
    // Can always go to current or past steps
    if (index <= currentStep) return true;

    // Check if future step has been completed
    if (index === 1) return character.abilities !== null;
    if (index === 2) return character.race !== null;
    if (index === 3) return character.cls !== null;
    if (index === 4) return character.cls !== null; // Review step
    if (index === 5) return character.proficiencies !== null;
    if (index === 6) return character.equipment !== null;
    if (index === 7) return character.spells !== null;
    if (index === 8) return character.name !== null;

    return false;
  }

  function isStepIncomplete(index) {
    // Check if a step has unsaved/incomplete data
    if (index === 0) return character.abilities === null;
    if (index === 1) return character.race === null;
    if (index === 2) return character.cls === null;
    if (index === 3) return false; // Review step, no completion needed
    if (index === 4) return character.proficiencies === null;
    if (index === 5) return character.equipment === null;
    if (index === 6) return character.spells === null;
    if (index === 7) return !character.name;
    if (index === 8) return false; // Final sheet
    return false;
  }

  function handleImportCharacter(importedCharacter) {
    character = importedCharacter;
    currentStep = 8;
  }

  let showResetConfirm = $state(false);

  function resetAll() {
    character = {
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
    };
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

      <div class="character-review">
        <div class="review-header">
          <span class="review-race">{character.race.name}</span>
          <span class="review-class">
            {#if character.wizardSchool}
              {character.wizardSchool.name}
            {:else}
              {character.cls.name}
            {/if}
          </span>
        </div>

        <div class="review-grid">
          <div class="review-section">
            <h4>Ability Scores</h4>
            <div class="ability-summary">
              {#each ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as ability}
                <div class="ability-badge">
                  <span class="ability-label">{ability}</span>
                  <span class="ability-value">
                    {character.adjustedAbilities[ability]}{#if ability === 'STR' && character.abilities.exceptionalStr}/{character.abilities.exceptionalStr.toString().padStart(2, '0')}{/if}
                  </span>
                </div>
              {/each}
            </div>
          </div>

          <div class="review-section">
            <h4>Class Info</h4>
            <div class="info-list">
              <div class="info-row">
                <span>Hit Die</span>
                <span>{character.cls.hitDie}</span>
              </div>
              <div class="info-row">
                <span>Prime Requisite</span>
                <span>{character.cls.primeRequisite.join(', ')}</span>
              </div>
              {#if character.wizardSchool}
                <div class="info-row">
                  <span>School</span>
                  <span>{character.wizardSchool.school}</span>
                </div>
                <div class="info-row warning">
                  <span>Cannot Cast</span>
                  <span>{character.wizardSchool.oppositionSchools.join(', ')}</span>
                </div>
              {/if}
              {#if character.xpBonus > 0}
                <div class="info-row highlight">
                  <span>XP Bonus</span>
                  <span>+{character.xpBonus}%</span>
                </div>
              {/if}
              {#if character.levelLimit}
                <div class="info-row warning">
                  <span>Level Limit</span>
                  <span>{character.levelLimit}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>

        {#if character.cls}
          {@const reviewWarnings = getCharacterWarnings(character.adjustedAbilities, character.cls, character.classKey)}
          {#if reviewWarnings.length > 0}
            <div class="review-warnings">
              <h4>Advisory</h4>
              {#each reviewWarnings as warning}
                <div class="review-warning {warning.severity}">
                  <span class="warning-icon">{warning.severity === 'concern' ? '⚠' : '△'}</span>
                  <span>{warning.message}</span>
                </div>
              {/each}
            </div>
          {/if}
        {/if}

        <button
          class="btn-primary"
          onclick={() => continueToStep(4)}
        >
          Continue to Proficiencies
        </button>
      </div>

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

  .ability-summary {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .ability-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: rgba(201, 162, 39, 0.15);
    border: 1px solid rgba(201, 162, 39, 0.3);
    border-radius: 4px;
    min-width: 50px;

    .ability-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }

    .ability-value {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  // Character Review
  .character-review {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;

    .btn-primary {
      margin-top: 1rem;
    }
  }

  .review-header {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-family: 'Cinzel', serif;
    width: 100%;

    .review-race {
      color: var(--text-muted);
    }

    .review-class {
      color: var(--text-primary);
      font-weight: 600;
    }
  }

  .review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    width: 100%;
  }

  .review-section {
    padding: 1rem;
    background: var(--bg-panel);
    border-radius: 4px;

    h4 {
      margin: 0 0 1rem;
      font-size: 1rem;
      color: var(--text-body);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.25rem;
    }
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;

    span:first-child {
      color: var(--text-muted);
    }

    span:last-child {
      font-weight: 600;
      color: var(--text-primary);
    }

    &.highlight span:last-child {
      color: #228b22;
    }

    &.warning span:last-child {
      color: var(--gold-dark);
    }
  }

  // Advisory Warnings
  .review-warnings {
    width: 100%;
    margin-top: 0.5rem;

    h4 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin: 0 0 0.5rem;
    }
  }

  .review-warning {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-size: 0.85rem;
    line-height: 1.3;
    margin-bottom: 0.3rem;

    .warning-icon {
      flex-shrink: 0;
    }

    &.caution {
      background: rgba(184, 148, 60, 0.1);
      color: var(--gold-dark);
      border-left: 3px solid var(--gold-dark);
    }

    &.concern {
      background: rgba(180, 60, 40, 0.1);
      color: #b43c28;
      border-left: 3px solid #b43c28;
    }
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
