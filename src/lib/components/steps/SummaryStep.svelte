<script>
  import { isPastNameLevel, getPostNameHP, getAttacksPerRound } from '../../../data/levelTables.js';
  import { THIEF_POINTS_PER_LEVEL } from '../../../data/thiefSkills.js';

  let {
    character,
    currentLevel,
    newLevel,
    classKey,
    hitDie,
    oldTHAC0,
    newTHAC0,
    oldAttacks,
    newAttacks,
    savesImproved,
    hasNewSpellSlots,
    becomesCaster,
    isThiefClass,
    gainsWeaponProf,
    gainsNonWeaponProf,
    newFeatures,
    onNext,
  } = $props();
</script>

<div class="levelup-step">
  <h3>{character.name} has reached Level {newLevel}!</h3>
  <div class="summary-grid">
    <div class="summary-item panel">
      <span class="label">Class</span>
      <span>{character.wizardSchool?.name || character.cls.name}</span>
    </div>
    <div class="summary-item panel">
      <span class="label">HP</span>
      <span>{isPastNameLevel(classKey, newLevel) ? `+${getPostNameHP(classKey)} (fixed)` : `Roll ${hitDie}`}</span>
    </div>
    {#if newTHAC0 < oldTHAC0}
      <div class="summary-item improved">
        <span class="label">THAC0</span>
        <span>{oldTHAC0} → {newTHAC0}</span>
      </div>
    {/if}
    {#if savesImproved}
      <div class="summary-item improved">
        <span class="label">Saving Throws</span>
        <span>Improved!</span>
      </div>
    {/if}
    {#if hasNewSpellSlots || becomesCaster}
      <div class="summary-item improved">
        <span class="label">Spell Slots</span>
        <span>{becomesCaster ? 'Gained!' : 'Expanded!'}</span>
      </div>
    {/if}
    {#if isThiefClass}
      <div class="summary-item improved">
        <span class="label">Thief Skills</span>
        <span>+{THIEF_POINTS_PER_LEVEL} points</span>
      </div>
    {/if}
    {#if gainsWeaponProf}
      <div class="summary-item improved">
        <span class="label">Weapon Prof.</span>
        <span>+1 slot</span>
      </div>
    {/if}
    {#if gainsNonWeaponProf}
      <div class="summary-item improved">
        <span class="label">Non-Weapon Prof.</span>
        <span>+1 slot</span>
      </div>
    {/if}
    {#if newAttacks !== oldAttacks}
      <div class="summary-item improved">
        <span class="label">Attacks/Round</span>
        <span>{oldAttacks} → {newAttacks}</span>
      </div>
    {/if}
    {#each newFeatures as feature}
      <div class="summary-item improved">
        <span class="label">New Ability</span>
        <span>{feature}</span>
      </div>
    {/each}
  </div>
  <button class="btn-primary" onclick={onNext}>Continue</button>
</div>
