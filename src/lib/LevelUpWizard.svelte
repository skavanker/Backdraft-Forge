<script>
  import { getSpellSlots, formatSpellSlots, getAttacksPerRound, isPastNameLevel, getPostNameHP } from '../data/levelTables.js';
  import { getNewFeaturesAtLevel, gainsWeaponProficiency, gainsNonWeaponProficiency } from '../data/classFeatures.js';
  import { isSpellcaster } from '../data/spells.js';
  import { getSavingThrows, getBaseTHAC0 } from '../data/mechanics.js';
  import { getThiefSkillBreakdown, THIEF_POINTS_PER_LEVEL } from '../data/thiefSkills.js';
  import { parseDieMax } from './utils/hpUtils.js';
  import { getClassKey, getClassGroup, getHitDie } from './utils/characterAccessors.js';
  import StepModal from './components/StepModal.svelte';
  import SummaryStep from './components/steps/SummaryStep.svelte';
  import ConfirmStep from './components/steps/ConfirmStep.svelte';
  import ProficienciesStep from './components/steps/ProficienciesStep.svelte';
  import HPRollStep from './components/HPRollStep.svelte';
  import ThiefSkillsStep from './components/ThiefSkillsStep.svelte';
  import SpellSlotsStep from './components/SpellSlotsStep.svelte';
  import FeaturesStep from './components/FeaturesStep.svelte';

  let { character, onComplete, onCancel } = $props();

  let currentLevel = character.level || 1;
  let newLevel = currentLevel + 1;

  // Modal state
  let isOpen = $state(true);
  let currentStepIndex = $state(0);

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

  // Build steps array dynamically based on what this level grants
  let wizardSteps = $derived.by(() => {
    const steps = [
      {
        id: 'summary',
        label: 'Summary',
        component: SummaryStep,
        props: {
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
        },
        condition: true,
      },
      {
        id: 'hp',
        label: 'HP Roll',
        component: HPRollStep,
        props: {
          character,
          newLevel,
          classKey,
          classGroup,
          hitDie,
          dieMax,
          dieSvgType,
          dieSvgMax,
          get hpRolled() { return hpRolled; },
          set hpRolled(val) { hpRolled = val; },
          get hpRoll() { return hpRoll; },
          set hpRoll(val) { hpRoll = val; },
          get hpConMod() { return hpConMod; },
          set hpConMod(val) { hpConMod = val; },
          get hpTotal() { return hpTotal; },
          set hpTotal(val) { hpTotal = val; },
        },
        condition: true,
      },
      {
        id: 'thief-skills',
        label: 'Thief Skills',
        component: ThiefSkillsStep,
        props: {
          thiefBase: thiefBase,
          thiefBreakdown,
          availableThiefSkills,
          get thiefPointsRemaining() { return thiefPointsRemaining; },
          set thiefPointsRemaining(val) { thiefPointsRemaining = val; },
          get thiefDistributed() { return thiefDistributed; },
          set thiefDistributed(val) { thiefDistributed = val; },
          get thiefNewPoints() { return thiefNewPoints; },
          set thiefNewPoints(val) { thiefNewPoints = val; },
        },
        condition: isThiefClass,
      },
      {
        id: 'spells',
        label: 'Spell Slots',
        component: SpellSlotsStep,
        props: {
          classKey,
          becomesCaster,
          newSpellSlots,
          oldSpellSlots,
        },
        condition: hasNewSpellSlots || becomesCaster,
      },
    ];

    // Add proficiencies step if applicable
    if (gainsWeaponProf || gainsNonWeaponProf) {
      steps.push({
        id: 'proficiencies',
        label: 'Proficiencies',
        component: ProficienciesStep,
        props: {
          gainsWeaponProf,
          gainsNonWeaponProf,
        },
        condition: true,
      });
    }

    // Add features step if applicable
    if (newFeatures.length > 0 || savesImproved || newTHAC0 < oldTHAC0) {
      steps.push({
        id: 'features',
        label: 'Features',
        component: FeaturesStep,
        props: {
          newTHAC0,
          oldTHAC0,
          newAttacks,
          oldAttacks,
          savesImproved,
          newSaves,
          oldSaves,
          newFeatures,
        },
        condition: true,
      });
    }

    // Always add confirm step
    steps.push({
      id: 'confirm',
      label: 'Confirm',
      component: ConfirmStep,
      props: {
        newLevel,
        get hpTotal() { return hpTotal; },
        oldTHAC0,
        newTHAC0,
        hasNewSpellSlots,
        newSpellSlots,
        isThiefClass,
        onConfirm: confirmLevelUp,
      },
      condition: true,
    });

    return steps;
  });

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

  function handleClose() {
    isOpen = false;
    onCancel();
  }
</script>

<StepModal
  bind:isOpen
  bind:currentStepIndex
  title="Level Up!"
  subtitle="{currentLevel} → {newLevel}"
  mode="linear"
  steps={wizardSteps}
  onClose={handleClose}
  onComplete={confirmLevelUp}
  maxWidth="520px"
  showProgress={true}
/>

<style lang="scss">
  @import './styles/shared';
  @import './styles/levelup';
</style>
