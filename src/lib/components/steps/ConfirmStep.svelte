<script>
  import { formatSpellSlots } from '../../../data/levelTables.js';
  import { THIEF_POINTS_PER_LEVEL } from '../../../data/thiefSkills.js';

  let {
    newLevel,
    hpTotal,
    oldTHAC0,
    newTHAC0,
    hasNewSpellSlots,
    newSpellSlots,
    isThiefClass,
    onPrev,
    onConfirm,
  } = $props();
</script>

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
    <button class="btn-secondary" onclick={onPrev}>Back</button>
    <button class="btn-primary" onclick={onConfirm}>Confirm Level Up!</button>
  </div>
</div>
