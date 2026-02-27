<script>
  import { getCharacterWarnings } from '../data/classes.js';
  import { getConstitutionModifiers } from '../data/mechanics.js';
  import { applyRacialAdjustments } from '../data/races.js';
  import AbilityBadge from './components/AbilityBadge.svelte';
  import { onMount } from 'svelte';
  import { isTyping } from './utils/keyboard.js';
  import { ABILITIES } from '../data/constants.js';

  let { character, onContinue } = $props();

  // Initialize hpHistory with max HP at level 1 (standard 2E: max die at first level)
  function initHPHistory() {
    if (!character.hpHistory || character.hpHistory.length === 0) {
      recalcHP();
    }
  }

  function recalcHP() {
    const hitDie = character.cls.hitDie;
    const match = hitDie.match(/d(\d+)/);
    const dieMax = match ? parseInt(match[1]) : 4;
    const conMods = getConstitutionModifiers(character.adjustedAbilities.CON, character.cls.group);
    const total = Math.max(1, dieMax + conMods.hpAdj);
    character.hpHistory = [{ level: 1, roll: dieMax, conMod: conMods.hpAdj, total }];
  }

  function applySwap(a, b) {
    // Swap base abilities
    const tmp = character.abilities[a];
    character.abilities[a] = character.abilities[b];
    character.abilities[b] = tmp;

    // Recompute adjusted abilities — mutate in-place for reactivity
    const fresh = applyRacialAdjustments(character.abilities, character.race);
    for (const key of Object.keys(fresh)) {
      character.adjustedAbilities[key] = fresh[key];
    }

    // Recalculate HP in case CON changed
    recalcHP();
  }

  // Run on mount
  initHPHistory();

  function handleKeydown(e) {
    if (isTyping() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      onContinue();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
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
        {#each ABILITIES as ability}
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
          <span>Hit Points</span>
          <span>
            {#if character.hpHistory?.[0]}
              {@const hp = character.hpHistory[0]}
              {character.cls.hitDie} (max){#if hp.conMod !== 0}{hp.conMod > 0 ? ` + ${hp.conMod}` : ` − ${Math.abs(hp.conMod)}`} CON{/if} = {hp.total}
            {:else}
              {character.cls.hitDie}
            {/if}
          </span>
        </div>
        <div class="info-row">
          <span>Key Ability</span>
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

    {#if character.race?.traits?.length > 0 && character.race.name !== 'Human'}
      <div class="review-section panel">
        <h4>Racial Traits</h4>
        <ul class="traits-list">
          {#each character.race.traits as trait}
            <li>{trait}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  {#if character.cls}
    {@const reviewWarnings = getCharacterWarnings(character.adjustedAbilities, character.cls, character.classKey, character.race, character.raceKey)}
    {#if reviewWarnings.length > 0}
      <div class="review-warnings">
        <h4>Advisory</h4>
        {#each reviewWarnings as warning}
          {#if warning.swap}
            <button
              class="review-warning {warning.severity} clickable"
              onclick={() => applySwap(warning.swap.a, warning.swap.b)}
            >
              <span class="warning-icon">&#x1F4A1;</span>
              <span>{warning.message}</span>
            </button>
          {:else}
            <div class="review-warning {warning.severity}">
              <span class="warning-icon">
                {#if warning.severity === 'suggestion'}
                  &#x1F4A1;
                {:else if warning.severity === 'concern'}
                  &#x26A0;
                {:else}
                  &#x25B3;
                {/if}
              </span>
              <span>{warning.message}</span>
            </div>
          {/if}
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
