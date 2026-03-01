<script>
  import { SKILL_LABELS, THIEF_SKILL_CAP, THIEF_POINTS_PER_LEVEL } from '../../data/thiefSkills.js';

  let {
    thiefBase,
    thiefBreakdown,
    availableThiefSkills,
    thiefPointsRemaining = $bindable(THIEF_POINTS_PER_LEVEL),
    thiefDistributed = $bindable({}),
    thiefNewPoints = $bindable({}),
    onNext,
    onPrev
  } = $props();

  function addThiefPoints(skill, amount) {
    const existingDistributed = (thiefDistributed[skill] || 0);
    const baseVal = thiefBase[skill] || 0;
    const currentTotal = baseVal + existingDistributed;
    // Can't exceed 95%
    const maxAdd = Math.min(amount, THIEF_SKILL_CAP - currentTotal, thiefPointsRemaining);
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
</script>

<div class="levelup-step">
  <h3>Distribute Thief Skill Points</h3>
  <p class="meta-text">You have <strong>{thiefPointsRemaining}</strong> of {THIEF_POINTS_PER_LEVEL} points to distribute.</p>

  <div class="flex-column gap-sm">
    {#each availableThiefSkills as skill}
      {@const baseVal = thiefBase[skill]}
      {@const distributed = thiefDistributed[skill] || 0}
      {@const total = baseVal + distributed}
      {@const newPts = thiefNewPoints[skill] || 0}
      {@const atCap = total >= THIEF_SKILL_CAP}
      {@const canAdd = thiefPointsRemaining > 0 && !atCap}
      {@const canRemove = newPts > 0}
      {@const rawBase = thiefBreakdown.base[skill] || 0}
      {@const racialAdj = thiefBreakdown.racial[skill] || 0}
      {@const dexAdj = thiefBreakdown.dex[skill] || 0}
      {@const oldDist = distributed - newPts}
      <button
        class="thief-skill-row panel"
        class:at-cap={atCap}
        class:has-new-points={newPts > 0}
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
          {#if oldDist > 0}
            <span class="breakdown-item prev">Prev: +{oldDist}%</span>
          {/if}
          {#if newPts > 0}
            <span class="breakdown-item new-pts">New: +{newPts}%</span>
          {/if}
        </div>
        <span class="skill-total" class:at-cap={atCap}>{total}%</span>
      </button>
    {/each}
  </div>
  <p class="meta-text" style="text-align: center;">
    Left-click to add 5 points • Right-click to remove 5 points
  </p>

  <div class="step-nav">
    <button class="btn-secondary" onclick={onPrev}>Back</button>
    <button class="btn-primary" onclick={onNext} disabled={thiefPointsRemaining > 0}>Continue</button>
  </div>
</div>
