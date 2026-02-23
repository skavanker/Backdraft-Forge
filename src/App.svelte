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
  import Tooltip from './lib/Tooltip.svelte';
  import { getAvailableSchools } from './data/classes.js';
  import { initTheme, toggleTheme } from './lib/theme.js';

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

  // Available wizard schools (computed when needed)
  let availableSchools = $derived(
    character.classKey === 'specialist' && character.adjustedAbilities
      ? getAvailableSchools(character.adjustedAbilities, character.raceKey)
      : []
  );

  onMount(() => {
    initTheme();
    theme = document.documentElement.getAttribute('data-theme') || 'light';
  });

  function handleThemeToggle() {
    theme = toggleTheme();
  }

  function handleAbilitiesComplete(abilities) {
    character.abilities = abilities;
    currentStep = 1;
  }

  function handleRaceComplete({ raceKey, race, adjustedAbilities }) {
    character.raceKey = raceKey;
    character.race = race;
    character.adjustedAbilities = adjustedAbilities;
    currentStep = 2;
  }

  function handleClassComplete({ classKey, cls, levelLimit, xpBonus }) {
    character.classKey = classKey;
    character.cls = cls;
    character.levelLimit = levelLimit;
    character.xpBonus = xpBonus;
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

  function handleBackstoryComplete({ name, backstory }) {
    character.name = name;
    character.backstory = backstory;
    currentStep = 8;
  }

  function continueToStep(step) {
    currentStep = step;
  }

  function goToStep(index) {
    if (index < currentStep) {
      // When going back, clear forward progress
      if (index < 8) {
        character.name = null;
        character.backstory = null;
      }
      if (index < 7) {
        character.spells = null;
      }
      if (index < 6) {
        character.equipment = null;
      }
      if (index < 5) {
        character.proficiencies = null;
      }
      if (index < 4) {
        character.wizardSchool = null;
      }
      if (index < 3) {
        character.classKey = null;
        character.cls = null;
        character.levelLimit = null;
        character.xpBonus = 0;
      }
      if (index < 2) {
        character.raceKey = null;
        character.race = null;
        character.adjustedAbilities = null;
      }
      if (index < 1) {
        character.abilities = null;
      }
      currentStep = index;
    }
  }

  function selectSchool(schoolKey, school) {
    character.wizardSchool = { key: schoolKey, ...school };
  }
</script>

<button class="theme-toggle" onclick={handleThemeToggle} title="Toggle theme">
  {theme === 'dark' ? '☀️' : '🌙'}
</button>

<main>
  <header class="header">
    <h1>Backdraft Forge</h1>
    <p class="tagline">AD&D 2nd Edition Character Creator</p>
  </header>

  <nav class="step-nav">
    {#each steps as step, i}
      <button
        class="step-item"
        class:active={i === currentStep}
        class:completed={i < currentStep}
        class:future={i > currentStep}
        onclick={() => goToStep(i)}
        disabled={i > currentStep}
      >
        <span class="step-number">{i + 1}</span>
        <span class="step-label">{step}</span>
      </button>
    {/each}
  </nav>

  <section class="content card">
    {#if currentStep === 0}
      <h2>Roll Your Abilities</h2>
      <AbilityRoller onComplete={handleAbilitiesComplete} />

    {:else if currentStep === 1}
      <h2>Choose Your Race</h2>
      <RaceSelector
        abilities={character.abilities}
        onComplete={handleRaceComplete}
      />

    {:else if currentStep === 2}
      <h2>Choose Your Class</h2>
      <ClassSelector
        abilities={character.adjustedAbilities}
        race={character.race}
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

        {#if character.classKey === 'specialist'}
          <div class="school-selection">
            <h4>Choose Your School of Magic</h4>
            <div class="school-grid">
              {#each availableSchools as school}
                {@const tooltipText = !school.qualified ? school.failedReqs.join(', ') : `Opposition: ${school.oppositionSchools.join(', ')}`}
                <Tooltip text={tooltipText} position="bottom">
                  <button
                    class="school-card"
                    class:selected={character.wizardSchool?.key === school.key}
                    class:disabled={!school.qualified}
                    onclick={() => school.qualified && selectSchool(school.key, school)}
                    disabled={!school.qualified}
                  >
                    <span class="school-name">{school.name}</span>
                    <span class="school-desc">{school.school}</span>
                  </button>
                </Tooltip>
              {/each}
            </div>
          </div>
        {/if}

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

        <button
          class="btn-primary"
          onclick={() => continueToStep(4)}
          disabled={character.classKey === 'specialist' && !character.wizardSchool}
        >
          {#if character.classKey === 'specialist' && !character.wizardSchool}
            Select a School to Continue
          {:else}
            Continue to Proficiencies
          {/if}
        </button>
      </div>

    {:else if currentStep === 4}
      <h2>Choose Proficiencies</h2>
      <ProficiencySelector
        abilities={character.adjustedAbilities}
        cls={{ ...character.cls, key: character.classKey }}
        onComplete={handleProficienciesComplete}
      />

    {:else if currentStep === 5}
      <h2>Buy Equipment</h2>
      <EquipmentSelector
        cls={{ ...character.cls, key: character.classKey }}
        weaponProficiencies={character.proficiencies.weapons}
        onComplete={handleEquipmentComplete}
      />

    {:else if currentStep === 6}
      <h2>Spells</h2>
      <SpellSelector
        classKey={character.classKey}
        wizardSchool={character.wizardSchool}
        abilities={character.adjustedAbilities}
        onComplete={handleSpellsComplete}
      />

    {:else if currentStep === 7}
      <h2>Backstory</h2>
      <BackstoryEditor
        {character}
        onComplete={handleBackstoryComplete}
      />

    {:else if currentStep === 8}
      <CharacterSheet {character} />
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

  // School Selection
  .school-selection {
    width: 100%;

    h4 {
      text-align: center;
      margin: 0 0 1rem;
      font-size: 1.1rem;
      color: var(--text-body);
    }
  }

  .school-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }

  .school-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-input);
    border: 2px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;

    .school-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .school-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    &:hover:not(.disabled) {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }

    &.selected {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.15);
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
</style>
