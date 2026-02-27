<script>
  import { formatModifier, formatPercentage } from '../../data/mechanics.js';

  let {
    savingThrows,
    baseTHAC0,
    meleeTHAC0,
    missileTHAC0,
    baseAC,
    movement,
    attacksPerRound,
    isWarrior = false,
    spellSlots = null,
    spellSlotDisplay = '',
    classGroup = '',
    classKey = '',
    intMods,
    wisMods
  } = $props();

  let hasSpellSlots = $derived(spellSlots && spellSlots.some(s => s > 0));
  let isArcane = $derived(classGroup === 'wizard' || classKey === 'bard');
</script>

<div class="two-col">
  <div class="stat-block">
    <h3>Saving Throws</h3>
    <div class="data-row"><span>Paralyz./Poison/Death</span> <span class="val">{savingThrows.paralysis}</span></div>
    <div class="data-row"><span>Rod/Staff/Wand</span> <span class="val">{savingThrows.rod}</span></div>
    <div class="data-row"><span>Petrif./Polymorph</span> <span class="val">{savingThrows.petrification}</span></div>
    <div class="data-row"><span>Breath Weapon</span> <span class="val">{savingThrows.breath}</span></div>
    <div class="data-row"><span>Spell</span> <span class="val">{savingThrows.spell}</span></div>
  </div>

  <div class="stat-block">
    <h3>Combat</h3>
    <div class="data-row"><span>Base THAC0</span> <span class="val">{baseTHAC0}</span></div>
    <div class="data-row"><span>Melee THAC0</span> <span class="val">{meleeTHAC0}</span></div>
    <div class="data-row"><span>Missile THAC0</span> <span class="val">{missileTHAC0}</span></div>
    <div class="data-row"><span>Damage Adj</span> <span class="val">{formatModifier(0)}</span></div>
    <div class="data-row"><span>AC</span> <span class="val">{baseAC}</span></div>
    <div class="data-row"><span>Movement</span> <span class="val">{movement}</span></div>
    {#if isWarrior}
      <div class="data-row"><span>Attacks/Round</span> <span class="val">{attacksPerRound}</span></div>
    {/if}
  </div>
</div>

{#if hasSpellSlots}
  <div class="two-col" style="margin-top: 1rem;">
    <div class="stat-block">
      {#if isArcane}
        <h3>Spellcasting</h3>
        <div class="data-row"><span>Spell slots</span> <span class="val">{spellSlotDisplay}</span></div>
        <div class="data-row"><span>Learn spell chance</span> <span class="val">{formatPercentage(intMods.learnSpell)}</span></div>
        <div class="data-row"><span>Max spells/level</span> <span class="val">{intMods.maxSpellsPerLevel}</span></div>
        <div class="data-row"><span>Max spell level</span> <span class="val">{intMods.maxSpellLevel}th</span></div>
      {:else}
        <h3>Spellcasting</h3>
        <div class="data-row"><span>Spell slots</span> <span class="val">{spellSlotDisplay}</span></div>
        {#if Object.keys(wisMods.bonusSpells).length > 0}
          <div class="data-row"><span>Bonus spells</span> <span class="val">{Object.entries(wisMods.bonusSpells).map(([lvl, n]) => `+${n} (${lvl})`).join(', ')}</span></div>
        {/if}
      {/if}
    </div>
    <div></div>
  </div>
{/if}
