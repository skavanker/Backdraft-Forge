<script>
  import { getCharacterWarnings } from '../data/classes.js';
  import { getConstitutionModifiers } from '../data/mechanics.js';

  let { character, onContinue } = $props();

  // Initialize hpHistory with max HP at level 1 (standard 2E: max die at first level)
  function initHPHistory() {
    if (!character.hpHistory || character.hpHistory.length === 0) {
      const hitDie = character.cls.hitDie;
      const match = hitDie.match(/d(\d+)/);
      const dieMax = match ? parseInt(match[1]) : 4;
      const conMods = getConstitutionModifiers(character.adjustedAbilities.CON, character.cls.group);
      const total = Math.max(1, dieMax + conMods.hpAdj);
      character.hpHistory = [{ level: 1, roll: dieMax, conMod: conMods.hpAdj, total }];
    }
  }

  // Run on mount
  initHPHistory();
</script>

<div class="character-review">
  <div class="review-header">
    <span class="review-race">{character.race.name}</span>
    <span>
      {#if character.kit}
        {character.kit.name}
      {:else if character.wizardSchool}
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
            <span class="meta-text">{ability}</span>
            <span class="text-xl">
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
        {#if character.kit}
          <div class="info-row">
            <span>Kit</span>
            <span>{character.kit.name}</span>
          </div>
          <div class="info-row">
            <span>Base Class</span>
            <span>{character.cls.name}</span>
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
    onclick={onContinue}
  >
    Continue to Proficiencies
  </button>
</div>

<style lang="scss">
  @import '../styles/mixins.scss';

  .ability-summary {
    display: flex;
    justify-content: center;
    gap: $space-md;
    flex-wrap: wrap;
  }

  .ability-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $space-sm $space-md;
    background: rgba(201, 162, 39, 0.15);
    border: 1px solid rgba(201, 162, 39, 0.3);
    border-radius: 4px;
    min-width: 50px;
  }

  .character-review {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
    align-items: center;

    .btn-primary {
      margin-top: $space-md;
    }
  }

  .review-header {
    display: flex;
    justify-content: center;
    gap: $space-sm;
    width: 100%;

    .review-race {
      color: var(--text-muted);
    }
  }

  .review-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $space-lg;
    width: 100%;
  }

  .review-section {
    padding: $space-md;
    background: var(--bg-panel);
    border-radius: 4px;

    h4 {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: $space-xs;
    }
  }

  .info-list {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
  }

  .info-row {
    display: flex;
    justify-content: space-between;

    &.highlight span:last-child {
      color: var(--green);
    }

    &.warning span:last-child {
      color: var(--gold-dark);
    }
  }

  .review-warnings {
    width: 100%;
    margin-top: $space-sm;
  }

  .review-warning {
    display: flex;
    align-items: flex-start;
    gap: $space-sm;
    padding: $space-sm;
    border-radius: 4px;
    margin-bottom: $space-xs;

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
      color: var(--red);
      border-left: 3px solid var(--red);
    }
  }
</style>
