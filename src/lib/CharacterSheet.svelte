<script>
  let { character } = $props();

  // Calculate AC
  let baseAC = $derived(() => {
    let ac = 10; // Base AC without armor
    if (character.equipment?.armor) {
      ac = character.equipment.armor.ac;
    }
    if (character.equipment?.shield) {
      ac -= character.equipment.shield.acBonus;
    }
    // DEX bonus (simplified)
    const dex = character.adjustedAbilities.DEX;
    if (dex >= 16) ac -= 2;
    else if (dex >= 15) ac -= 1;
    return ac;
  });

  // Calculate HP (max at level 1)
  let hitPoints = $derived(() => {
    const hitDie = character.cls.hitDie;
    const match = hitDie.match(/d(\d+)/);
    const dieMax = match ? parseInt(match[1]) : 4;

    // CON bonus
    const con = character.adjustedAbilities.CON;
    let conBonus = 0;
    if (con >= 17) conBonus = 3;
    else if (con >= 16) conBonus = 2;
    else if (con >= 15) conBonus = 1;
    else if (con <= 6) conBonus = -1;
    else if (con <= 3) conBonus = -2;

    return Math.max(1, dieMax + conBonus);
  });

  // Get class display name
  let className = $derived(
    character.wizardSchool?.name || character.cls.name
  );
</script>

<div class="character-sheet">
  <header class="sheet-header">
    <h2 class="char-name">{character.name}</h2>
    <p class="char-title">
      {character.race.name} {className}
    </p>
  </header>

  <div class="sheet-grid">
    <!-- Combat Stats -->
    <section class="sheet-section combat-section">
      <h3>Combat</h3>
      <div class="stat-block">
        <div class="big-stat">
          <span class="stat-label">AC</span>
          <span class="stat-value">{baseAC()}</span>
        </div>
        <div class="big-stat">
          <span class="stat-label">HP</span>
          <span class="stat-value">{hitPoints()}</span>
        </div>
        <div class="big-stat">
          <span class="stat-label">Level</span>
          <span class="stat-value">1</span>
        </div>
      </div>
    </section>

    <!-- Ability Scores -->
    <section class="sheet-section">
      <h3>Ability Scores</h3>
      <div class="ability-grid">
        {#each ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as ability}
          <div class="ability-box">
            <span class="ability-name">{ability}</span>
            <span class="ability-score">
              {character.adjustedAbilities[ability]}{#if ability === 'STR' && character.abilities.exceptionalStr}/{character.abilities.exceptionalStr.toString().padStart(2, '0')}{/if}
            </span>
          </div>
        {/each}
      </div>
    </section>

    <!-- Class Info -->
    <section class="sheet-section">
      <h3>Class Info</h3>
      <div class="info-rows">
        <div class="info-row">
          <span>Hit Die</span>
          <span>{character.cls.hitDie}</span>
        </div>
        {#if character.xpBonus > 0}
          <div class="info-row highlight">
            <span>XP Bonus</span>
            <span>+{character.xpBonus}%</span>
          </div>
        {/if}
        {#if character.levelLimit}
          <div class="info-row">
            <span>Level Limit</span>
            <span>{character.levelLimit}</span>
          </div>
        {/if}
        {#if character.wizardSchool}
          <div class="info-row">
            <span>School</span>
            <span>{character.wizardSchool.school}</span>
          </div>
        {/if}
      </div>
    </section>

    <!-- Proficiencies -->
    <section class="sheet-section">
      <h3>Proficiencies</h3>
      <div class="prof-group">
        <h4>Weapons</h4>
        <ul class="prof-list">
          {#each character.proficiencies.weapons as weapon}
            <li>{weapon.name}</li>
          {/each}
        </ul>
      </div>
      {#if character.proficiencies.nonWeapon.length > 0}
        <div class="prof-group">
          <h4>Skills</h4>
          <ul class="prof-list">
            {#each character.proficiencies.nonWeapon as skill}
              <li>{skill.name} ({skill.ability})</li>
            {/each}
          </ul>
        </div>
      {/if}
    </section>

    <!-- Equipment -->
    <section class="sheet-section">
      <h3>Equipment</h3>
      <div class="equip-list">
        {#if character.equipment.armor}
          <div class="equip-item">
            <span class="equip-name">{character.equipment.armor.name}</span>
            <span class="equip-note">AC {character.equipment.armor.ac}</span>
          </div>
        {/if}
        {#if character.equipment.shield}
          <div class="equip-item">
            <span class="equip-name">{character.equipment.shield.name}</span>
          </div>
        {/if}
        {#each character.equipment.weapons as weapon}
          <div class="equip-item">
            <span class="equip-name">{weapon.name}</span>
            <span class="equip-note">{weapon.damage}</span>
          </div>
        {/each}
        {#each character.equipment.gear as item}
          <div class="equip-item">
            <span class="equip-name">{item.name}</span>
          </div>
        {/each}
      </div>
      <div class="gold-remaining">
        Gold: {character.equipment.remaining.toFixed(1)} gp
      </div>
    </section>

    <!-- Spells -->
    {#if character.spells?.type !== 'none'}
      <section class="sheet-section">
        <h3>Spells</h3>
        {#if character.spells.type === 'arcane'}
          <div class="spell-group">
            <h4>Spellbook</h4>
            <ul class="spell-list">
              {#each character.spells.spellbook as spell}
                <li>{spell.name}</li>
              {/each}
            </ul>
          </div>
          <p class="spell-note">Spells per day: {character.spells.spellsPerDay}</p>
        {:else if character.spells.type === 'divine'}
          <div class="spell-group">
            <h4>Prepared Today</h4>
            <ul class="spell-list">
              {#each character.spells.prepared as spell}
                <li>{spell.name}</li>
              {/each}
            </ul>
          </div>
          <p class="spell-note">Spells per day: {character.spells.spellsPerDay}</p>
        {/if}
      </section>
    {/if}

    <!-- Backstory -->
    {#if character.backstory}
      <section class="sheet-section backstory-section">
        <h3>Backstory</h3>
        <p class="backstory-text">{character.backstory}</p>
      </section>
    {/if}
  </div>

  <div class="sheet-actions">
    <p class="coming-soon">PDF export and shareable link coming soon!</p>
  </div>
</div>

<style lang="scss">
  .character-sheet {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sheet-header {
    text-align: center;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--gold);

    .char-name {
      margin: 0;
      font-size: 2rem;
      font-family: 'Cinzel', serif;
      color: var(--text-primary);
    }

    .char-title {
      margin: 0.25rem 0 0;
      font-size: 1.1rem;
      color: var(--text-muted);
    }
  }

  .sheet-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .sheet-section {
    padding: 1rem;
    background: var(--bg-panel);
    border-radius: 4px;
    border: 1px solid var(--border-color);

    h3 {
      margin: 0 0 0.75rem;
      font-size: 1rem;
      color: var(--gold-dark);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.25rem;
    }
  }

  .combat-section {
    .stat-block {
      display: flex;
      justify-content: space-around;
    }

    .big-stat {
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        text-transform: uppercase;
      }

      .stat-value {
        font-family: 'Cinzel', serif;
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
      }
    }
  }

  .ability-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .ability-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: var(--bg-subtle);
    border-radius: 4px;

    .ability-name {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }

    .ability-score {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
  }

  .info-rows {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;

    span:first-child {
      color: var(--text-muted);
    }

    span:last-child {
      font-weight: 600;
      color: var(--text-primary);
    }

    &.highlight span:last-child {
      color: #228b22;
    }
  }

  .prof-group {
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 0.25rem;
      font-size: 0.85rem;
      color: var(--text-body);
    }
  }

  .prof-list,
  .spell-list {
    margin: 0;
    padding-left: 1.25rem;
    font-size: 0.85rem;
    color: var(--text-body);

    li {
      margin-bottom: 0.1rem;
    }
  }

  .equip-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .equip-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;

    .equip-name {
      color: var(--text-body);
    }

    .equip-note {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
  }

  .gold-remaining {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
    font-size: 0.9rem;
    color: var(--gold);
    font-weight: 600;
  }

  .spell-group {
    h4 {
      margin: 0 0 0.25rem;
      font-size: 0.85rem;
      color: var(--text-body);
    }
  }

  .spell-note {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .backstory-section {
    grid-column: 1 / -1;
  }

  .backstory-text {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--text-body);
    white-space: pre-wrap;
  }

  .sheet-actions {
    text-align: center;
  }

  .coming-soon {
    color: var(--text-muted);
    font-style: italic;
  }
</style>
