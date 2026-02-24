<script>
  import { getCharacterWarnings } from '../data/classes.js';

  let { character, onContinue } = $props();
</script>

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
    onclick={onContinue}
  >
    Continue to Proficiencies
  </button>
</div>

<style lang="scss">
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
      color: var(--green);
    }

    &.warning span:last-child {
      color: var(--gold-dark);
    }
  }

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
      color: var(--red);
      border-left: 3px solid var(--red);
    }
  }
</style>
