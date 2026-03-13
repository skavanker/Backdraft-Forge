<script>
  import StatBlock from './StatBlock.svelte';
  import { getStrengthModifiers, getDexterityModifiers, formatModifier } from '../../data/mechanics.js';
  import { getArchetype } from '../generators/npcArchetypes.js';

  let { npc, onSave = null, onDelete = null, showActions = true } = $props();

  const strMods = $derived(getStrengthModifiers(npc.adjustedAbilities.STR, npc.exceptionalStr));
  const dexMods = $derived(getDexterityModifiers(npc.adjustedAbilities.DEX));
  const ac = $derived((npc.equipment?.armor?.ac || 10) - (npc.equipment?.shield?.acBonus || 0) - dexMods.acAdj);
  const weaponList = $derived(npc.equipment?.weapons?.map(w => w.name).join(', ') || 'None');
  const armorName = $derived(npc.equipment?.armor?.name || 'None');

  const archetypeName = $derived(npc.archetype ? (getArchetype(npc.archetype)?.name ?? npc.archetype) : null);
  const badges = $derived(archetypeName ? [{ label: archetypeName, cls: 'badge-primary' }] : []);
  const subtitle = $derived(`${npc.race.name} ${npc.cls.name} ${npc.level}${npc.sex ? ` (${npc.sex})` : ''}`);
  const stats = $derived([
    { label: 'AC',    value: ac },
    { label: 'HP',    value: npc.maxHP },
    { label: 'THAC0', value: npc.thac0 },
  ]);
</script>

<StatBlock panel="panel-secondary" name={npc.name} {badges} {subtitle} {stats}>
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

  <div class="npc-alignment">
    <strong>Alignment:</strong> {npc.alignmentName}
  </div>

  <div class="npc-equipment">
    <strong>Weapons:</strong> {weaponList}<br />
    <strong>Armor:</strong> {armorName}
    {#if npc.equipment?.shield} + {npc.equipment.shield.name}{/if}
  </div>

  {#if npc.spells?.spellbook?.length}
    <div class="npc-spells">
      <strong>Spells:</strong> {npc.spells.spellbook.length} known
    </div>
  {/if}

  <div class="npc-saves">
    <strong>Saves:</strong>
    P/P/DM {npc.saves.paralysis},
    RSW {npc.saves.rod},
    Pet/Poly {npc.saves.petrification},
    BW {npc.saves.breath},
    Spell {npc.saves.spell}
  </div>

  {#snippet actions()}
    {#if showActions}
      {#if onSave}
        <button class="btn-sm btn-primary" onclick={() => onSave(npc)}>Save NPC</button>
      {/if}
      {#if onDelete}
        <button class="btn-sm btn-danger" onclick={() => onDelete(npc.id)}>Delete</button>
      {/if}
    {/if}
  {/snippet}
</StatBlock>
