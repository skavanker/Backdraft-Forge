<script>
  import { getCharacterWarnings } from '../data/classes.js';
  import { getConstitutionModifiers } from '../data/mechanics.js';
  import { applyRacialAdjustments } from '../data/races.js';
  import { formatSpeciesEnemy } from '../data/speciesEnemies.js';
  import AbilityBadge from './components/AbilityBadge.svelte';
  import { isTyping, useGlobalKeydown } from './utils/keyboard.js';
  import { ABILITIES } from '../data/constants.js';
  import { getBaseThiefSkills, getThiefSkillBreakdown, SKILL_LABELS, THIEF_SKILL_CAP, THIEF_INITIAL_POINTS } from '../data/thiefSkills.js';
  import { rollExceptionalStrength } from './dice.js';
  import { getClassKey, getClassGroup, isWarrior } from './utils/characterAccessors.js';

  let { character, onContinue } = $props();

  // Thief skills setup
  const isThiefClass = getClassKey(character) === 'thief' || getClassKey(character) === 'bard';
  let thiefBreakdown = isThiefClass
    ? getThiefSkillBreakdown(character.raceKey, character.adjustedAbilities.DEX, getClassKey(character), 1)
    : { base: {}, racial: {}, dex: {}, total: {} };
  let thiefBase = thiefBreakdown.total;

  // Filter available skills - Read Languages not available until level 4
  const availableSkills = Object.keys(thiefBase).filter(skill => skill !== 'readLanguages');

  const existingSkills = character.thiefSkills || {};
  const existingTotal = Object.values(existingSkills).reduce((sum, val) => sum + val, 0);

  let thiefPointsRemaining = $state(THIEF_INITIAL_POINTS - existingTotal);
  let thiefDistributed = $state({ ...existingSkills });

  // Exceptional strength for warriors with 18 STR
  const isWarriorClass = isWarrior(character);
  const has18Str = character.abilities.STR === 18;
  const needsExceptionalStr = isWarriorClass && has18Str;
  let exceptionalStrRolled = $state(character.abilities.exceptionalStr || null);
  let showExceptionalStrRoll = $state(needsExceptionalStr && !exceptionalStrRolled);

  function rollExceptionalStr() {
    exceptionalStrRolled = rollExceptionalStrength();
    showExceptionalStrRoll = false;
  }

  function skipExceptionalStr() {
    exceptionalStrRolled = null;
    showExceptionalStrRoll = false;
  }

  function addThiefPoints(skill, amount) {
    const currentDistributed = thiefDistributed[skill] || 0;
    const baseVal = thiefBase[skill] || 0;
    const currentTotal = baseVal + currentDistributed;

    const maxAdd = Math.min(amount, THIEF_SKILL_CAP - currentTotal, thiefPointsRemaining);
    if (maxAdd <= 0) return;

    thiefDistributed = { ...thiefDistributed, [skill]: currentDistributed + maxAdd };
    thiefPointsRemaining -= maxAdd;
  }

  function removeThiefPoints(skill, amount) {
    const currentDistributed = thiefDistributed[skill] || 0;
    const remove = Math.min(amount, currentDistributed);
    if (remove <= 0) return;

    thiefDistributed = { ...thiefDistributed, [skill]: currentDistributed - remove };
    thiefPointsRemaining += remove;
  }

  let canContinue = $derived(
    (!isThiefClass || thiefPointsRemaining === 0) &&
    (!needsExceptionalStr || exceptionalStrRolled !== null)
  );

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
    const conMods = getConstitutionModifiers(character.adjustedAbilities.CON, getClassGroup(character));
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

  function handleContinue() {
    if (isThiefClass) {
      character.thiefSkills = thiefDistributed;
    }
    if (needsExceptionalStr) {
      character.abilities.exceptionalStr = exceptionalStrRolled;
    }
    onContinue();
  }

  useGlobalKeydown((e) => {
    if (isTyping() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Enter' && canContinue) {
      e.preventDefault();
      handleContinue();
    }
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
        <div class="data-row">
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
        <div class="data-row">
          <span>Key Ability</span>
          <span>{character.cls.primeRequisite.join(', ')}</span>
        </div>
        {#if character.wizardSchool}
          <div class="data-row">
            <span>School</span>
            <span>{character.wizardSchool.school}</span>
          </div>
          <div class="data-row warning">
            <span>Cannot Cast</span>
            <span>{character.wizardSchool.oppositionSchools.join(', ')}</span>
          </div>
        {/if}
        {#if character.kit}
          <div class="data-row">
            <span>Kit</span>
            <span>{character.kit.name}</span>
          </div>
          <div class="data-row">
            <span>Base Class</span>
            <span>{character.cls.name}</span>
          </div>
        {/if}
        {#if character.speciesEnemy}
          <div class="data-row">
            <span>Species Enemy</span>
            <span>{formatSpeciesEnemy(character.speciesEnemy)} (+4 to hit)</span>
          </div>
        {/if}
        {#if character.xpBonus > 0}
          <div class="data-row highlight">
            <span>XP Bonus</span>
            <span>+{character.xpBonus}%</span>
          </div>
        {/if}
        {#if character.levelLimit}
          <div class="data-row warning">
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

  {#if needsExceptionalStr}
    <div class="exceptional-str-section">
      <h4>⚔️ Exceptional Strength</h4>
      <p class="alert alert-info">
        Your {character.cls.name} has 18 Strength! Roll d100 for exceptional strength (18/XX).
      </p>

      {#if showExceptionalStrRoll}
        <div class="exceptional-roll-area">
          <button class="btn-primary" onclick={rollExceptionalStr}>
            🎲 Roll for 18/XX
          </button>
          <button class="btn-secondary" onclick={skipExceptionalStr}>
            Skip
          </button>
        </div>
      {:else if exceptionalStrRolled !== null}
        <div class="exceptional-result panel">
          <p>You rolled: <strong>18/{exceptionalStrRolled.toString().padStart(2, '0')}</strong></p>
        </div>
      {:else}
        <div class="exceptional-result panel">
          <p>Exceptional strength skipped — your STR is 18.</p>
        </div>
      {/if}
    </div>
  {/if}

  {#if isThiefClass}
    <div class="thief-skills-section">
      <h4>Distribute Thief Skills</h4>
      <p class="alert alert-info">
        You have <strong>{thiefPointsRemaining}</strong> of {THIEF_INITIAL_POINTS} discretionary points to distribute.
        {#if thiefPointsRemaining > 0}
          <span style="color: var(--color-warning);">You must distribute all points before continuing.</span>
        {/if}
      </p>

      <div class="thief-skills-grid">
        {#each availableSkills as skill}
          {@const baseVal = thiefBase[skill]}
          {@const dist = thiefDistributed[skill] || 0}
          {@const total = baseVal + dist}
          {@const atCap = total >= THIEF_SKILL_CAP}
          {@const canAdd = thiefPointsRemaining > 0 && !atCap}
          {@const canRemove = dist > 0}
          {@const rawBase = thiefBreakdown.base[skill] || 0}
          {@const racialAdj = thiefBreakdown.racial[skill] || 0}
          {@const dexAdj = thiefBreakdown.dex[skill] || 0}
          <button
            class="thief-skill-row panel"
            class:at-cap={atCap}
            class:has-points={dist > 0}
            onclick={() => canAdd && addThiefPoints(skill, 5)}
            oncontextmenu={(e) => { e.preventDefault(); canRemove && removeThiefPoints(skill, 5); }}
            onkeydown={(e) => { if (e.key === 'Backspace' && canRemove) { e.preventDefault(); removeThiefPoints(skill, 5); } }}
            disabled={!canAdd && !canRemove}
          >
            <span class="skill-name">{SKILL_LABELS[skill]}</span>
            <div class="skill-breakdown">
              <span class="breakdown-item">Base: {rawBase}%</span>
              {#if racialAdj !== 0}
                <span class="breakdown-item race">Race: {racialAdj >= 0 ? '+' : ''}{racialAdj}%</span>
              {/if}
              {#if dexAdj !== 0}
                <span class="breakdown-item dex">DEX: {dexAdj >= 0 ? '+' : ''}{dexAdj}%</span>
              {/if}
              {#if dist > 0}
                <span class="breakdown-item distributed">Points: +{dist}%</span>
              {/if}
            </div>
            <span class="skill-total" class:at-cap={atCap}>{total}%</span>
          </button>
        {/each}
      </div>
      <p class="meta-text" style="text-align: center;">
        Left-click to add 5 points • Right-click to remove 5 points
      </p>
    </div>
  {/if}

  <button
    class="btn-primary"
    onclick={handleContinue}
    disabled={!canContinue}
  >
    Continue to Proficiencies
  </button>
</div>


<style lang="scss">@import './styles/shared'; @import './styles/review';</style>
