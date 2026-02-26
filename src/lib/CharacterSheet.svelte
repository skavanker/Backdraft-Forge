<script>
  import Tooltip from './Tooltip.svelte';
  import ImportArea from './ImportArea.svelte';
  import { deities } from '../data/deities.js';
  import {
    getStrengthModifiers,
    getDexterityModifiers,
    getConstitutionModifiers,
    getIntelligenceModifiers,
    getWisdomModifiers,
    getCharismaModifiers,
    getSavingThrows,
    getBaseTHAC0,
    formatModifier,
    formatPercentage
  } from '../data/mechanics.js';
  import { getSpellSlots, getXPForNextLevel, getAttacksPerRound, formatSpellSlots } from '../data/levelTables.js';
  import { getBaseThiefSkills, applyDistributedPoints, SKILL_LABELS } from '../data/thiefSkills.js';
  import { getTurnUndeadRow, formatTurnResult } from '../data/turnUndead.js';

  let { character, onImport, onSave, onCharacterUpdate, onUndo, canUndo = false, undoMessage = '', showUndoMessage = false } = $props();

  let shareMessage = $state('');
  let showShareMessage = $state(false);

  // Calculate ability modifiers
  let strMods = $derived(getStrengthModifiers(
    character.adjustedAbilities.STR,
    character.abilities.exceptionalStr
  ));
  let dexMods = $derived(getDexterityModifiers(character.adjustedAbilities.DEX));
  let conMods = $derived(getConstitutionModifiers(character.adjustedAbilities.CON, character.cls.group));
  let intMods = $derived(getIntelligenceModifiers(character.adjustedAbilities.INT));
  let wisMods = $derived(getWisdomModifiers(character.adjustedAbilities.WIS));
  let chaMods = $derived(getCharismaModifiers(character.adjustedAbilities.CHA));

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

  // XP editing state
  let editingXP = $state(false);
  let xpInput = $state('');

  // Gold editing state
  let editingGold = $state(false);
  let goldInput = $state('');

  // Level-up wizard state
  let showLevelUp = $state(false);


  // Reset level confirmation
  let confirmResetLevel = $state(false);

  function resetLevel() {
    onCharacterUpdate?.({
      level: 1,
      xp: 0,
      hpHistory: [],
      currentHP: null,
      thiefSkills: null,
      spells: null,
      proficiencies: null,
    });
    confirmResetLevel = false;
  }

  // Hamburger menu state
  let menuOpen = $state(false);

  function toggleMenu() { menuOpen = !menuOpen; }
  function closeMenu() { menuOpen = false; }

  function handleMenuKeydown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  function handleMenuClickOutside(e) {
    if (menuOpen && !e.target.closest('.action-menu') && !e.target.closest('.hamburger-btn')) {
      closeMenu();
    }
  }

  // Current HP editing state
  let editingHP = $state(false);
  let hpInput = $state('');

  // Current HP derived
  let currentHP = $derived(character.currentHP ?? hitPoints());
  let hpRatio = $derived(hitPoints() > 0 ? currentHP / hitPoints() : 1);
  let hpColor = $derived(
    hpRatio > 0.5 ? 'hp-green' :
    hpRatio > 0.25 ? 'hp-yellow' : 'hp-red'
  );

  // Thief skills (for thieves and bards)
  let isThiefClass = $derived(character.classKey === 'thief' || character.classKey === 'bard');
  let thiefSkills = $derived(() => {
    if (!isThiefClass) return null;
    const base = getBaseThiefSkills(character.raceKey, character.adjustedAbilities.DEX, character.classKey, charLevel);
    return applyDistributedPoints(base, character.thiefSkills);
  });

  // Turn undead (for clerics and paladins)
  let canTurnUndead = $derived(character.classKey === 'cleric' || character.classKey === 'paladin');
  let turnUndeadRow = $derived(() => {
    if (!canTurnUndead) return null;
    return getTurnUndeadRow(character.classKey, charLevel);
  });

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

  async function shareCharacter() {
    const { generateShareableUrl, copyToClipboard } = await import('./shareCharacter.js');
    const url = generateShareableUrl(character);
    if (!url) {
      shareMessage = 'Failed to generate link';
      showShareMessage = true;
      setTimeout(() => showShareMessage = false, 3000);
      return;
    }

    const success = await copyToClipboard(url);
    if (success) {
      shareMessage = 'Link copied to clipboard!';
    } else {
      shareMessage = 'Failed to copy. URL: ' + url;
    }
    showShareMessage = true;
    setTimeout(() => showShareMessage = false, 3000);
  }

  function saveCharacter() {
    onSave?.();
    shareMessage = 'Character saved!';
    showShareMessage = true;
    setTimeout(() => showShareMessage = false, 3000);
  }

  async function exportCode() {
    const { encodeCharacter, copyToClipboard } = await import('./shareCharacter.js');
    const encoded = encodeCharacter(character);
    if (!encoded) {
      shareMessage = 'Failed to generate code';
      showShareMessage = true;
      setTimeout(() => showShareMessage = false, 3000);
      return;
    }
    const success = await copyToClipboard(encoded);
    shareMessage = success ? 'Character code copied to clipboard!' : 'Failed to copy code';
    showShareMessage = true;
    setTimeout(() => showShareMessage = false, 3000);
  }

  // Calculate AC with DEX modifier
  let baseAC = $derived(() => {
    let ac = 10;
    if (character.equipment?.armor) ac = character.equipment.armor.ac;
    if (character.equipment?.shield) ac -= character.equipment.shield.acBonus;
    ac += dexMods.acAdj; // Apply DEX AC adjustment (negative is better)
    return ac;
  });

  // Calculate HP: sum hpHistory if available, fallback to max-die for old saves
  let hitPoints = $derived(() => {
    if (character.hpHistory?.length > 0) {
      return character.hpHistory.reduce((sum, entry) => sum + entry.total, 0);
    }
    // Fallback for old saves without hpHistory: max die + CON mod at level 1
    const hitDie = character.cls.hitDie;
    const match = hitDie.match(/d(\d+)/);
    const dieMax = match ? parseInt(match[1]) : 4;
    return Math.max(1, dieMax + conMods.hpAdj);
  });

  let className = $derived(character.wizardSchool?.name || character.cls.name);

  // Get portrait filename based on race, sex, and class
  let portraitFilename = $derived(() => {
    const race = character.raceKey.charAt(0).toUpperCase() + character.raceKey.slice(1); // Capitalize
    const gender = character.sex || 'Male';
    const cls = character.wizardSchool ? 'SpecialistWizard' : (character.classKey.charAt(0).toUpperCase() + character.classKey.slice(1));
    return `${race}${gender}${cls}.webp`;
  });

  // Calculate total weight carried
  let totalWeight = $derived(() => {
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
  });

  // Warn if share link may be too long for browsers
  // Helper to group spells by level for display
  function groupSpellsByLevel(spells) {
    if (!spells) return {};
    const groups = {};
    for (const spell of spells) {
      const lvl = spell.level || 1;
      if (!groups[lvl]) groups[lvl] = [];
      groups[lvl].push(spell);
    }
    return groups;
  }

  function ordinalLevel(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  let shareLinkWarning = $derived(
    (character.backstory?.length || 0) > 300
      ? 'Long backstory may make the share link too large for some browsers. Use Export Code instead for full fidelity.'
      : ''
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sheet" onkeydown={handleMenuKeydown} onclick={handleMenuClickOutside}>
  <button class="hamburger-btn" onclick={toggleMenu} title="Actions menu">&#9776;</button>
  {#if menuOpen}
    <div class="action-menu">
      <div class="menu-group">
        <button class="menu-item" onclick={() => { saveCharacter(); closeMenu(); }}>Save</button>
        <button class="menu-item" onclick={() => { shareCharacter(); closeMenu(); }}>Share Link{shareLinkWarning ? ' ⚠' : ''}</button>
        <button class="menu-item" onclick={() => { exportCode(); closeMenu(); }}>Export Code</button>
      </div>
      <div class="menu-group">
        <ImportArea {onImport} />
      </div>
      <div class="menu-group">
        {#if canUndo}
          <button class="menu-item" onclick={() => { onUndo?.(); closeMenu(); }}>Undo</button>
        {/if}
        <button class="menu-item" onclick={() => { window.print(); closeMenu(); }}>Print</button>
        {#if charLevel > 1}
          {#if confirmResetLevel}
            <div class="menu-confirm">
              <span>Reset to level 1?</span>
              <button class="btn-danger btn-sm" onclick={() => { resetLevel(); closeMenu(); }}>Yes</button>
              <button class="btn-ghost btn-sm" onclick={() => confirmResetLevel = false}>No</button>
            </div>
          {:else}
            <button class="menu-item" onclick={() => confirmResetLevel = true}>Reset Level</button>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
  <h1>{character.name}</h1>
  <div class="subtitle">{character.race.name} {className} · Level {charLevel}</div>

  <!-- XP Bar -->
  <div class="xp-section">
    <div class="xp-row">
      {#if editingXP}
        <label class="xp-label">XP:</label>
        <input
          type="number"
          class="xp-input"
          bind:value={xpInput}
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              const val = parseInt(xpInput);
              if (!isNaN(val) && val >= 0) {
                onCharacterUpdate?.({ xp: val });
              }
              editingXP = false;
            } else if (e.key === 'Escape') {
              editingXP = false;
            }
          }}
          onblur={() => {
            const val = parseInt(xpInput);
            if (!isNaN(val) && val >= 0) {
              onCharacterUpdate?.({ xp: val });
            }
            editingXP = false;
          }}
        />
      {:else}
        <button class="xp-display" onclick={() => { xpInput = String(character.xp || 0); editingXP = true; }} title="Click to edit XP{character.xpBonus ? ` (${character.xpBonus}% XP bonus)` : ''}">
          <span class="xp-label">XP:</span> {(character.xp || 0).toLocaleString()}{#if xpForNext} / {xpForNext.toLocaleString()}{/if}{#if character.xpBonus} <span class="xp-bonus">(+{character.xpBonus}%)</span>{/if}
        </button>
      {/if}
      {#if canLevelUp}
        <button class="btn-levelup" onclick={() => showLevelUp = true}>Level Up!</button>
      {:else if atLevelLimit}
        <span class="level-cap">Level limit reached</span>
      {/if}
    </div>
    {#if xpForNext}
      <div class="xp-bar">
        <div class="xp-fill" style="width: {Math.min(100, ((character.xp || 0) / xpForNext) * 100)}%"></div>
      </div>
    {/if}
  </div>

  <hr class="divider">

  <!-- Portrait and Basic Info -->
  <div class="top-section">
    <div class="portrait">
      <img
        src="/portraits/{portraitFilename()}"
        alt="{character.name}"
        onerror={(e) => e.target.src = '/portraits/DefaultPortrait.webp'}
      />
    </div>
    <div class="basic-info">
      <div class="info-grid">
    <div class="info-item"><span class="label">Race:</span> {character.race.name}</div>
    <div class="info-item"><span class="label">Class:</span> {className}</div>
    <div class="info-item"><span class="label">Sex:</span> {character.sex || 'Male'}</div>
    <div class="info-item"><span class="label">Alignment:</span> {character.alignment || 'True Neutral'}</div>
    {#if character.age}<div class="info-item"><span class="label">Age:</span> {character.age}</div>{/if}
    {#if character.height}<div class="info-item"><span class="label">Height:</span> {character.height}</div>{/if}
    {#if character.weight}<div class="info-item"><span class="label">Weight:</span> {character.weight}</div>{/if}
    {#if character.eyes}<div class="info-item"><span class="label">Eyes:</span> {character.eyes}</div>{/if}
    {#if character.hair}<div class="info-item"><span class="label">Hair:</span> {character.hair}</div>{/if}
    {#if character.deityKey || character.deity}<div class="info-item"><span class="label">Deity:</span> {character.deityKey ? (deities[character.deityKey]?.name || character.deity) : character.deity}</div>{/if}
    <div class="info-item">
      <span class="label">HP:</span>
      {#if editingHP}
        <input
          type="number"
          class="hp-input"
          bind:value={hpInput}
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              const val = parseInt(hpInput);
              if (!isNaN(val)) {
                onCharacterUpdate?.({ currentHP: Math.max(0, Math.min(val, hitPoints())) });
              }
              editingHP = false;
            } else if (e.key === 'Escape') {
              editingHP = false;
            }
          }}
          onblur={() => {
            const val = parseInt(hpInput);
            if (!isNaN(val)) {
              onCharacterUpdate?.({ currentHP: Math.max(0, Math.min(val, hitPoints())) });
            }
            editingHP = false;
          }}
        />
        <span>/ {hitPoints()}</span>
      {:else}
        <button class="hp-display {hpColor}" onclick={() => { hpInput = String(currentHP); editingHP = true; }} title="Click to edit current HP">
          {currentHP} / {hitPoints()}
        </button>
      {/if}
    </div>
    <div class="info-item"><span class="label">AC:</span> {baseAC()}</div>
    <div class="info-item"><span class="label">THAC0:</span> {baseTHAC0}</div>
    <div class="info-item"><span class="label">Movement:</span> {character.race.movement || 12}</div>
    <div class="info-item" class:encumbered={totalWeight() > strMods.weightAllow}><span class="label">Encumbrance:</span> {totalWeight()} / {strMods.weightAllow} lbs</div>
    {#if totalWeight() > strMods.weightAllow}
      <div class="info-item encumbered"><span class="label">⚠ Encumbered!</span></div>
    {/if}
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- Ability Scores -->
  <h3 class="section-title">Ability Scores</h3>
  <div class="abilities">
    <div class="ability">
      <div class="name meta-text">STR</div>
      <div class="score">{character.adjustedAbilities.STR}{character.abilities.exceptionalStr ? `/${character.abilities.exceptionalStr.toString().padStart(2, '0')}` : ''}</div>
      <div class="mod meta-text">{strMods.hitAdj !== 0 ? formatModifier(strMods.hitAdj) + ' hit' : '—'}</div>
    </div>
    <div class="ability">
      <div class="name meta-text">DEX</div>
      <div class="score">{character.adjustedAbilities.DEX}</div>
      <div class="mod meta-text">{dexMods.acAdj !== 0 ? formatModifier(dexMods.acAdj) + ' AC' : '—'}</div>
    </div>
    <div class="ability">
      <div class="name meta-text">CON</div>
      <div class="score">{character.adjustedAbilities.CON}</div>
      <div class="mod meta-text">{conMods.systemShock}% SS</div>
    </div>
    <div class="ability">
      <div class="name meta-text">INT</div>
      <div class="score">{character.adjustedAbilities.INT}</div>
      <div class="mod meta-text">{intMods.languages} lang</div>
    </div>
    <div class="ability">
      <div class="name meta-text">WIS</div>
      <div class="score">{character.adjustedAbilities.WIS}</div>
      <div class="mod meta-text">{wisMods.magicDefenseAdj !== 0 ? formatModifier(wisMods.magicDefenseAdj) + ' def' : '—'}</div>
    </div>
    <div class="ability">
      <div class="name meta-text">CHA</div>
      <div class="score">{character.adjustedAbilities.CHA}</div>
      <div class="mod meta-text">{chaMods.maxHenchmen} hench</div>
    </div>
  </div>

  <!-- Detailed Ability Modifiers -->
  <div class="ability-details">
    <div class="detail-col">
      <div class="detail-group">
        <h6 class="detail-header">Strength</h6>
        <div class="detail-row"><span>Hit Adj</span><span class="val">{formatModifier(strMods.hitAdj)}</span></div>
        <div class="detail-row"><span>Dmg Adj</span><span class="val">{formatModifier(strMods.dmgAdj)}</span></div>
        <div class="detail-row"><span>Weight Allow</span><span class="val">{strMods.weightAllow} lbs</span></div>
        <div class="detail-row"><span>Max Press</span><span class="val">{strMods.maxPress} lbs</span></div>
        <div class="detail-row"><span>Open Doors</span><span class="val">{strMods.openDoors}</span></div>
        <div class="detail-row"><span>Bend Bars</span><span class="val">{strMods.bendBars}%</span></div>
      </div>
      <div class="detail-group">
        <h6 class="detail-header">Dexterity</h6>
        <div class="detail-row"><span>Reaction Adj</span><span class="val">{formatModifier(dexMods.reactionAdj)}</span></div>
        <div class="detail-row"><span>AC Adj</span><span class="val">{formatModifier(dexMods.acAdj)}</span></div>
        <div class="detail-row"><span>Missile Atk Adj</span><span class="val">{formatModifier(dexMods.missileAdj)}</span></div>
      </div>
      <div class="detail-group">
        <h6 class="detail-header">Constitution</h6>
        <div class="detail-row"><span>HP Adj</span><span class="val">{formatModifier(conMods.hpAdj)}</span></div>
        <div class="detail-row"><span>System Shock</span><span class="val">{conMods.systemShock}%</span></div>
        <div class="detail-row"><span>Resurrection</span><span class="val">{conMods.resurrectionSurvival}%</span></div>
      </div>
    </div>
    <div class="detail-col">
      <div class="detail-group">
        <h6 class="detail-header">Intelligence</h6>
        <div class="detail-row"><span>Languages</span><span class="val">{intMods.languages}</span></div>
        <div class="detail-row"><span>Learn Spell</span><span class="val">{formatPercentage(intMods.learnSpell)}</span></div>
        <div class="detail-row"><span>Max Spells/Lvl</span><span class="val">{intMods.maxSpellsPerLevel}</span></div>
        <div class="detail-row"><span>Max Spell Lvl</span><span class="val">{intMods.maxSpellLevel}th</span></div>
      </div>
      <div class="detail-group">
        <h6 class="detail-header">Wisdom</h6>
        <div class="detail-row"><span>Magic Defense Adj</span><span class="val">{formatModifier(wisMods.magicDefenseAdj)}</span></div>
        {#if Object.keys(wisMods.bonusSpells).length > 0}
          <div class="detail-row"><span>Bonus Spells</span><span class="val">{Object.entries(wisMods.bonusSpells).map(([lvl, n]) => `+${n} (${lvl}st)`).join(', ')}</span></div>
        {:else}
          <div class="detail-row"><span>Bonus Spells</span><span class="val">None</span></div>
        {/if}
        <div class="detail-row"><span>Spell Failure</span><span class="val">{wisMods.spellFailure}%</span></div>
      </div>
      <div class="detail-group">
        <h6 class="detail-header">Charisma</h6>
        <div class="detail-row"><span>Max Henchmen</span><span class="val">{chaMods.maxHenchmen}</span></div>
        <div class="detail-row"><span>Loyalty Base</span><span class="val">{formatModifier(chaMods.loyaltyBase)}</span></div>
        <div class="detail-row"><span>Reaction Adj</span><span class="val">{formatModifier(chaMods.reactionAdj)}</span></div>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- Saving Throws and Combat Stats -->
  <div class="two-col">
    <div class="stat-block">
      <h3>Saving Throws</h3>
      <div class="stat-row"><span>Paralyz./Poison/Death</span> <span class="val">{savingThrows.paralysis}</span></div>
      <div class="stat-row"><span>Rod/Staff/Wand</span> <span class="val">{savingThrows.rod}</span></div>
      <div class="stat-row"><span>Petrif./Polymorph</span> <span class="val">{savingThrows.petrification}</span></div>
      <div class="stat-row"><span>Breath Weapon</span> <span class="val">{savingThrows.breath}</span></div>
      <div class="stat-row"><span>Spell</span> <span class="val">{savingThrows.spell}</span></div>
    </div>

    <div class="stat-block">
      <h3>Combat</h3>
      <div class="stat-row"><span>Base THAC0</span> <span class="val">{baseTHAC0}</span></div>
      <div class="stat-row"><span>Melee THAC0</span> <span class="val">{meleeTHAC0}</span></div>
      <div class="stat-row"><span>Missile THAC0</span> <span class="val">{missileTHAC0}</span></div>
      <div class="stat-row"><span>Damage Adj</span> <span class="val">{formatModifier(strMods.dmgAdj)}</span></div>
      <div class="stat-row"><span>AC</span> <span class="val">{baseAC()}</span></div>
      <div class="stat-row"><span>Movement</span> <span class="val">{character.race.movement || 12}</span></div>
      {#if character.cls.group === 'warrior'}
        <div class="stat-row"><span>Attacks/Round</span> <span class="val">{attacksPerRound}</span></div>
      {/if}
    </div>
  </div>

  {#if spellSlots && spellSlots.some(s => s > 0)}
    <div class="two-col" style="margin-top: 1rem;">
      <div class="stat-block">
        {#if character.cls.group === 'wizard' || character.classKey === 'bard'}
          <h3>Spellcasting</h3>
          <div class="stat-row"><span>Spell slots</span> <span class="val">{spellSlotDisplay}</span></div>
          <div class="stat-row"><span>Learn spell chance</span> <span class="val">{formatPercentage(intMods.learnSpell)}</span></div>
          <div class="stat-row"><span>Max spells/level</span> <span class="val">{intMods.maxSpellsPerLevel}</span></div>
          <div class="stat-row"><span>Max spell level</span> <span class="val">{intMods.maxSpellLevel}th</span></div>
        {:else}
          <h3>Spellcasting</h3>
          <div class="stat-row"><span>Spell slots</span> <span class="val">{spellSlotDisplay}</span></div>
          {#if Object.keys(wisMods.bonusSpells).length > 0}
            <div class="stat-row"><span>Bonus spells</span> <span class="val">{Object.entries(wisMods.bonusSpells).map(([lvl, n]) => `+${n} (${lvl})`).join(', ')}</span></div>
          {/if}
        {/if}
      </div>
      <div></div>
    </div>
  {/if}

  <hr class="divider">

  <!-- Weapons with calculated THAC0 -->
  {#if character.equipment?.weapons?.length}
    <div class="stat-block">
      <h3>Weapons</h3>
      {#each character.equipment.weapons as weapon, i}
        <div class="stat-row has-remove">
          <span>{weapon.name}</span>
          <span class="val">
            THAC0 {weapon.ranged ? missileTHAC0 : meleeTHAC0}
            · {weapon.damage}{#if !weapon.ranged && strMods.dmgAdj !== 0}{formatModifier(strMods.dmgAdj)} dmg{:else} dmg{/if}
          </span>
          <button class="remove-btn" onclick={() => removeWeapon(i)} title="Remove {weapon.name}">&times;</button>
        </div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Two Column Sections -->
  <div class="two-col">
    <!-- Proficiencies -->
    <div class="stat-block">
      <h3>Weapon Proficiencies</h3>
      {#if character.proficiencies?.weapons}
        {#each character.proficiencies.weapons as weapon}
          <div class="stat-row"><span>{weapon.name}</span></div>
        {/each}
      {/if}
    </div>

    <!-- Equipment -->
    <div class="stat-block">
      <h3>Equipment</h3>
      {#if character.equipment?.armor}
        <div class="stat-row has-remove">
          <span>Armor:</span> <span class="val">{character.equipment.armor.name} (AC {character.equipment.armor.ac})</span>
          <button class="remove-btn" onclick={removeArmor} title="Remove armor">&times;</button>
        </div>
      {/if}
      {#if character.equipment?.shield}
        <div class="stat-row has-remove">
          <span>Shield:</span> <span class="val">{character.equipment.shield.name}</span>
          <button class="remove-btn" onclick={removeShield} title="Remove shield">&times;</button>
        </div>
      {/if}
      {#if character.equipment?.gear?.length}
        {#each character.equipment.gear as item, i}
          <div class="stat-row has-remove">
            <span>{item.name}{(item.qty || 1) > 1 ? ` \u00d7${item.qty}` : ''}</span>
            <span class="val">{(item.weight || 0) * (item.qty || 1)} lbs</span>
            <button class="remove-btn" onclick={() => removeGear(i)} title="Remove {item.name}">&times;</button>
          </div>
        {/each}
      {/if}
      {#if character.equipment?.remaining !== undefined}
        <div class="stat-row">
          <span>Gold</span>
          {#if editingGold}
            <input
              type="number"
              step="0.1"
              class="gold-input"
              bind:value={goldInput}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  const val = parseFloat(goldInput);
                  if (!isNaN(val) && val >= 0) {
                    onCharacterUpdate?.({ equipment: { ...character.equipment, remaining: val } });
                  }
                  editingGold = false;
                } else if (e.key === 'Escape') {
                  editingGold = false;
                }
              }}
              onblur={() => {
                const val = parseFloat(goldInput);
                if (!isNaN(val) && val >= 0) {
                  onCharacterUpdate?.({ equipment: { ...character.equipment, remaining: val } });
                }
                editingGold = false;
              }}
            />
          {:else}
            <button class="gold-display" onclick={() => { goldInput = String(character.equipment.remaining); editingGold = true; }} title="Click to edit gold">
              {character.equipment.remaining.toFixed(1)} gp
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <hr class="divider">

  <!-- Spells -->
  {#if character.spells && character.spells.type !== 'none'}
    <div class="stat-block">
      <h3>Spells</h3>
      {#if character.spells.type === 'arcane'}
        {@const grouped = groupSpellsByLevel(character.spells.spellbook)}
        {#each Object.entries(grouped) as [level, spells]}
          <div class="spell-level-group">
            <div class="spell-level-header">{ordinalLevel(Number(level))} Level</div>
            {#each spells as spell}
              <div class="stat-row"><span>{spell.name}</span></div>
            {/each}
          </div>
        {/each}
      {:else if character.spells.type === 'divine'}
        {@const grouped = groupSpellsByLevel(character.spells.prepared)}
        {#each Object.entries(grouped) as [level, spells]}
          <div class="spell-level-group">
            <div class="spell-level-header">{ordinalLevel(Number(level))} Level</div>
            {#each spells as spell}
              <div class="stat-row"><span>{spell.name}</span></div>
            {/each}
          </div>
        {/each}
      {:else if character.spells.type === 'dual'}
        {#if character.spells.prepared?.length}
          <div class="stat-row"><span><strong>Priest Spells</strong></span></div>
          {@const grouped = groupSpellsByLevel(character.spells.prepared)}
          {#each Object.entries(grouped) as [level, spells]}
            <div class="spell-level-group">
              <div class="spell-level-header">{ordinalLevel(Number(level))} Level</div>
              {#each spells as spell}
                <div class="stat-row"><span>{spell.name}</span></div>
              {/each}
            </div>
          {/each}
        {/if}
        {#if character.spells.spellbook?.length}
          <div class="stat-row" style="margin-top: 0.5rem"><span><strong>Wizard Spells</strong></span></div>
          {@const grouped = groupSpellsByLevel(character.spells.spellbook)}
          {#each Object.entries(grouped) as [level, spells]}
            <div class="spell-level-group">
              <div class="spell-level-header">{ordinalLevel(Number(level))} Level</div>
              {#each spells as spell}
                <div class="stat-row"><span>{spell.name}</span></div>
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
        <div class="stat-row"><span>{prof.name}</span> <span class="val">{prof.ability}</span></div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Thief Skills -->
  {#if isThiefClass && thiefSkills()}
    <div class="stat-block">
      <h3>Thief Skills</h3>
      {#each Object.entries(thiefSkills()) as [key, value]}
        {#if key === 'readLanguages' && charLevel < 4}
          <div class="stat-row locked"><span>{SKILL_LABELS[key]}</span> <span class="val">Lv 4</span></div>
        {:else}
          <div class="stat-row"><span>{SKILL_LABELS[key]}</span> <span class="val">{value}%</span></div>
        {/if}
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Languages -->
  {#if character.proficiencies?.languages}
    <div class="stat-block">
      <h3>Languages</h3>
      <div class="stat-row"><span>{character.proficiencies.languages.map(l => l.name).join(', ')}</span></div>
    </div>
    <hr class="divider">
  {/if}

  <!-- Racial Abilities -->
  {#if character.race?.traits?.length}
    <div class="stat-block">
      <h3>Racial Abilities</h3>
      {#each character.race.traits as trait}
        <div class="trait-row">◆ {trait}</div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Class Features -->
  {#if character.cls?.features?.length}
    <div class="stat-block">
      <h3>Class Features</h3>
      {#each character.cls.features as feature}
        <div class="trait-row">◆ {feature}</div>
      {/each}
    </div>
    <hr class="divider">
  {/if}

  <!-- Turn Undead -->
  {#if canTurnUndead && turnUndeadRow()}
    <div class="stat-block">
      <h3>Turn Undead</h3>
      <div class="turn-undead-grid">
        {#each turnUndeadRow().types as type, i}
          <div class="turn-col">
            <div class="turn-type">{type}</div>
            <div class="turn-val" class:turn-auto={turnUndeadRow().values[i] === 'T' || turnUndeadRow().values[i] === 'D'}>{formatTurnResult(turnUndeadRow().values[i])}</div>
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
    <h3 class="section-title">Notes</h3>
    <textarea
      class="notes-textarea"
      bind:value={notesValue}
      onblur={saveNotes}
      placeholder="Add notes here..."
      rows="4"
    ></textarea>
  </div>
  <hr class="divider">

  <!-- Footer -->
  <div class="sheet-footer">
    Advanced Dungeons &amp; Dragons — 2nd Edition · {character.name}
  </div>

  <!-- Toast Messages -->
  <div class="toast-area">
    {#if showShareMessage}
      <p class="share-message">{shareMessage}</p>
    {/if}
    {#if showUndoMessage}
      <p class="undo-toast">{undoMessage}</p>
    {/if}
  </div>
</div>

{#if showLevelUp}
  {#await import('./LevelUpWizard.svelte') then module}
    {@const LevelUpWizard = module.default}
    <LevelUpWizard
      {character}
      onComplete={(updates) => {
        onCharacterUpdate?.(updates);
        showLevelUp = false;
      }}
      onCancel={() => showLevelUp = false}
    />
  {/await}
{/if}


<style lang="scss">
  @import '../styles/mixins.scss';

  .sheet {
    max-width: 800px;
    margin: 0 auto;
    background: var(--bg-card);
    border: 3px solid var(--border-strong);
    box-shadow: 0 0 40px var(--shadow-color);
    padding: $space-2xl;
    position: relative;
  }

  .sheet::before {
    content: '';
    position: absolute;
    top: 8px; left: 8px; right: 8px; bottom: 8px;
    border: 1px solid var(--border-color);
    pointer-events: none;
  }

  .subtitle {
    text-align: center;
    color: var(--text-muted);
  }

  .xp-section {
    margin-top: $space-sm;
    text-align: center;
  }

  .xp-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-sm;
  }

  .xp-display {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-body);
    cursor: pointer;
    padding: $space-xs $space-sm;
    border-radius: 4px;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--border-color);
    }

    .xp-label {
      color: var(--text-muted);
      font-weight: 600;
    }
  }

  .xp-input {
    width: 120px;
    padding: $space-xs $space-sm;
    border: 1px solid var(--gold);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    text-align: center;
  }

  .xp-bar {
    height: 6px;
    background: var(--bg-subtle);
    border-radius: 3px;
    margin-top: $space-xs;
    overflow: hidden;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .xp-fill {
    height: 100%;
    background: linear-gradient(to right, var(--gold-dark), var(--gold));
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .btn-levelup {
    background: linear-gradient(135deg, var(--gold-dark), var(--gold));
    color: var(--text-primary);
    border: 2px solid var(--gold);
    border-radius: 4px;
    padding: $space-xs $space-md;
    font-weight: 700;
    cursor: pointer;
    animation: pulse-glow 2s ease-in-out infinite;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 4px rgba(201, 162, 39, 0.4); }
    50% { box-shadow: 0 0 12px rgba(201, 162, 39, 0.8); }
  }

  .has-remove {
    flex-wrap: nowrap;

    // Name takes up available space, val stays right, button is fixed at end
    > span:first-child {
      flex: 1;
      min-width: 0;
    }

    > .val {
      flex-shrink: 0;
      text-align: right;
    }

    .remove-btn {
      opacity: 0;
      transition: opacity 0.15s;
    }

    &:hover .remove-btn {
      opacity: 0.5;
    }
  }

  .remove-btn {
    background: transparent;
    border: none;
    color: var(--red);
    font-size: 1.1rem;
    cursor: pointer;
    margin-left: $space-md;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
    width: 1.4rem;
    height: 1.4rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1 !important;
    }
  }

  .gold-display {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-body);
    cursor: pointer;
    padding: 0 $space-xs;
    border-radius: 4px;
    font-weight: inherit;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--border-color);
    }
  }

  .gold-input {
    width: 80px;
    padding: $space-xs $space-sm;
    border: 1px solid var(--gold);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    text-align: right;
  }

  .xp-bonus {
    color: var(--green);
    font-size: $text-sm;
  }

  .level-cap {
    color: var(--text-muted);
    font-style: italic;
    font-size: $text-sm;
  }

  .label {
    color: var(--text-muted);
  }

  .divider {
    border: none;
    height: 2px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    margin: $space-lg 0;
  }

  .top-section {
    display: flex;
    gap: $space-xl;
    align-items: flex-start;
    margin-bottom: 8px;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .portrait {
    flex-shrink: 0;
    width: 200px;
  }

  .portrait img {
    width: 100%;
    border: 3px solid var(--gold);
    box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.3);
  }

  .basic-info {
    flex: 1;
    width: 100%;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-xs $space-lg;
  }

  .info-item {
    padding: $space-xs 0;

    &.encumbered {
      color: var(--red);

      .label {
        color: var(--red);
      }
    }
  }

  .abilities {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: $space-sm;
    text-align: center;
  }

  .ability {
    border: 2px solid var(--border-color);
    padding: $space-md $space-xs;
    background: var(--bg-input);
  }

  .ability-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-lg;
    margin-top: $space-md;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .detail-col {
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }

  .detail-group {
    .detail-header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: $space-xs;
    }
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: $space-xs 0;
    border-bottom: 1px dotted var(--border-color);
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-lg;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .stat-block h3 {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: $space-xs;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: $space-xs 0;
    border-bottom: 1px dotted var(--border-color);

    &.locked {
      opacity: 0.4;
      font-style: italic;
    }
  }

  .trait-row {
    padding: $space-xs 0;
    border-bottom: 1px dotted var(--border-color);
  }

  .backstory-text {
    white-space: pre-wrap;
  }

  .sheet-footer {
    text-align: center;
    margin-top: $space-sm;
    margin-bottom: $space-md;
  }

  .hamburger-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1.4rem;
    cursor: pointer;
    padding: $space-xs $space-sm;
    z-index: 10;
    color: var(--text-body);
    transition: border-color 0.2s, background 0.2s;
    line-height: 1;

    &:hover {
      border-color: var(--gold);
      background: var(--bg-hover);
    }
  }

  .action-menu {
    position: absolute;
    top: 48px;
    right: 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-strong);
    border-radius: 4px;
    box-shadow: 0 4px 16px var(--shadow-color);
    z-index: 20;
    min-width: 180px;
    padding: $space-xs 0;
  }

  .menu-group {
    padding: $space-xs 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }
  }

  .menu-item {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    color: var(--text-body);
    padding: $space-sm $space-md;
    text-align: left;
    cursor: pointer;
    font-size: $text-sm;
    transition: background 0.15s;

    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
  }

  .menu-confirm {
    display: flex;
    align-items: center;
    gap: $space-xs;
    padding: $space-xs $space-md;
    font-size: $text-sm;
    color: var(--text-muted);
  }

  .toast-area {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-sm;
    margin-top: $space-sm;
  }

  .undo-toast {
    padding: $space-sm $space-md;
    background: rgba(100, 100, 180, 0.15);
    border: 1px solid rgba(100, 100, 180, 0.3);
    border-radius: 4px;
    color: var(--text-body);
    animation: fade-in-out 1.5s ease-in-out;
  }

  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(4px); }
    15% { opacity: 1; transform: translateY(0); }
    75% { opacity: 1; }
    100% { opacity: 0; }
  }

  // HP tracker styles
  .hp-display {
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    padding: 0 $space-xs;
    border-radius: 4px;
    font-weight: 600;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--border-color);
    }

    &.hp-green { color: var(--green); }
    &.hp-yellow { color: #c89b2a; }
    &.hp-red { color: var(--red); }
  }

  .hp-input {
    width: 60px;
    padding: $space-xs $space-sm;
    border: 1px solid var(--gold);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    text-align: center;
  }

  // Turn undead grid
  .turn-undead-grid {
    display: flex;
    flex-wrap: wrap;
    gap: $space-xs;
    margin-top: $space-sm;
  }

  .turn-col {
    text-align: center;
    min-width: 52px;
    flex: 1;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: $space-xs;
    background: var(--bg-input);
  }

  .turn-type {
    font-size: $text-xs;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: $space-xs;
    margin-bottom: $space-xs;
  }

  .turn-val {
    font-weight: 600;
    font-size: $text-sm;

    &.turn-auto {
      color: var(--green);
    }
  }

  .turn-legend {
    margin-top: $space-xs;
    font-size: $text-xs;
    color: var(--text-muted);
    text-align: center;
  }


  .spell-level-group {
    margin-bottom: $space-xs;
  }

  .spell-level-header {
    font-weight: 600;
    color: var(--text-muted);
    padding: $space-xs 0;
    border-bottom: 1px dotted var(--border-color);
    margin-top: $space-sm;
  }

  // Notes styles
  .notes-section {
    .section-title {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: $space-xs;
    }
  }

  .notes-textarea {
    width: 100%;
    padding: $space-md;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-body);
    resize: vertical;
    min-height: 80px;
    margin-top: $space-sm;

    &::placeholder {
      color: var(--text-faint);
    }
  }

  .share-message {
    padding: $space-sm $space-md;
    background: rgba(34, 139, 34, 0.15);
    border: 1px solid rgba(34, 139, 34, 0.3);
    border-radius: 4px;
    color: var(--green);
  }

  /* Print Styles */
  @media print {
    .sheet {
      max-width: 100%;
      margin: 0;
      padding: $space-lg;
      box-shadow: none;
      border: 2px solid #000;
      background: white !important;
    }

    .sheet::before {
      border-color: #000;
    }

    h1, .subtitle, .section-title, .stat-block h3, .ability .name,
    .detail-group .detail-header, .sheet-footer {
      color: #000 !important;
    }

    .info-item, .stat-row, .detail-row, .trait-row, .backstory-text {
      color: #000 !important;
    }

    .ability .score {
      color: #000 !important;
    }

    .ability, .info-item {
      background: white !important;
      border-color: #000 !important;
    }

    .divider {
      background: #000;
      opacity: 0.3;
    }

    .hamburger-btn, .action-menu, .toast-area, .remove-btn, .gold-display, .xp-section {
      display: none !important; /* Hide interactive elements when printing */
    }

    .notes-empty {
      display: none !important;
    }

    .notes-textarea {
      border: none;
      background: transparent;
      resize: none;
      padding: 0;
    }

    /* Ensure page breaks nicely */
    .sheet {
      page-break-inside: avoid;
    }

    .stat-block {
      page-break-inside: avoid;
    }

    .portrait img {
      border-color: #000 !important;
    }

    .top-section {
      page-break-inside: avoid;
    }

    .ability-details {
      page-break-inside: avoid;
    }
  }
</style>
