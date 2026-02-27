<script>
  import EditableInput from './EditableInput.svelte';
  import { formatModifier } from '../../data/mechanics.js';

  let {
    equipment,
    proficiencies,
    meleeTHAC0,
    missileTHAC0,
    strMods,
    onRemoveWeapon,
    onRemoveArmor,
    onRemoveShield,
    onRemoveGear,
    onUpdateGold
  } = $props();
</script>

<style lang="scss">@import '../styles/shared'; @import '../styles/sheet';</style>

<!-- Weapons with calculated THAC0 -->
{#if equipment?.weapons?.length}
  <div class="stat-block">
    <h3>Weapons</h3>
    {#each equipment.weapons as weapon, i}
      <div class="data-row has-remove">
        <span>{weapon.name}</span>
        <span class="val">
          THAC0 {weapon.ranged ? missileTHAC0 : meleeTHAC0}
          · {weapon.damage}{#if !weapon.ranged && strMods.dmgAdj !== 0}{formatModifier(strMods.dmgAdj)} dmg{:else} dmg{/if}
        </span>
        <button class="remove-btn" onclick={() => onRemoveWeapon(i)} title="Remove {weapon.name}" aria-label="Remove {weapon.name}">&times;</button>
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
    {#if proficiencies?.weapons}
      {#each proficiencies.weapons as weapon}
        <div class="data-row"><span>{weapon.name}</span></div>
      {/each}
    {/if}
  </div>

  <!-- Equipment -->
  <div class="stat-block">
    <h3>Equipment</h3>
    {#if equipment?.armor}
      <div class="data-row has-remove">
        <span>Armor:</span> <span class="val">{equipment.armor.name} (AC {equipment.armor.ac})</span>
        <button class="remove-btn" onclick={onRemoveArmor} title="Remove armor" aria-label="Remove armor">&times;</button>
      </div>
    {/if}
    {#if equipment?.shield}
      <div class="data-row has-remove">
        <span>Shield:</span> <span class="val">{equipment.shield.name}</span>
        <button class="remove-btn" onclick={onRemoveShield} title="Remove shield" aria-label="Remove shield">&times;</button>
      </div>
    {/if}
    {#if equipment?.gear?.length}
      {#each equipment.gear as item, i}
        <div class="data-row has-remove">
          <span>{item.name}{(item.qty || 1) > 1 ? ` \u00d7${item.qty}` : ''}</span>
          <span class="val">{(item.weight || 0) * (item.qty || 1)} lbs</span>
          <button class="remove-btn" onclick={() => onRemoveGear(i)} title="Remove {item.name}" aria-label="Remove {item.name}">&times;</button>
        </div>
      {/each}
    {/if}
    {#if equipment?.remaining !== undefined}
      <div class="data-row">
        <span>Gold</span>
        <EditableInput
          value={equipment.remaining}
          displayFormat={(v) => `${v.toFixed(1)} gp`}
          parseValue={(v) => parseFloat(v)}
          min={0}
          step={0.1}
          onUpdate={onUpdateGold}
          title="Click to edit gold"
          buttonClass="gold-display-btn"
          inputClass="gold-input-field"
        />
      </div>
    {/if}
  </div>
</div>
