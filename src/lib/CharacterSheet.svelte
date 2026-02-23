<script>
  import { generateShareableUrl, copyToClipboard } from './shareCharacter.js';

  let { character } = $props();

  let shareMessage = $state('');
  let showShareMessage = $state(false);

  async function shareCharacter() {
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

  // Calculate AC
  let baseAC = $derived(() => {
    let ac = 10;
    if (character.equipment?.armor) ac = character.equipment.armor.ac;
    if (character.equipment?.shield) ac -= character.equipment.shield.acBonus;
    const dex = character.adjustedAbilities.DEX;
    if (dex >= 16) ac -= 2;
    else if (dex >= 15) ac -= 1;
    return ac;
  });

  // Calculate HP
  let hitPoints = $derived(() => {
    const hitDie = character.cls.hitDie;
    const match = hitDie.match(/d(\d+)/);
    const dieMax = match ? parseInt(match[1]) : 4;
    const con = character.adjustedAbilities.CON;
    let conBonus = 0;
    if (con >= 17) conBonus = 3;
    else if (con >= 16) conBonus = 2;
    else if (con >= 15) conBonus = 1;
    else if (con <= 6) conBonus = -1;
    else if (con <= 3) conBonus = -2;
    return Math.max(1, dieMax + conBonus);
  });

  let className = $derived(character.wizardSchool?.name || character.cls.name);
</script>

<div class="sheet">
  <h1>{character.name}</h1>
  <div class="subtitle">{character.race.name} {className} · Level 1</div>

  <hr class="divider">

  <!-- Basic Info -->
  <div class="info-grid">
    <div class="info-item"><span class="label">Race:</span> {character.race.name}</div>
    <div class="info-item"><span class="label">Class:</span> {className}</div>
    <div class="info-item"><span class="label">HP:</span> {hitPoints()}</div>
    <div class="info-item"><span class="label">AC:</span> {baseAC()}</div>
    <div class="info-item"><span class="label">THAC0:</span> 20</div>
    <div class="info-item"><span class="label">Movement:</span> {character.race.movement || 12}</div>
  </div>

  <hr class="divider">

  <!-- Ability Scores -->
  <div class="section-title">Ability Scores</div>
  <div class="abilities">
    {#each ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as ability}
      <div class="ability">
        <div class="name">{ability}</div>
        <div class="score">{character.adjustedAbilities[ability]}</div>
      </div>
    {/each}
  </div>

  <hr class="divider">

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
        <div class="stat-row"><span>Armor:</span> <span class="val">{character.equipment.armor.name}</span></div>
      {/if}
      {#if character.equipment?.shield}
        <div class="stat-row"><span>Shield:</span> <span class="val">{character.equipment.shield.name}</span></div>
      {/if}
      {#if character.equipment?.weapons}
        {#each character.equipment.weapons as weapon}
          <div class="stat-row"><span>{weapon.name}</span></div>
        {/each}
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

  <!-- Backstory -->
  {#if character.backstory}
    <div class="stat-block">
      <h3>Backstory</h3>
      <p class="backstory-text">{character.backstory}</p>
    </div>
    <hr class="divider">
  {/if}

  <!-- Share Button -->
  <div class="sheet-actions">
    <button class="btn-primary" onclick={shareCharacter}>
      📋 Share Character
    </button>
    {#if showShareMessage}
      <p class="share-message">{shareMessage}</p>
    {/if}
  </div>
</div>

<style lang="scss">
  .sheet {
    max-width: 800px;
    margin: 0 auto;
    background: var(--bg-card);
    border: 3px solid var(--border-strong);
    box-shadow: 0 0 40px var(--shadow-color);
    padding: 2.5rem;
    position: relative;
  }

  .sheet::before {
    content: '';
    position: absolute;
    top: 8px; left: 8px; right: 8px; bottom: 8px;
    border: 1px solid var(--border-color);
    pointer-events: none;
  }

  h1 {
    font-family: 'Cinzel', serif;
    font-size: 2.2em;
    text-align: center;
    color: var(--text-primary);
    letter-spacing: 0.08em;
    margin-bottom: 2px;
  }

  .subtitle {
    text-align: center;
    font-size: 1.1em;
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 1.5rem;
    letter-spacing: 0.15em;
  }

  .divider {
    border: none;
    height: 2px;
    background: linear-gradient(to right, transparent, var(--gold), transparent);
    margin: 1.25rem 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem 1.5rem;
  }

  .info-item {
    font-size: 1.05em;
    padding: 0.2rem 0;

    .label {
      font-weight: 600;
      color: var(--text-muted);
    }
  }

  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 1.3em;
    color: var(--text-primary);
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
  }

  .abilities {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    text-align: center;
  }

  .ability {
    border: 2px solid var(--border-color);
    padding: 0.75rem 0.25rem;
    background: var(--bg-input);

    .name {
      font-family: 'Cinzel', serif;
      font-size: 0.75em;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .score {
      font-size: 1.8em;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .stat-block h3 {
    font-family: 'Cinzel', serif;
    font-size: 1em;
    color: var(--text-primary);
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 0.2rem 0;
    font-size: 0.95em;
    border-bottom: 1px dotted var(--border-color);

    .val {
      font-weight: 600;
    }
  }

  .backstory-text {
    font-size: 0.95em;
    line-height: 1.6;
    color: var(--text-body);
    white-space: pre-wrap;
  }

  .sheet-actions {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .share-message {
    margin: 0;
    padding: 0.5rem 1rem;
    background: rgba(34, 139, 34, 0.15);
    border: 1px solid rgba(34, 139, 34, 0.3);
    border-radius: 4px;
    color: #228b22;
    font-size: 0.875rem;
  }

  /* Print Styles */
  @media print {
    .sheet {
      max-width: 100%;
      margin: 0;
      padding: 1.5rem;
      box-shadow: none;
      border: 2px solid #000;
      background: white !important;
    }

    .sheet::before {
      border-color: #000;
    }

    h1, .subtitle, .section-title, .stat-block h3, .ability .name {
      color: #000 !important;
    }

    .info-item, .stat-row, .backstory-text {
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
  }
</style>
