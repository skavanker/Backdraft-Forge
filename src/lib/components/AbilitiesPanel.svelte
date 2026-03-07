<script>
  import AbilityBadge from './AbilityBadge.svelte';
  import { formatModifier, formatPercentage } from '../../data/mechanics.js';

  let {
    abilities,
    exceptionalStr,
    strMods,
    dexMods,
    conMods,
    intMods,
    wisMods,
    chaMods
  } = $props();
</script>


<h3 class="section-title">Ability Scores</h3>
<div class="abilities">
  <AbilityBadge
    ability="STR"
    score={abilities.STR}
    {exceptionalStr}
    modifier={strMods.hitAdj !== 0 ? formatModifier(strMods.hitAdj) + ' hit' : '—'}
    tooltip={`Hit Adj: ${formatModifier(strMods.hitAdj)}, Dmg Adj: ${formatModifier(strMods.dmgAdj)}, Weight Allow: ${strMods.weightAllow} lbs`}
    variant="detailed"
  />
  <AbilityBadge
    ability="DEX"
    score={abilities.DEX}
    modifier={dexMods.acAdj !== 0 ? formatModifier(dexMods.acAdj) + ' AC' : '—'}
    tooltip={`AC Adj: ${formatModifier(dexMods.acAdj)}, Missile Atk Adj: ${formatModifier(dexMods.missileAdj)}, Reaction Adj: ${formatModifier(dexMods.reactionAdj)}`}
    variant="detailed"
  />
  <AbilityBadge
    ability="CON"
    score={abilities.CON}
    modifier={`${conMods.systemShock}% SS`}
    tooltip={`HP Adj: ${formatModifier(conMods.hpAdj)}/level, System Shock: ${conMods.systemShock}%, Resurrection Survival: ${conMods.resurrectionSurvival}%`}
    variant="detailed"
  />
  <AbilityBadge
    ability="INT"
    score={abilities.INT}
    modifier={`${intMods.languages} lang`}
    tooltip={`Bonus Languages: ${intMods.languages}, Learn Spell: ${formatPercentage(intMods.learnSpell)}, Max Spells/Level: ${intMods.maxSpellsPerLevel}`}
    variant="detailed"
  />
  <AbilityBadge
    ability="WIS"
    score={abilities.WIS}
    modifier={wisMods.magicDefenseAdj !== 0 ? formatModifier(wisMods.magicDefenseAdj) + ' def' : '—'}
    tooltip={`Magic Defense Adj: ${formatModifier(wisMods.magicDefenseAdj)}, Spell Failure: ${wisMods.spellFailure}%, Bonus Spells: ${Object.keys(wisMods.bonusSpells).length > 0 ? Object.entries(wisMods.bonusSpells).map(([lvl, n]) => `+${n} (${lvl}st)`).join(', ') : 'None'}`}
    variant="detailed"
  />
  <AbilityBadge
    ability="CHA"
    score={abilities.CHA}
    modifier={`${chaMods.maxHenchmen} hench`}
    tooltip={`Max Henchmen: ${chaMods.maxHenchmen}, Loyalty Base: ${formatModifier(chaMods.loyaltyBase)}, Reaction Adj: ${formatModifier(chaMods.reactionAdj)}`}
    variant="detailed"
  />
</div>

<!-- Detailed Ability Modifiers -->
<div class="ability-details">
  <div class="detail-col">
    <div class="detail-group">
      <h6 class="detail-header">Strength</h6>
      <div class="data-row"><span>Hit Adj</span><span class="val">{formatModifier(strMods.hitAdj)}</span></div>
      <div class="data-row"><span>Dmg Adj</span><span class="val">{formatModifier(strMods.dmgAdj)}</span></div>
      <div class="data-row"><span>Weight Allow</span><span class="val">{strMods.weightAllow} lbs</span></div>
      <div class="data-row"><span>Max Press</span><span class="val">{strMods.maxPress} lbs</span></div>
      <div class="data-row"><span>Open Doors</span><span class="val">{strMods.openDoors}</span></div>
      <div class="data-row"><span>Bend Bars</span><span class="val">{strMods.bendBars}%</span></div>
    </div>
    <div class="detail-group">
      <h6 class="detail-header">Dexterity</h6>
      <div class="data-row"><span>AC Adj</span><span class="val">{formatModifier(dexMods.acAdj)}</span></div>
      <div class="data-row"><span>Missile Atk Adj</span><span class="val">{formatModifier(dexMods.missileAdj)}</span></div>
      <div class="data-row"><span>Reaction Adj</span><span class="val">{formatModifier(dexMods.reactionAdj)}</span></div>
    </div>
    <div class="detail-group">
      <h6 class="detail-header">Constitution</h6>
      <div class="data-row"><span>HP Adj</span><span class="val">{formatModifier(conMods.hpAdj)}</span></div>
      <div class="data-row"><span>System Shock</span><span class="val">{conMods.systemShock}%</span></div>
      <div class="data-row"><span>Resurrection</span><span class="val">{conMods.resurrectionSurvival}%</span></div>
    </div>
  </div>
  <div class="detail-col">
    <div class="detail-group">
      <h6 class="detail-header">Intelligence</h6>
      <div class="data-row"><span>Learn Spell</span><span class="val">{formatPercentage(intMods.learnSpell)}</span></div>
      <div class="data-row"><span>Max Spells/Lvl</span><span class="val">{intMods.maxSpellsPerLevel}</span></div>
      <div class="data-row"><span>Max Spell Lvl</span><span class="val">{intMods.maxSpellLevel}th</span></div>
      <div class="data-row"><span>Languages</span><span class="val">{intMods.languages}</span></div>
    </div>
    <div class="detail-group">
      <h6 class="detail-header">Wisdom</h6>
      <div class="data-row"><span>Magic Defense Adj</span><span class="val">{formatModifier(wisMods.magicDefenseAdj)}</span></div>
      {#if Object.keys(wisMods.bonusSpells).length > 0}
        <div class="data-row"><span>Bonus Spells</span><span class="val">{Object.entries(wisMods.bonusSpells).map(([lvl, n]) => `+${n} (${lvl}st)`).join(', ')}</span></div>
      {:else}
        <div class="data-row"><span>Bonus Spells</span><span class="val">None</span></div>
      {/if}
      <div class="data-row"><span>Spell Failure</span><span class="val">{wisMods.spellFailure}%</span></div>
    </div>
    <div class="detail-group">
      <h6 class="detail-header">Charisma</h6>
      <div class="data-row"><span>Max Henchmen</span><span class="val">{chaMods.maxHenchmen}</span></div>
      <div class="data-row"><span>Reaction Adj</span><span class="val">{formatModifier(chaMods.reactionAdj)}</span></div>
      <div class="data-row"><span>Loyalty Base</span><span class="val">{formatModifier(chaMods.loyaltyBase)}</span></div>
    </div>
  </div>
</div>
