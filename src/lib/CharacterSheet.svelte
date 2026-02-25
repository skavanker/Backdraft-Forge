<script>
  import Tooltip from './Tooltip.svelte';
  import ImportArea from './ImportArea.svelte';
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

  let { character, onImport } = $props();

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

  // Calculate saving throws and combat stats
  let savingThrows = $derived(getSavingThrows(character.cls.group, 1));
  let baseTHAC0 = $derived(getBaseTHAC0(character.cls.group, 1));

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

  // Calculate HP using CON modifier from mechanics
  let hitPoints = $derived(() => {
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
  let shareLinkWarning = $derived(
    (character.backstory?.length || 0) > 300
      ? 'Long backstory may make the share link too large for some browsers. Use Export Code instead for full fidelity.'
      : ''
  );
</script>

<div class="sheet">
  <h1>{character.name}</h1>
  <div class="subtitle">{character.race.name} {className} · Level 1</div>

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
    {#if character.deity}<div class="info-item"><span class="label">Deity:</span> {character.deity}</div>{/if}
    <div class="info-item"><span class="label">HP:</span> {hitPoints()}</div>
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
    </div>
  </div>

  {#if character.cls.group === 'wizard' || character.cls.group === 'priest'}
    <div class="two-col" style="margin-top: 1rem;">
      <div class="stat-block">
        {#if character.cls.group === 'wizard'}
          <h3>Spellcasting</h3>
          <div class="stat-row"><span>Spells per day</span> <span class="val">1 (1st level)</span></div>
          <div class="stat-row"><span>Learn spell chance</span> <span class="val">{formatPercentage(intMods.learnSpell)}</span></div>
          <div class="stat-row"><span>Max spells/level</span> <span class="val">{intMods.maxSpellsPerLevel}</span></div>
          <div class="stat-row"><span>Max spell level</span> <span class="val">{intMods.maxSpellLevel}th</span></div>
        {:else}
          <h3>Spellcasting</h3>
          <div class="stat-row"><span>Spells per day</span> <span class="val">1 (1st level)</span></div>
          {#if Object.keys(wisMods.bonusSpells).length > 0}
            <div class="stat-row"><span>Bonus spells</span> <span class="val">+{wisMods.bonusSpells[1] || 0} (1st)</span></div>
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
      {#each character.equipment.weapons as weapon}
        <div class="stat-row">
          <span>{weapon.name}</span>
          <span class="val">
            THAC0 {weapon.ranged ? missileTHAC0 : meleeTHAC0}
            · {weapon.damage}{#if !weapon.ranged && strMods.dmgAdj !== 0}{formatModifier(strMods.dmgAdj)} dmg{:else} dmg{/if}
          </span>
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
        <div class="stat-row"><span>Armor:</span> <span class="val">{character.equipment.armor.name} (AC {character.equipment.armor.ac})</span></div>
      {/if}
      {#if character.equipment?.shield}
        <div class="stat-row"><span>Shield:</span> <span class="val">{character.equipment.shield.name}</span></div>
      {/if}
      {#if character.equipment?.gear?.length}
        {#each character.equipment.gear as item}
          <div class="stat-row"><span>{item.name}{(item.qty || 1) > 1 ? ` \u00d7${item.qty}` : ''}</span> <span class="val">{(item.weight || 0) * (item.qty || 1)} lbs</span></div>
        {/each}
      {/if}
      {#if character.equipment?.remaining !== undefined}
        <div class="stat-row"><span>Gold</span> <span class="val">{character.equipment.remaining.toFixed(1)} gp</span></div>
      {/if}
    </div>
  </div>

  <hr class="divider">

  <!-- Spells -->
  {#if character.spells && character.spells.type !== 'none'}
    <div class="stat-block">
      <h3>Spells</h3>
      {#if character.spells.type === 'arcane'}
        <div class="stat-row"><span>Spellbook:</span></div>
        {#each character.spells.spellbook as spell}
          <div class="stat-row"><span>{spell.name}</span></div>
        {/each}
      {:else if character.spells.type === 'divine'}
        <div class="stat-row"><span>Prepared Spells:</span></div>
        {#each character.spells.prepared as spell}
          <div class="stat-row"><span>{spell.name}</span></div>
        {/each}
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

  <!-- Backstory -->
  {#if character.backstory}
    <div class="stat-block">
      <h3>Backstory</h3>
      <p class="backstory-text">{character.backstory}</p>
    </div>
    <hr class="divider">
  {/if}

  <!-- Footer -->
  <div class="sheet-footer">
    Advanced Dungeons &amp; Dragons — 2nd Edition · {character.name}
  </div>

  <!-- Actions -->
  <div class="sheet-actions">
    <div class="action-buttons">
      {#if shareLinkWarning}
        <Tooltip text={shareLinkWarning} position="bottom">
          <button class="btn-primary btn-warn" onclick={shareCharacter}>
            📋 Share Link ⚠
          </button>
        </Tooltip>
      {:else}
        <button class="btn-primary" onclick={shareCharacter}>
          📋 Share Link
        </button>
      {/if}
      <button class="btn-primary" onclick={exportCode}>
        📦 Export Code
      </button>
      <ImportArea {onImport} />
    </div>
    {#if showShareMessage}
      <p class="share-message">{shareMessage}</p>
    {/if}
  </div>
</div>

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

  .sheet-actions {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-sm;
    margin-top: $space-md;
  }

  .action-buttons {
    display: flex;
    gap: $space-sm;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-warn {
    border-color: rgba(180, 140, 40, 0.6);
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

    .sheet-actions {
      display: none; /* Hide share button when printing */
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
