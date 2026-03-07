<script>
  /**
   * MonsterStatBlock - Individual monster card display
   * Shows complete AD&D 2E stat block in a card format
   */

  let {
    monster,
    onSave = null,
    onDelete = null,
    saved = false
  } = $props();

  // Check if monster is already saved (passed from parent)
  const isSaved = $derived(saved);
</script>

<div class="monster-stat-block panel">
  <!-- Header -->
  <header class="monster-header">
    <div>
      <h4>{monster.name}</h4>
      <div class="monster-meta">
        <span class="badge badge-warning">{monster.type}</span>
        <span class="badge badge-muted">{monster.size}</span>
      </div>
    </div>
  </header>

  <!-- Key Combat Stats -->
  <div class="monster-combat-row">
    <div class="stat">
      <span class="label">AC</span>
      <span class="value">{monster.ac}</span>
    </div>
    <div class="stat">
      <span class="label">HD</span>
      <span class="value">{monster.hitDice}</span>
    </div>
    <div class="stat">
      <span class="label">HP</span>
      <span class="value">{monster.hp}</span>
    </div>
    <div class="stat">
      <span class="label">THAC0</span>
      <span class="value">{monster.thac0}</span>
    </div>
    <div class="stat">
      <span class="label">XP</span>
      <span class="value">{monster.xp.toLocaleString()}</span>
    </div>
  </div>

  <!-- Attacks -->
  <div class="monster-attacks">
    <strong>#AT:</strong> {monster.numAttacks}
    <span class="text-muted">({monster.attacks.join(', ')})</span>
    <br />
    <strong>Dmg:</strong> {monster.damage}
  </div>

  <!-- Special Abilities -->
  {#if monster.specialAbilities?.length > 0}
    <div class="monster-specials">
      <strong>Special:</strong>
      <ul class="special-list">
        {#each monster.specialAbilities as ability}
          <li>{ability}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Stats Row -->
  <div class="monster-stats-row">
    <div><strong>MV:</strong> {monster.movement}</div>
    <div><strong>Morale:</strong> {monster.morale}</div>
    <div><strong>Int:</strong> {monster.intelligence}</div>
  </div>

  <!-- Treasure & Alignment -->
  <div class="monster-treasure">
    <strong>Treasure:</strong> {monster.treasureType || 'None'}
    <span class="text-muted monster-alignment">{monster.alignment}</span>
  </div>

  <!-- Description -->
  {#if monster.description}
    <p class="monster-description">{monster.description}</p>
  {/if}

  <!-- Habitat -->
  {#if monster.habitat}
    <p class="monster-habitat"><strong>Habitat:</strong> {monster.habitat}</p>
  {/if}

  <!-- Actions -->
  <div class="action-bar end">
    {#if onSave && !isSaved}
      <button class="btn-primary btn-sm" onclick={() => onSave(monster)}>
        Save to Favorites
      </button>
    {/if}
    {#if onDelete && isSaved}
      <button class="btn-secondary btn-sm" onclick={() => onDelete(monster.key)}>
        Remove
      </button>
    {/if}
  </div>
</div>