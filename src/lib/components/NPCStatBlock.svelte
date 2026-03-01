<script>
  import { getStrengthModifiers, getDexterityModifiers, formatModifier } from '../../data/mechanics.js';

  let { npc, onSave = null, onDelete = null, showActions = true } = $props();

  const strMods = $derived(
    getStrengthModifiers(npc.adjustedAbilities.STR, npc.exceptionalStr)
  );
  const dexMods = $derived(getDexterityModifiers(npc.adjustedAbilities.DEX));

  const baseAC = 10;
  const armorAC = npc.equipment?.armor?.ac || baseAC;
  const shieldBonus = npc.equipment?.shield?.acBonus || 0;
  const ac = $derived(armorAC - shieldBonus - dexMods.acAdj);

  const weaponList = $derived(
    npc.equipment?.weapons?.map(w => w.name).join(', ') || 'None'
  );
  const armorName = $derived(npc.equipment?.armor?.name || 'None');
</script>

<div class="npc-stat-block panel">
  <!-- Header -->
  <header class="npc-header">
    <div class="npc-title">
      <h4>{npc.name}</h4>
      {#if npc.archetype}
        <span class="archetype-badge">{npc.archetype}</span>
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
    <div class="npc-actions">
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

<style lang="scss">
  @import '../styles/shared';

  .npc-stat-block {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg-secondary);
  }

  .npc-header {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.5rem;

    .npc-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;

      h4 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }

      .archetype-badge {
        padding: 0.125rem 0.5rem;
        background: var(--color-primary);
        color: white;
        font-size: 0.75rem;
        border-radius: 4px;
        text-transform: capitalize;
      }
    }

    .npc-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
  }

  .npc-combat {
    display: flex;
    gap: 1rem;
    padding: 0.5rem;
    background: var(--color-bg-primary);
    border-radius: 4px;

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;

      .label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
      }

      .value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text-primary);
      }
    }
  }

  .npc-abilities,
  .npc-alignment,
  .npc-equipment,
  .npc-spells,
  .npc-saves {
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text-primary);

    strong {
      font-weight: 600;
      color: var(--color-text-secondary);
    }
  }

  .npc-actions {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &.btn-primary {
        background: var(--color-primary);
        color: white;

        &:hover {
          background: var(--color-primary-dark);
        }
      }

      &.btn-danger {
        background: var(--color-danger);
        color: white;

        &:hover {
          background: var(--color-danger-dark);
        }
      }
    }
  }
</style>
