<script>
  import { getSpellSlots, formatSpellSlots, getAttacksPerRound, isPastNameLevel, getPostNameHP } from '../data/levelTables.js';
  import { getNewFeaturesAtLevel, gainsWeaponProficiency, gainsNonWeaponProficiency } from '../data/classFeatures.js';
  import { isSpellcaster } from '../data/spells.js';
  import { getSavingThrows, getBaseTHAC0 } from '../data/mechanics.js';
  import { getThiefSkillBreakdown, THIEF_POINTS_PER_LEVEL } from '../data/thiefSkills.js';
  import { parseDieMax } from './utils/hpUtils.js';
  import { getClassKey, getClassGroup, getHitDie } from './utils/characterAccessors.js';
  import HPRollStep from './components/HPRollStep.svelte';
  import ThiefSkillsStep from './components/ThiefSkillsStep.svelte';
  import SpellSlotsStep from './components/SpellSlotsStep.svelte';
  import FeaturesStep from './components/FeaturesStep.svelte';

  let { character, onComplete, onCancel } = $props();

  let currentLevel = character.level || 1;
  let newLevel = currentLevel + 1;

  // Steps
  const STEP_SUMMARY = 0;
  const STEP_HP = 1;
  const STEP_THIEF_SKILLS = 2;
  const STEP_SPELLS = 3;
  const STEP_PROFICIENCIES = 4;
  const STEP_FEATURES = 5;
  const STEP_CONFIRM = 6;

  let step = $state(STEP_SUMMARY);

  // HP roll state
  let hpRolled = $state(false);
  let hpRoll = $state(0);
  let hpConMod = $state(0);
  let hpTotal = $state(0);

  // Derived data
  let classKey = getClassKey(character);
  let classGroup = getClassGroup(character);
  let hitDie = getHitDie(character);
  let dieMax = parseDieMax(hitDie);

  // Map hit die to SVG die type: d4→d4, d6→d6, d8/d10/d12→d20
  let dieSvgType = dieMax <= 4 ? 'd4' : dieMax <= 6 ? 'd6' : 'd20';
  let dieSvgMax = dieMax <= 4 ? 4 : dieMax <= 6 ? 6 : 20;

  // Check what this level grants
  let newFeatures = getNewFeaturesAtLevel(classKey, newLevel);
  let gainsWeaponProf = gainsWeaponProficiency(classGroup, newLevel);
  let gainsNonWeaponProf = gainsNonWeaponProficiency(classGroup, newLevel);
  let becomesCaster = isSpellcaster(classKey, newLevel) && !isSpellcaster(classKey, currentLevel);
  let newSpellSlots = getSpellSlots(classKey, newLevel);
  let oldSpellSlots = getSpellSlots(classKey, currentLevel);
  let hasNewSpellSlots = newSpellSlots && newSpellSlots.some((s, i) => s > (oldSpellSlots?.[i] || 0));

  // Saving throws comparison
  let oldSaves = getSavingThrows(classGroup, currentLevel);
  let newSaves = getSavingThrows(classGroup, newLevel);
  let savesImproved = Object.keys(newSaves).some(k => newSaves[k] < oldSaves[k]);

  // THAC0 comparison
  let oldTHAC0 = getBaseTHAC0(classGroup, currentLevel);
  let newTHAC0 = getBaseTHAC0(classGroup, newLevel);

  // Attacks per round
  let oldAttacks = getAttacksPerRound(classGroup, currentLevel);
  let newAttacks = getAttacksPerRound(classGroup, newLevel);

  // Thief skills
  let isThiefClass = classKey === 'thief' || classKey === 'bard';
  let thiefPointsRemaining = $state(THIEF_POINTS_PER_LEVEL);
  let thiefDistributed = $state(isThiefClass ? { ...(character.thiefSkills || {}) } : {});
  let thiefNewPoints = $state({});
  let thiefBreakdown = isThiefClass
    ? getThiefSkillBreakdown(character.raceKey, character.adjustedAbilities.DEX, classKey, newLevel)
    : { base: {}, racial: {}, dex: {}, total: {} };
  let thiefBase = thiefBreakdown.total;

  // Filter available skills - Read Languages only available at level 4+
  let availableThiefSkills = $derived(
    Object.keys(thiefBase).filter(skill => newLevel >= 4 || skill !== 'readLanguages')
  );


  // Figure out which steps to show
  let steps = $derived.by(() => {
    const s = [STEP_SUMMARY, STEP_HP];
    if (isThiefClass) s.push(STEP_THIEF_SKILLS);
    if (hasNewSpellSlots || becomesCaster) s.push(STEP_SPELLS);
    if (gainsWeaponProf || gainsNonWeaponProf) s.push(STEP_PROFICIENCIES);
    if (newFeatures.length > 0 || savesImproved || newTHAC0 < oldTHAC0) s.push(STEP_FEATURES);
    s.push(STEP_CONFIRM);
    return s;
  });

  let stepIndex = $state(0);

  // Auto-set fixed HP for post-name levels (using $effect to prevent re-initialization)
  let hpInitialized = $state(false);
  $effect(() => {
    if (!hpInitialized && isPastNameLevel(classKey, newLevel)) {
      hpRoll = getPostNameHP(classKey);
      hpConMod = 0;
      hpTotal = hpRoll;
      hpRolled = true;
      hpInitialized = true;
    }
  });

  function nextStep() {
    if (stepIndex < steps.length - 1) {
      stepIndex++;
      step = steps[stepIndex];
    }
  }

  function prevStep() {
    if (stepIndex > 0) {
      stepIndex--;
      step = steps[stepIndex];
    }
  }


  function confirmLevelUp() {
    const newHpEntry = {
      level: newLevel,
      roll: hpRoll,
      conMod: hpConMod,
      total: hpTotal,
    };

    const updates = {
      level: newLevel,
      hpHistory: [...(character.hpHistory || []), newHpEntry],
    };

    // Include updated thief skills if applicable
    if (isThiefClass) {
      updates.thiefSkills = { ...thiefDistributed };
    }

    onComplete(updates);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="overlay" onkeydown={(e) => e.key === 'Escape' && onCancel()}>
  <div class="wizard-modal" role="dialog" aria-label="Level Up">
    <button class="close-btn" onclick={onCancel} aria-label="Close level up">&times;</button>

    <div class="wizard-header">
      <h2>Level Up!</h2>
      <div class="level-badge">{currentLevel} → {newLevel}</div>
    </div>

    {#if step === STEP_SUMMARY}
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
        <button class="btn-primary" onclick={nextStep}>Continue</button>
      </div>

    {:else if step === STEP_HP}
      <HPRollStep
        {character}
        {newLevel}
        {classKey}
        {classGroup}
        {hitDie}
        {dieMax}
        {dieSvgType}
        {dieSvgMax}
        bind:hpRolled
        bind:hpRoll
        bind:hpConMod
        bind:hpTotal
        onNext={nextStep}
        onPrev={prevStep}
      />

    {:else if step === STEP_THIEF_SKILLS}
      <ThiefSkillsStep
        thiefBase={thiefBase}
        {thiefBreakdown}
        {availableThiefSkills}
        bind:thiefPointsRemaining
        bind:thiefDistributed
        bind:thiefNewPoints
        onNext={nextStep}
        onPrev={prevStep}
      />

    {:else if step === STEP_SPELLS}
      <SpellSlotsStep
        {classKey}
        {becomesCaster}
        {newSpellSlots}
        {oldSpellSlots}
        onNext={nextStep}
        onPrev={prevStep}
      />

    {:else if step === STEP_PROFICIENCIES}
      <div class="levelup-step">
        <h3>New Proficiency Slots</h3>
        <div class="flex-column gap-sm">
          {#if gainsWeaponProf}
            <div class="prof-gain">+1 Weapon Proficiency Slot</div>
          {/if}
          {#if gainsNonWeaponProf}
            <div class="prof-gain">+1 Non-Weapon Proficiency Slot</div>
          {/if}
        </div>
        <p class="meta-text">Go to the Proficiencies tab after leveling up to pick your new proficiencies.</p>

        <div class="step-nav">
          <button class="btn-ghost" onclick={prevStep}>Back</button>
          <button class="btn-primary" onclick={nextStep}>Continue</button>
        </div>
      </div>

    {:else if step === STEP_FEATURES}
      <FeaturesStep
        {newTHAC0}
        {oldTHAC0}
        {newAttacks}
        {oldAttacks}
        {savesImproved}
        {newSaves}
        {oldSaves}
        {newFeatures}
        onNext={nextStep}
        onPrev={prevStep}
      />

    {:else if step === STEP_CONFIRM}
      <div class="levelup-step">
        <h3>Confirm Level Up</h3>
        <div class="confirm-summary">
          <div class="confirm-row"><span>New Level</span> <span>{newLevel}</span></div>
          <div class="confirm-row"><span>HP Gained</span> <span>+{hpTotal}</span></div>
          {#if newTHAC0 < oldTHAC0}
            <div class="confirm-row"><span>THAC0</span> <span>{newTHAC0}</span></div>
          {/if}
          {#if hasNewSpellSlots}
            <div class="confirm-row"><span>Spell Slots</span> <span>{formatSpellSlots(newSpellSlots)}</span></div>
          {/if}
          {#if isThiefClass}
            <div class="confirm-row"><span>Skill Points</span> <span>{THIEF_POINTS_PER_LEVEL} distributed</span></div>
          {/if}
        </div>

        <div class="step-nav">
          <button class="btn-ghost" onclick={prevStep}>Back</button>
          <button class="btn-primary btn-confirm" onclick={confirmLevelUp}>Confirm Level Up!</button>
        </div>
      </div>
    {/if}

    <!-- Step indicators -->
    <div class="step-dots">
      {#each steps as s, i}
        <div class="dot" class:active={i === stepIndex} class:completed={i < stepIndex}></div>
      {/each}
    </div>
  </div>
</div>


<style lang="scss">
  @import './styles/shared';
  @import './styles/levelup';
</style>

