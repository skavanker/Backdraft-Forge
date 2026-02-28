<script>
  import { ordinal } from '../utils/formatUtils.js';

  let {
    classKey,
    becomesCaster,
    newSpellSlots,
    oldSpellSlots,
    onNext,
    onPrev
  } = $props();
</script>

<div class="levelup-step">
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
          <span>{ordinal(i + 1)}</span>
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
    <button class="btn-ghost" onclick={onPrev}>Back</button>
    <button class="btn-primary" onclick={onNext}>Continue</button>
  </div>
</div>
