<script>
  import { getCharacterWarnings } from '../data/classes.js';
  import { getConstitutionModifiers } from '../data/mechanics.js';
  import AbilityBadge from './components/AbilityBadge.svelte';

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

<div class="flex-column gap-lg" style="align-items:center">
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
    <div class="review-section panel">
      <h4>Ability Scores</h4>
      <div class="ability-summary">
        {#each ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as ability}
          <AbilityBadge
            {ability}
            score={character.adjustedAbilities[ability]}
            exceptionalStr={ability === 'STR' ? character.abilities.exceptionalStr : null}
            variant="simple"
          />
        {/each}
      </div>
    </div>

    <div class="review-section panel">
      <h4>Class Info</h4>
      <div class="flex-column gap-sm">
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
  @import './styles/shared';
  @import './styles/review';
</style>

