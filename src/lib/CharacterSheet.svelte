<script>
  import Tooltip from './Tooltip.svelte';
  import CharacterSheetHeader from './components/CharacterSheetHeader.svelte';
  import BasicInfoPanel from './components/BasicInfoPanel.svelte';
  import AbilitiesPanel from './components/AbilitiesPanel.svelte';
  import CombatStatsPanel from './components/CombatStatsPanel.svelte';
  import EquipmentPanel from './components/EquipmentPanel.svelte';
  import { useToggle, useAbilityModifiers } from './utils/stateUtils.svelte.js';
  import { getSavingThrows, getBaseTHAC0 } from '../data/mechanics.js';
  import { getSpellSlots, getXPForNextLevel, getAttacksPerRound, formatSpellSlots } from '../data/levelTables.js';
  import { getBaseThiefSkills, applyDistributedPoints, SKILL_LABELS } from '../data/thiefSkills.js';
  import { getTurnUndeadRow, formatTurnResult } from '../data/turnUndead.js';
  import { groupByLevel } from '../data/priestSpells.js';
  import { formatSpeciesEnemy } from '../data/speciesEnemies.js';
  import { ordinal } from './utils/formatUtils.js';
  import { calcTotalHP, parseDieMax } from './utils/hpUtils.js';

  let { character, onCharacterUpdate, undoMessage = '', showUndoMessage = false } = $props();

  // Calculate ability modifiers
  const abilityMods = useAbilityModifiers(character);
  let strMods = $derived(abilityMods.str);
  let dexMods = $derived(abilityMods.dex);
  let conMods = $derived(abilityMods.con);
  let intMods = $derived(abilityMods.int);
  let wisMods = $derived(abilityMods.wis);
  let chaMods = $derived(abilityMods.cha);

  // Calculate saving throws and combat stats (level-aware)
  let charLevel = $derived(character.level || 1);
  let savingThrows = $derived(getSavingThrows(character.cls.group, charLevel));
  let baseTHAC0 = $derived(getBaseTHAC0(character.cls.group, charLevel));
  let attacksPerRound = $derived(getAttacksPerRound(character.cls.group, charLevel));

  // XP progress
  let xpForNext = $derived(getXPForNextLevel(character.classKey, charLevel));
  let atLevelLimit = $derived(character.levelLimit !== null && charLevel >= character.levelLimit);
  let canLevelUp = $derived(xpForNext !== null && (character.xp || 0) >= xpForNext && !atLevelLimit);

  // Spell slots from level tables
  let spellSlots = $derived(getSpellSlots(character.classKey, charLevel));
  let spellSlotDisplay = $derived(formatSpellSlots(spellSlots));

  // State management using composables
  const showLevelUp = useToggle(false);

  // Current HP derived - explicit null check to handle NaN and other invalid values
  let currentHP = $derived(
    character.currentHP != null && !isNaN(character.currentHP)
      ? character.currentHP
      : hitPoints
  );
  let hpRatio = $derived(hitPoints > 0 ? currentHP / hitPoints : 0);
  let hpColor = $derived(
    hpRatio > 0.5 ? 'hp-green' :
    hpRatio > 0.25 ? 'hp-yellow' : 'hp-red'
  );

  // Thief skills (for thieves and bards)
  let isThiefClass = $derived(character.classKey === 'thief' || character.classKey === 'bard');
  let thiefSkills = $derived((() => {
    if (!isThiefClass) return null;
    const base = getBaseThiefSkills(character.raceKey, character.adjustedAbilities.DEX, character.classKey, charLevel);
    return applyDistributedPoints(base, character.thiefSkills);
  })());

  // Turn undead (for clerics and paladins)
  let canTurnUndead = $derived(character.classKey === 'cleric' || character.classKey === 'paladin');
  let turnUndeadRow = $derived((() => {
    if (!canTurnUndead) return null;
    return getTurnUndeadRow(character.classKey, charLevel);
  })());

  // Notes state
  let notesValue = $state(character.notes || '');
  // Sync notesValue when character changes (e.g. undo, import)
  $effect(() => { notesValue = character.notes || ''; });

  function saveNotes() {
    if (notesValue !== (character.notes || '')) {
      onCharacterUpdate?.({ notes: notesValue });
    }
  }

  // Equipment removal helpers
  function removeArmor() {
    onCharacterUpdate?.({ equipment: { ...character.equipment, armor: null } });
  }
  function removeShield() {
    onCharacterUpdate?.({ equipment: { ...character.equipment, shield: null } });
  }
  function removeWeapon(index) {
    const weapons = character.equipment.weapons.filter((_, i) => i !== index);
    onCharacterUpdate?.({ equipment: { ...character.equipment, weapons } });
  }
  function removeGear(index) {
    const gear = character.equipment.gear.filter((_, i) => i !== index);
    onCharacterUpdate?.({ equipment: { ...character.equipment, gear } });
  }

  // Derived combat values
  let meleeTHAC0 = $derived(baseTHAC0 - strMods.hitAdj);
  let missileTHAC0 = $derived(baseTHAC0 - dexMods.missileAdj);

  // Calculate AC with DEX modifier
  let baseAC = $derived((() => {
    let ac = 10;
    if (character.equipment?.armor) ac = character.equipment.armor.ac;
    if (character.equipment?.shield) ac -= character.equipment.shield.acBonus;
    ac += dexMods.acAdj;
    return ac;
  })());

  // Calculate HP using shared utility
  let hitPoints = $derived(calcTotalHP(character.hpHistory, character.cls.hitDie, conMods.hpAdj));

  let className = $derived(character.wizardSchool?.name || character.cls.name);

  // Get portrait filename based on race, sex, and class
  let portraitFilename = $derived((() => {
    const race = character.raceKey.charAt(0).toUpperCase() + character.raceKey.slice(1);
    const gender = character.sex || 'Male';
    const cls = character.wizardSchool ? 'SpecialistWizard' : (character.classKey.charAt(0).toUpperCase() + character.classKey.slice(1));
    return `${race}${gender}${cls}.webp`;
  })());

  // Calculate total weight carried
  let totalWeight = $derived((() => {
    if (character.equipment?.totalWeight) return character.equipment.totalWeight;
    let weight = 0;
    if (character.equipment?.armor) weight += character.equipment.armor.weight || 0;
    if (character.equipment?.shield) weight += character.equipment.shield.weight || 0;
    if (character.equipment?.weapons) {
      for (const w of character.equipment.weapons) weight += w.weight || 0;
    }
    if (character.equipment?.gear) {
      for (const g of character.equipment.gear) weight += (g.weight || 0) * (g.qty || 1);
    }
    return weight;
  })());

</script>

<div class="sheet">
  <CharacterSheetHeader
    name={character.name}
    raceName={character.race.name}
    {className}
    level={charLevel}
    xp={character.xp || 0}
    xpBonus={character.xpBonus}
    {xpForNext}
    {canLevelUp}
    {atLevelLimit}
    onUpdateXP={(val) => onCharacterUpdate?.({ xp: val })}
    onLevelUp={showLevelUp.open}
  />

  <hr class="divider">

  <BasicInfoPanel
    {character}
    portraitFilename={portraitFilename}
    currentHP={currentHP}
    maxHP={hitPoints}
    {hpColor}
    baseAC={baseAC}
    {baseTHAC0}
    totalWeight={totalWeight}
    {strMods}
    onUpdateHP={(val) => onCharacterUpdate?.({ currentHP: val })}
  />

  <hr class="divider">

  <AbilitiesPanel
    abilities={character.adjustedAbilities}
    exceptionalStr={character.abilities.exceptionalStr}
    {strMods}
    {dexMods}
    {conMods}
    {intMods}
    {wisMods}
    {chaMods}
  />

  <hr class="divider">

  <CombatStatsPanel
    {savingThrows}
    {baseTHAC0}
    {meleeTHAC0}
    {missileTHAC0}
    damageAdj={strMods.dmgAdj}
    baseAC={baseAC}
    movement={character.race.movement || 12}
    {attacksPerRound}
    isWarrior={character.cls.group === 'warrior'}
    {spellSlots}
    {spellSlotDisplay}
    classGroup={character.cls.group}
    classKey={character.classKey}
    {intMods}
    {wisMods}
  />

  <hr class="divider">

  <EquipmentPanel
    equipment={character.equipment}
    proficiencies={character.proficiencies}
    {meleeTHAC0}
    {missileTHAC0}
    {strMods}
    onRemoveWeapon={removeWeapon}
    onRemoveArmor={removeArmor}
    onRemoveShield={removeShield}
    onRemoveGear={removeGear}
    onUpdateGold={(val) => onCharacterUpdate?.({ equipment: { ...character.equipment, remaining: val } })}
  />

  <hr class="divider">

  <!-- Spells -->
  {#if character.spells && character.spells.type !== 'none'}
    <div class="stat-block">
      <h3>Spells</h3>
      {#if character.spells.type === 'arcane'}
        {@const grouped = groupByLevel(character.spells.spellbook)}
        {#each Object.entries(grouped) as [level, spells]}
          <div class="spell-level-group">
            <div class="spell-level-header">{ordinal(Number(level))} Level</div>
            {#each spells as spell}
              <div class="data-row"><span>{spell.name}</span></div>
            {/each}
          </div>
        {/each}
      {:else if character.spells.type === 'divine'}
        {@const grouped = groupByLevel(character.spells.prepared)}
        {#each Object.entries(grouped) as [level, spells]}
          <div class="spell-level-group">
            <div class="spell-level-header">{ordinal(Number(level))} Level</div>
            {#each spells as spell}
              <div class="data-row"><span>{spell.name}</span></div>
            {/each}
          </div>
        {/each}
      {:else if character.spells.type === 'dual'}
        {#if character.spells.prepared?.length}
          <div class="data-row"><span><strong>Priest Spells</strong></span></div>
          {@const grouped = groupByLevel(character.spells.prepared)}
          {#each Object.entries(grouped) as [level, spells]}
            <div class="spell-level-group">
              <div class="spell-level-header">{ordinal(Number(level))} Level</div>
              {#each spells as spell}
                <div class="data-row"><span>{spell.name}</span></div>
              {/each}
            </div>
          {/each}
        {/if}
        {#if character.spells.spellbook?.length}
          <div class="data-row" style="margin-top: 0.5rem"><span><strong>Wizard Spells</strong></span></div>
          {@const grouped = groupByLevel(character.spells.spellbook)}
          {#each Object.entries(grouped) as [level, spells]}
            <div class="spell-level-group">
              <div class="spell-level-header">{ordinal(Number(level))} Level</div>
              {#each spells as spell}
                <div class="data-row"><span>{spell.name}</span></div>
              {/each}
            </div>
          {/each}
        {/if}
      {/if}
    </div>
    <hr class="divider">
  {/if}

  <!-- Non-Weapon Proficiencies -->
  {#if character.proficiencies?.nonWeapon}
    <div class="stat-block">
      <h3>Non-Weapon Proficiencies</h3>
      {#each character.proficiencies.nonWeapon as prof}
        <div class="data-row"><span>{prof.name}</span> <span class="val">{prof.ability}</span></div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Thief Skills -->
  {#if isThiefClass && thiefSkills}
    <div class="stat-block">
      <h3>Thief Skills</h3>
      {#each Object.entries(thiefSkills) as [key, value]}
        {#if key === 'readLanguages' && charLevel < 4}
          <div class="data-row locked"><span>{SKILL_LABELS[key]}</span> <span class="val">Lv 4</span></div>
        {:else}
          <div class="data-row"><span>{SKILL_LABELS[key]}</span> <span class="val">{value}%</span></div>
        {/if}
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Languages -->
  {#if character.proficiencies?.languages}
    <div class="stat-block">
      <h3>Languages</h3>
      <div class="data-row"><span>{character.proficiencies.languages.map(l => l.name).join(', ')}</span></div>
    </div>
    <hr class="divider">
  {/if}

  <!-- Racial Abilities -->
  {#if character.race?.traits?.length}
    <div class="stat-block">
      <h3>Racial Abilities</h3>
      {#each character.race.traits as trait}
        <div class="data-row">◆ {trait}</div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Class Features -->
  {#if character.cls?.features?.length}
    <div class="stat-block">
      <h3>Class Features</h3>
      {#each character.cls.features as feature}
        <div class="data-row">◆ {#if feature.includes('Species enemy') && character.speciesEnemy}Species enemy: {formatSpeciesEnemy(character.speciesEnemy)} (+4 to hit){:else}{feature}{/if}</div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Turn Undead -->
  {#if canTurnUndead && turnUndeadRow}
    <div class="stat-block">
      <h3>Turn Undead</h3>
      <div class="turn-undead-grid">
        {#each turnUndeadRow.types as type, i}
          <div class="turn-col">
            <div class="turn-type">{type}</div>
            <div class="turn-val" class:turn-auto={turnUndeadRow.values[i] === 'T' || turnUndeadRow.values[i] === 'D'}>{formatTurnResult(turnUndeadRow.values[i])}</div>
          </div>
        {/each}
      </div>
      <div class="turn-legend">T = Auto Turn · D* = Auto Destroy · Number = d20 roll needed</div>
    </div>
    <hr class="divider">
  {/if}

  <!-- Backstory -->
  {#if character.backstory}
    <div class="stat-block">
      <h3>Backstory</h3>
      <p class="backstory-text">{character.backstory}</p>
    </div>
    <hr class="divider">
  {/if}

  <!-- Notes -->
  <div class="notes-section" class:notes-empty={!notesValue}>
    <h3 class="section-title" id="notes-heading">Notes</h3>
    <textarea
      class="notes-textarea"
      bind:value={notesValue}
      onblur={saveNotes}
      placeholder="Add notes here..."
      rows="4"
      aria-labelledby="notes-heading"
    ></textarea>
  </div>
  <hr class="divider">

  <!-- Footer -->
  <div class="sheet-footer">
    Advanced Dungeons &amp; Dragons — 2nd Edition · {character.name}
  </div>

  <!-- Toast Messages -->
  <div class="toast-area">
    {#if showUndoMessage}
      <p class="undo-toast alert alert-info">{undoMessage}</p>
    {/if}
  </div>
</div>

{#if showLevelUp.value}
  {#await import('./LevelUpWizard.svelte') then module}
    {@const LevelUpWizard = module.default}
    <LevelUpWizard
      {character}
      onComplete={(updates) => {
        onCharacterUpdate?.(updates);
        showLevelUp.close();
      }}
      onCancel={showLevelUp.close}
    />
  {/await}
{/if}


<style lang="scss">
  @import './styles/shared';
  @import './styles/sheet';
</style>
