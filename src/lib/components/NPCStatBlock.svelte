<script>
  import { getStrengthModifiers, getDexterityModifiers, formatModifier } from '../../data/mechanics.js';

  let { npc, onSave = null, onDelete = null, showActions = true } = $props();

  const strMods = $derived(
    getStrengthModifiers(npc.adjustedAbilities.STR, npc.exceptionalStr)
  );
  const dexMods = $derived(getDexterityModifiers(npc.adjustedAbilities.DEX));

  const baseAC = 10;
  const armorAC = $derived(npc.equipment?.armor?.ac || baseAC);
  const shieldBonus = $derived(npc.equipment?.shield?.acBonus || 0);
  const ac = $derived(armorAC - shieldBonus - dexMods.acAdj);

  const weaponList = $derived(
    npc.equipment?.weapons?.map(w => w.name).join(', ') || 'None'
  );
  const armorName = $derived(npc.equipment?.armor?.name || 'None');
</script>

<div class="npc-stat-block panel-secondary flex-column gap-sm">
  <!-- Header -->
  <header class="npc-header">
    <div class="npc-title">
      <h4>{npc.name}</h4>
      {#if npc.archetype}
        <span class="badge badge-primary">{npc.archetype}</span>
      {/if}
    </div>
    <p class="npc-subtitle">
      {npc.race.name} {npc.cls.name} {npc.level}
      {#if npc.sex}
        ({npc.sex})
      {/if}
    </p>
  </header>

  <!-- Combat Stats -->
  <div class="npc-combat">
    <div class="stat">
      <span class="label">AC</span>
      <span class="value">{ac}</span>
    </div>
    <div class="stat">
      <span class="label">HP</span>
      <span class="value">{npc.maxHP}</span>
    </div>
    <div class="stat">
      <span class="label">THAC0</span>
      <span class="value">{npc.thac0}</span>
    </div>
  </div>

  <!-- Abilities (compact) -->
  <div class="npc-abilities">
    <strong>Abilities:</strong>
    STR {npc.adjustedAbilities.STR}{#if npc.exceptionalStr}/{npc.exceptionalStr}{/if}
    ({formatModifier(strMods.hitAdj)}),
    DEX {npc.adjustedAbilities.DEX} ({formatModifier(dexMods.acAdj)}),
    CON {npc.adjustedAbilities.CON},
    INT {npc.adjustedAbilities.INT},
    WIS {npc.adjustedAbilities.WIS},
    CHA {npc.adjustedAbilities.CHA}
  </div>

  <!-- Alignment -->
  <div class="npc-alignment">
    <strong>Alignment:</strong> {npc.alignmentName}
  </div>

  <!-- Equipment Summary -->
  <div class="npc-equipment">
    <strong>Weapons:</strong> {weaponList}
    <br />
    <strong>Armor:</strong> {armorName}
    {#if npc.equipment?.shield}
      + {npc.equipment.shield.name}
    {/if}
  </div>

  <!-- Spells if caster -->
  {#if npc.spells?.spellbook?.length}
    <div class="npc-spells">
      <strong>Spells:</strong> {npc.spells.spellbook.length} known
    </div>
  {/if}

  <!-- Saving Throws (compact) -->
  <div class="npc-saves">
    <strong>Saves:</strong>
    P/P/DM {npc.saves.paralysis},
    RSW {npc.saves.rod},
    Pet/Poly {npc.saves.petrification},
    BW {npc.saves.breath},
    Spell {npc.saves.spell}
  </div>

  <!-- Actions -->
  {#if showActions}
    <div class="action-bar">
      {#if onSave}
        <button class="btn-sm btn-primary" onclick={() => onSave(npc)}>
          Save NPC
        </button>
      {/if}
      {#if onDelete}
        <button class="btn-sm btn-danger" onclick={() => onDelete(npc.id)}>
          Delete
        </button>
      {/if}
    </div>
  {/if}
</div>

