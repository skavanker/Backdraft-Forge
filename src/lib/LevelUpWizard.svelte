<script>
  import { getConstitutionModifiers } from '../data/mechanics.js';
  import { isPastNameLevel, getPostNameHP, getSpellSlots, getXPForNextLevel, formatSpellSlots, getAttacksPerRound } from '../data/levelTables.js';
  import { getNewFeaturesAtLevel, gainsWeaponProficiency, gainsNonWeaponProficiency } from '../data/classFeatures.js';
  import { isSpellcaster } from '../data/spells.js';
  import { getSavingThrows, getBaseTHAC0 } from '../data/mechanics.js';
  import { getBaseThiefSkills, applyDistributedPoints, SKILL_LABELS } from '../data/thiefSkills.js';

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
  let isPostName = $state(false);
  let diceAnimating = $state(false);
  let animDieFace = $state(1); // 1-6 for SVG dice during animation

  // Derived data
  let classKey = character.classKey;
  let classGroup = character.cls.group;
  let hitDie = character.cls.hitDie;
  let dieMax = parseInt(hitDie.match(/d(\d+)/)?.[1] || '4');

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
  let THIEF_POINTS_PER_LEVEL = 30;
  let thiefPointsRemaining = $state(THIEF_POINTS_PER_LEVEL);
  // Start from existing distributed points
  let thiefDistributed = $state(isThiefClass ? { ...(character.thiefSkills || {}) } : {});
  // New points added this level (track separately so we know what was just allocated)
  let thiefNewPoints = $state({});
  let thiefBase = isThiefClass
    ? getBaseThiefSkills(character.raceKey, character.adjustedAbilities.DEX, classKey, newLevel)
    : {};
  // Max any skill can reach
  const SKILL_CAP = 95;

  function addThiefPoints(skill, amount) {
    const existingDistributed = (thiefDistributed[skill] || 0);
    const baseVal = thiefBase[skill] || 0;
    const currentTotal = baseVal + existingDistributed;
    // Can't exceed 95%
    const maxAdd = Math.min(amount, SKILL_CAP - currentTotal, thiefPointsRemaining);
    if (maxAdd <= 0) return;

    thiefDistributed = { ...thiefDistributed, [skill]: existingDistributed + maxAdd };
    thiefNewPoints = { ...thiefNewPoints, [skill]: (thiefNewPoints[skill] || 0) + maxAdd };
    thiefPointsRemaining -= maxAdd;
  }

  function removeThiefPoints(skill, amount) {
    const newPts = thiefNewPoints[skill] || 0;
    const remove = Math.min(amount, newPts);
    if (remove <= 0) return;

    thiefDistributed = { ...thiefDistributed, [skill]: (thiefDistributed[skill] || 0) - remove };
    thiefNewPoints = { ...thiefNewPoints, [skill]: newPts - remove };
    thiefPointsRemaining += remove;
  }

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

  // Auto-set fixed HP for post-name levels
  if (isPastNameLevel(classKey, newLevel)) {
    hpRoll = getPostNameHP(classKey);
    hpConMod = 0;
    hpTotal = hpRoll;
    hpRolled = true;
  }

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

  function rollHP() {
    isPostName = isPastNameLevel(classKey, newLevel);
    const conMods = getConstitutionModifiers(character.adjustedAbilities.CON, classGroup);

    if (isPostName) {
      // Post name level: fixed HP, no CON bonus
      hpRoll = getPostNameHP(classKey);
      hpConMod = 0;
      hpTotal = hpRoll;
    } else {
      // Normal: roll hit die + CON mod
      hpConMod = conMods.hpAdj;
      diceAnimating = true;

      // Animate the dice — starts fast, decelerates like a real die settling
      // Total duration ~3.5 seconds
      const totalFrames = 16;
      let frame = 0;

      function tick() {
        animDieFace = Math.floor(Math.random() * 6) + 1;
        hpRoll = Math.floor(Math.random() * dieMax) + 1;
        frame++;

        if (frame >= totalFrames) {
          // Final result
          hpRoll = Math.floor(Math.random() * dieMax) + 1;
          hpTotal = Math.max(1, hpRoll + hpConMod);
          hpRolled = true;
          diceAnimating = false;
          return;
        }

        // Decelerate: 80ms at start → 500ms near end
        const progress = frame / totalFrames;
        const delay = 80 + Math.pow(progress, 1.8) * 420;
        setTimeout(tick, delay);
      }

      setTimeout(tick, 80);
      return;
    }

    hpRolled = true;
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
    <button class="close-btn" onclick={onCancel}>&times;</button>

    <div class="wizard-header">
      <h2>Level Up!</h2>
      <div class="level-badge">{currentLevel} → {newLevel}</div>
    </div>

    {#if step === STEP_SUMMARY}
      <div class="wizard-step">
        <h3>{character.name} has reached Level {newLevel}!</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Class</span>
            <span>{character.wizardSchool?.name || character.cls.name}</span>
          </div>
          <div class="summary-item">
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
      <div class="wizard-step">
        {#if isPastNameLevel(classKey, newLevel)}
          <h3>Hit Points</h3>
          <p class="meta-text">Past name level — you gain a fixed +{getPostNameHP(classKey)} HP (no CON bonus).</p>
          <div class="hp-roll-area">
            <div class="hp-fixed-result">+{getPostNameHP(classKey)} HP</div>
          </div>
        {:else}
          <h3>Roll Hit Points</h3>
          <p class="meta-text">Roll {hitDie} + CON modifier ({getConstitutionModifiers(character.adjustedAbilities.CON, classGroup).hpAdj >= 0 ? '+' : ''}{getConstitutionModifiers(character.adjustedAbilities.CON, classGroup).hpAdj})</p>

          <div class="hp-roll-area">
            {#if !hpRolled && !diceAnimating}
              <button class="btn-roll" onclick={rollHP}>
                <img class="btn-roll-die" src="/dice/dice0{Math.floor(Math.random() * 6) + 1}.svg" alt="die" />
                Roll {hitDie}
              </button>
            {:else}
              <div class="dice-result" class:animating={diceAnimating}>
                {#if diceAnimating}
                  <div class="die-graphic">
                    <img src="/dice/dice0{animDieFace}.svg" alt="rolling..." />
                  </div>
                  <div class="die-value-preview">{hpRoll}</div>
                {:else}
                  <div class="die-graphic landed">
                    <img src="/dice/dice0{Math.min(hpRoll, 6)}.svg" alt="{hpRoll}" />
                  </div>
                  <div class="die-value-final">{hpRoll}</div>
                {/if}
              </div>
              {#if hpRolled}
                <div class="hp-breakdown">
                  <span class="hp-part"><span class="hp-label">Roll</span> {hpRoll}</span>
                  {#if hpConMod !== 0}
                    <span class="hp-part"><span class="hp-label">CON</span> {hpConMod >= 0 ? '+' : ''}{hpConMod}</span>
                  {/if}
                  <span class="hp-total">+{hpTotal} HP</span>
                </div>
              {/if}
            {/if}
          </div>
        {/if}

        <div class="step-nav">
          <button class="btn-ghost" onclick={prevStep}>Back</button>
          <button class="btn-primary" onclick={nextStep} disabled={!isPastNameLevel(classKey, newLevel) && !hpRolled}>Continue</button>
        </div>
      </div>

    {:else if step === STEP_THIEF_SKILLS}
      <div class="wizard-step">
        <h3>Distribute Thief Skill Points</h3>
        <p class="meta-text">You have <strong>{thiefPointsRemaining}</strong> of {THIEF_POINTS_PER_LEVEL} points to distribute.</p>

        <div class="thief-skills-grid">
          {#each Object.keys(thiefBase) as skill}
            {@const baseVal = thiefBase[skill]}
            {@const distributed = thiefDistributed[skill] || 0}
            {@const total = baseVal + distributed}
            {@const newPts = thiefNewPoints[skill] || 0}
            {@const atCap = total >= SKILL_CAP}
            <div class="thief-skill-row">
              <span class="skill-name">{SKILL_LABELS[skill]}</span>
              <span class="skill-total" class:at-cap={atCap}>{total}%</span>
              <div class="skill-controls">
                <button
                  class="skill-btn"
                  onclick={() => removeThiefPoints(skill, 5)}
                  disabled={newPts === 0}
                >-5</button>
                <span class="skill-new">{newPts > 0 ? `+${newPts}` : '—'}</span>
                <button
                  class="skill-btn"
                  onclick={() => addThiefPoints(skill, 5)}
                  disabled={thiefPointsRemaining === 0 || atCap}
                >+5</button>
              </div>
            </div>
          {/each}
        </div>

        <div class="step-nav">
          <button class="btn-ghost" onclick={prevStep}>Back</button>
          <button class="btn-primary" onclick={nextStep} disabled={thiefPointsRemaining > 0}>Continue</button>
        </div>
      </div>

    {:else if step === STEP_SPELLS}
      <div class="wizard-step">
        <h3>{becomesCaster ? 'Spellcasting Gained!' : 'New Spell Slots'}</h3>
        {#if becomesCaster}
          <p class="meta-text">
            {classKey === 'bard' ? 'You can now cast wizard spells!' :
             classKey === 'paladin' ? 'You can now cast priest spells!' :
             classKey === 'ranger' ? 'You can now cast druid spells!' :
             'You gain spellcasting ability!'}
          </p>
        {/if}

        <div class="spell-slot-comparison">
          <div class="slot-row header">
            <span>Spell Level</span>
            <span>Old</span>
            <span>New</span>
          </div>
          {#each (newSpellSlots || []) as slots, i}
            {#if slots > 0 || (oldSpellSlots?.[i] || 0) > 0}
              <div class="slot-row" class:improved={slots > (oldSpellSlots?.[i] || 0)}>
                <span>{i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}</span>
                <span>{oldSpellSlots?.[i] || 0}</span>
                <span>{slots}</span>
              </div>
            {/if}
          {/each}
        </div>

        <p class="meta-text" style="margin-top: 1rem;">
          Go to the Spells tab after leveling up to pick your new spells.
        </p>

        <div class="step-nav">
          <button class="btn-ghost" onclick={prevStep}>Back</button>
          <button class="btn-primary" onclick={nextStep}>Continue</button>
        </div>
      </div>

    {:else if step === STEP_PROFICIENCIES}
      <div class="wizard-step">
        <h3>New Proficiency Slots</h3>
        <div class="prof-gains">
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
      <div class="wizard-step">
        <h3>Updated Stats & Features</h3>

        <div class="features-list">
          {#if newTHAC0 < oldTHAC0}
            <div class="feature-item">
              <span class="feature-label">THAC0</span>
              <span class="feature-change">{oldTHAC0} → {newTHAC0}</span>
            </div>
          {/if}

          {#if savesImproved}
            <div class="feature-item">
              <span class="feature-label">Saving Throws</span>
              <div class="save-details">
                {#each Object.entries(newSaves) as [key, val]}
                  {#if val < oldSaves[key]}
                    <span class="save-improved">{key}: {oldSaves[key]} → {val}</span>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}

          {#if newAttacks !== oldAttacks}
            <div class="feature-item">
              <span class="feature-label">Attacks/Round</span>
              <span class="feature-change">{oldAttacks} → {newAttacks}</span>
            </div>
          {/if}

          {#each newFeatures as feature}
            <div class="feature-item new-ability">
              <span>◆ {feature}</span>
            </div>
          {/each}
        </div>

        <div class="step-nav">
          <button class="btn-ghost" onclick={prevStep}>Back</button>
          <button class="btn-primary" onclick={nextStep}>Continue</button>
        </div>
      </div>

    {:else if step === STEP_CONFIRM}
      <div class="wizard-step">
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
  @import '../styles/mixins.scss';

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 500;
    padding: $space-lg;
  }

  .wizard-modal {
    background: var(--bg-card);
    border: 3px solid var(--gold);
    border-radius: 8px;
    padding: $space-2xl;
    max-width: 520px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 0 40px rgba(201, 162, 39, 0.3);
  }

  .close-btn {
    position: absolute;
    top: $space-sm;
    right: $space-md;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-muted);
    cursor: pointer;
    line-height: 1;
    padding: $space-xs;

    &:hover {
      color: var(--text-primary);
    }
  }

  .wizard-header {
    text-align: center;
    margin-bottom: $space-lg;

    h2 {
      color: var(--gold);
      margin: 0;
    }
  }

  .level-badge {
    display: inline-block;
    background: rgba(201, 162, 39, 0.15);
    border: 1px solid var(--gold);
    border-radius: 20px;
    padding: $space-xs $space-md;
    font-weight: 700;
    margin-top: $space-sm;
  }

  .wizard-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-md;

    h3 {
      text-align: center;
      margin: 0;
    }
  }

  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-sm;
    width: 100%;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    padding: $space-sm;
    background: var(--bg-panel);
    border-radius: 4px;
    border: 1px solid var(--border-color);

    .label {
      color: var(--text-muted);
      font-weight: 600;
    }

    &.improved {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.1);
    }
  }

  .hp-roll-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-md;
    padding: $space-lg;
  }

  .btn-roll {
    background: linear-gradient(135deg, var(--gold-dark), var(--gold));
    color: var(--text-primary);
    border: 2px solid var(--gold);
    border-radius: 8px;
    padding: $space-md $space-xl;
    font-size: 1.25rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    gap: $space-sm;

    &:hover {
      transform: scale(1.05);
    }
  }

  .btn-roll-die {
    width: 28px;
    height: 28px;
    filter: brightness(0) invert(0.2);
  }

  .dice-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-sm;

    &.animating {
      .die-graphic img {
        animation: dice-tumble 0.3s ease-in-out infinite;
      }
    }
  }

  .die-graphic {
    width: 80px;
    height: 80px;

    img {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
    }

    &.landed img {
      animation: dice-land 0.3s ease-out;
    }
  }

  .die-value-preview {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-muted);
    min-height: 2rem;
  }

  .die-value-final {
    font-family: 'Cinzel', serif;
    font-size: 2rem;
    font-weight: 700;
    color: var(--gold);
    animation: result-pop 0.3s ease-out;
  }

  @keyframes dice-tumble {
    0% { transform: rotate(-12deg) scale(1); }
    25% { transform: rotate(8deg) scale(1.06); }
    50% { transform: rotate(-6deg) scale(0.94); }
    75% { transform: rotate(10deg) scale(1.03); }
    100% { transform: rotate(-12deg) scale(1); }
  }

  @keyframes dice-land {
    0% { transform: scale(1.2) rotate(5deg); }
    50% { transform: scale(0.95) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  @keyframes result-pop {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  .hp-fixed-result {
    font-family: 'Cinzel', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--gold);
    padding: $space-lg;
  }

  .hp-breakdown {
    display: flex;
    gap: $space-lg;
    align-items: center;
    padding: $space-sm $space-md;
    background: var(--bg-panel);
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }

  .hp-part {
    display: flex;
    gap: $space-xs;
    align-items: baseline;
  }

  .hp-label {
    color: var(--text-muted);
    font-size: $text-sm;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .hp-total {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--gold);
    font-family: 'Cinzel', serif;
  }

  .spell-slot-comparison {
    width: 100%;
    max-width: 300px;
  }

  .slot-row {
    display: flex;
    justify-content: space-between;
    padding: $space-xs $space-sm;
    border-bottom: 1px dotted var(--border-color);

    &.header {
      font-weight: 600;
      border-bottom: 1px solid var(--border-color);
    }

    &.improved {
      color: var(--gold);
      font-weight: 600;
    }
  }

  .thief-skills-grid {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
    width: 100%;
  }

  .thief-skill-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: $space-sm;
    padding: $space-xs $space-sm;
    background: var(--bg-panel);
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }

  .skill-name {
    font-weight: 600;
    font-size: $text-sm;
  }

  .skill-total {
    font-weight: 700;
    min-width: 3em;
    text-align: right;

    &.at-cap {
      color: var(--gold);
    }
  }

  .skill-controls {
    display: flex;
    align-items: center;
    gap: $space-xs;
  }

  .skill-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    background: var(--bg-input);
    color: var(--text-primary);
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover:not(:disabled) {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.15);
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  .skill-new {
    min-width: 2.5em;
    text-align: center;
    font-size: $text-sm;
    color: var(--gold);
    font-weight: 600;
  }

  .prof-gains {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
    width: 100%;
  }

  .prof-gain {
    padding: $space-md;
    background: rgba(201, 162, 39, 0.1);
    border: 1px solid var(--gold);
    border-radius: 4px;
    text-align: center;
    font-weight: 600;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
    width: 100%;
  }

  .feature-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: $space-sm;
    background: var(--bg-panel);
    border-radius: 4px;

    &.new-ability {
      border-left: 3px solid var(--gold);
      background: rgba(201, 162, 39, 0.1);
    }
  }

  .feature-label {
    color: var(--text-muted);
    font-weight: 600;
  }

  .feature-change {
    color: var(--gold);
    font-weight: 600;
  }

  .save-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .save-improved {
    color: var(--gold);
    font-size: $text-sm;
  }

  .confirm-summary {
    width: 100%;
    max-width: 300px;
  }

  .confirm-row {
    display: flex;
    justify-content: space-between;
    padding: $space-sm 0;
    border-bottom: 1px dotted var(--border-color);
    font-weight: 600;
  }

  .step-nav {
    display: flex;
    gap: $space-md;
    margin-top: $space-md;
  }

  .btn-confirm {
    background: linear-gradient(135deg, var(--gold-dark), var(--gold)) !important;
  }

  .step-dots {
    display: flex;
    justify-content: center;
    gap: $space-sm;
    margin-top: $space-lg;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border-color);
    transition: all 0.2s;

    &.active {
      background: var(--gold);
      transform: scale(1.3);
    }

    &.completed {
      background: var(--gold-dark);
    }
  }
</style>
