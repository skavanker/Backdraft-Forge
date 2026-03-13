<script>
  import StatBlock from './StatBlock.svelte';

  let { monster, onSave = null, onDelete = null, saved = false } = $props();

  const badges = [
    { label: monster.type, cls: 'badge-warning' },
    { label: monster.size, cls: 'badge-muted' },
  ];

  const stats = [
    { label: 'AC',    value: monster.ac },
    { label: 'HD',    value: monster.hitDice },
    { label: 'HP',    value: monster.hp },
    { label: 'THAC0', value: monster.thac0 },
    { label: 'XP',    value: monster.xp.toLocaleString() },
  ];
</script>

<StatBlock extraClass="monster-stat-block" name={monster.name} {badges} {stats}>
  <div class="npc-abilities">
    <strong>#AT:</strong> {monster.numAttacks}
    <span class="text-muted">({monster.attacks.join(', ')})</span>
    <br />
    <strong>Dmg:</strong> {monster.damage}
  </div>

  {#if monster.specialAbilities?.length > 0}
    <div class="npc-abilities">
      <strong>Special:</strong>
      <ul class="special-list">
        {#each monster.specialAbilities as ability}
          <li>{ability}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="npc-abilities">
    <strong>MV:</strong> {monster.movement} &nbsp;
    <strong>Morale:</strong> {monster.morale} &nbsp;
    <strong>Int:</strong> {monster.intelligence}
  </div>

  <div class="npc-abilities">
    <strong>Treasure:</strong> {monster.treasureType || 'None'}
    <span class="text-muted">{monster.alignment}</span>
  </div>

  {#if monster.description}
    <p class="npc-abilities" style="--font-style: italic">{monster.description}</p>
  {/if}

  {#if monster.habitat}
    <p class="npc-abilities"><strong>Habitat:</strong> {monster.habitat}</p>
  {/if}

  {#snippet actions()}
    {#if onSave && !saved}
      <button class="btn-primary btn-sm" onclick={() => onSave(monster)}>Save to Favorites</button>
    {/if}
    {#if onDelete && saved}
      <button class="btn-secondary btn-sm" onclick={() => onDelete(monster.key)}>Remove</button>
    {/if}
  {/snippet}
</StatBlock>
