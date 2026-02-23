<script>
  import {
    equipment,
    rollStartingGold,
    getAllowedArmor,
    getAllowedShields,
    formatPrice,
    calculateTotalCost,
    copperToGold,
    calculateTotalWeight
  } from '../data/equipment.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';

  let { cls, weaponProficiencies, existingEquipment = null, onComplete } = $props();

  // Starting gold
  let gold = $state(null);
  let goldRolled = $state(false);

  // Selected equipment
  let selectedArmor = $state(null);
  let selectedShield = $state(null);
  let selectedWeapons = $state([]);
  let selectedGear = $state([]);

  // Get class restrictions
  let allowedArmor = $derived(getAllowedArmor(cls.key));
  let allowedShields = $derived(getAllowedShields(cls.key));

  // Get proficient weapons from equipment list
  let proficientWeaponKeys = $derived(
    weaponProficiencies.map(p => p.key)
  );
  let availableWeapons = $derived(
    equipment.weapons.filter(w => proficientWeaponKeys.includes(w.key))
  );

  // Calculate costs
  let selectedItems = $derived(() => {
    const items = [];
    if (selectedArmor) items.push(selectedArmor);
    if (selectedShield) items.push(selectedShield);
    items.push(...selectedWeapons);
    items.push(...selectedGear);
    return items;
  });

  let totalCostCopper = $derived(calculateTotalCost(selectedItems()));
  let totalCostGold = $derived(copperToGold(totalCostCopper));
  let remainingGold = $derived(gold !== null ? gold - totalCostGold : 0);
  let totalWeight = $derived(calculateTotalWeight(selectedItems()));

  function rollGold() {
    gold = rollStartingGold(cls.group);
    goldRolled = true;
  }

  function setManualGold(event) {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0) {
      gold = value;
      goldRolled = true;
    }
  }

  function selectArmor(armor) {
    if (selectedArmor?.key === armor.key) {
      selectedArmor = null;
    } else {
      selectedArmor = armor;
    }
  }

  function selectShield(shield) {
    if (selectedShield?.key === shield.key) {
      selectedShield = null;
    } else {
      selectedShield = shield;
    }
  }

  function toggleWeapon(weapon) {
    if (selectedWeapons.find(w => w.key === weapon.key)) {
      selectedWeapons = selectedWeapons.filter(w => w.key !== weapon.key);
    } else {
      selectedWeapons = [...selectedWeapons, weapon];
    }
  }

  function toggleGear(item) {
    if (selectedGear.find(g => g.key === item.key)) {
      selectedGear = selectedGear.filter(g => g.key !== item.key);
    } else {
      selectedGear = [...selectedGear, item];
    }
  }

  function canAfford(price) {
    if (gold === null) return false;
    const costInGold = copperToGold(
      (price.gp || 0) * 100 + (price.sp || 0) * 10 + (price.cp || 0)
    );
    return remainingGold >= costInGold;
  }

  function confirm() {
    onComplete({
      gold: gold,
      spent: totalCostGold,
      remaining: remainingGold,
      armor: selectedArmor,
      shield: selectedShield,
      weapons: selectedWeapons,
      gear: selectedGear,
      totalWeight
    });
  }

  // Initialize from existing data
  onMount(() => {
    if (existingEquipment) {
      gold = existingEquipment.gold;
      goldRolled = true;
      selectedArmor = existingEquipment.armor;
      selectedShield = existingEquipment.shield;
      selectedWeapons = existingEquipment.weapons || [];
      selectedGear = existingEquipment.gear || [];
    }
  });
</script>

<div class="equipment-selector">
  <!-- Gold Section -->
  <div class="gold-section">
    {#if !goldRolled}
      <p class="intro">Roll for starting gold or enter a custom amount.</p>
      <div class="gold-controls">
        <button class="btn-primary" onclick={rollGold}>
          Roll Starting Gold
        </button>
        <span class="or-divider">or</span>
        <div class="manual-gold">
          <input
            type="number"
            min="0"
            placeholder="Enter gold"
            onchange={setManualGold}
          />
          <span class="gp-label">gp</span>
        </div>
      </div>
    {:else}
      <div class="gold-display">
        <div class="gold-stat">
          <span class="gold-label">Starting Gold</span>
          <span class="gold-value">{gold} gp</span>
        </div>
        <div class="gold-stat">
          <span class="gold-label">Spent</span>
          <span class="gold-value spent">{totalCostGold.toFixed(1)} gp</span>
        </div>
        <div class="gold-stat">
          <span class="gold-label">Remaining</span>
          <span class="gold-value" class:warning={remainingGold < 0}>
            {remainingGold.toFixed(1)} gp
          </span>
        </div>
        <div class="gold-stat">
          <span class="gold-label">Weight</span>
          <span class="gold-value">{totalWeight} lbs</span>
        </div>
      </div>
    {/if}
  </div>

  {#if goldRolled}
    <div class="equipment-sections">
      <!-- Armor -->
      {#if allowedArmor.length > 0}
        <div class="section">
          <h3>Armor</h3>
          <div class="item-grid">
            {#each allowedArmor as armor}
              {@const selected = selectedArmor?.key === armor.key}
              {@const affordable = canAfford(armor.price) || selected}
              <Tooltip text="AC {armor.ac}, {armor.weight} lbs" position="bottom">
                <button
                  class="item-card"
                  class:selected
                  class:disabled={!affordable}
                  onclick={() => affordable && selectArmor(armor)}
                >
                  <span class="item-name">{armor.name}</span>
                  <span class="item-meta">
                    <span class="item-ac">AC {armor.ac}</span>
                    <span class="item-price">{formatPrice(armor.price)}</span>
                  </span>
                </button>
              </Tooltip>
            {/each}
          </div>
        </div>
      {:else}
        <p class="restriction-note">Your class cannot wear armor.</p>
      {/if}

      <!-- Shields -->
      {#if allowedShields.length > 0}
        <div class="section">
          <h3>Shields</h3>
          <div class="item-grid">
            {#each allowedShields as shield}
              {@const selected = selectedShield?.key === shield.key}
              {@const affordable = canAfford(shield.price) || selected}
              <Tooltip text="+{shield.acBonus} AC, {shield.weight} lbs" position="bottom">
                <button
                  class="item-card"
                  class:selected
                  class:disabled={!affordable}
                  onclick={() => affordable && selectShield(shield)}
                >
                  <span class="item-name">{shield.name}</span>
                  <span class="item-meta">
                    <span class="item-price">{formatPrice(shield.price)}</span>
                  </span>
                </button>
              </Tooltip>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Weapons (based on proficiencies) -->
      <div class="section">
        <h3>Weapons</h3>
        <p class="section-hint">Based on your weapon proficiencies</p>
        <div class="item-grid">
          {#each availableWeapons as weapon}
            {@const selected = selectedWeapons.find(w => w.key === weapon.key)}
            {@const affordable = canAfford(weapon.price) || selected}
            <Tooltip text="{weapon.damage} damage, {weapon.weight} lbs" position="bottom">
              <button
                class="item-card"
                class:selected
                class:disabled={!affordable}
                onclick={() => affordable && toggleWeapon(weapon)}
              >
                <span class="item-name">{weapon.name}</span>
                <span class="item-meta">
                  <span class="item-damage">{weapon.damage}</span>
                  <span class="item-price">{formatPrice(weapon.price)}</span>
                </span>
              </button>
            </Tooltip>
          {/each}
        </div>
      </div>

      <!-- Ammunition -->
      <div class="section">
        <h3>Ammunition</h3>
        <div class="item-grid small">
          {#each equipment.ammunition as ammo}
            {@const selected = selectedGear.find(g => g.key === ammo.key)}
            {@const affordable = canAfford(ammo.price) || selected}
            <button
              class="item-card small"
              class:selected
              class:disabled={!affordable}
              onclick={() => affordable && toggleGear(ammo)}
            >
              <span class="item-name">{ammo.name}</span>
              <span class="item-price">{formatPrice(ammo.price)}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Adventuring Gear -->
      <div class="section">
        <h3>Adventuring Gear</h3>
        <div class="item-grid small">
          {#each equipment.adventuringGear as item}
            {@const selected = selectedGear.find(g => g.key === item.key)}
            {@const affordable = canAfford(item.price) || selected}
            <button
              class="item-card small"
              class:selected
              class:disabled={!affordable}
              onclick={() => affordable && toggleGear(item)}
            >
              <span class="item-name">{item.name}</span>
              <span class="item-price">{formatPrice(item.price)}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Clothing -->
      <div class="section">
        <h3>Clothing</h3>
        <div class="item-grid small">
          {#each equipment.clothing as item}
            {@const selected = selectedGear.find(g => g.key === item.key)}
            {@const affordable = canAfford(item.price) || selected}
            <button
              class="item-card small"
              class:selected
              class:disabled={!affordable}
              onclick={() => affordable && toggleGear(item)}
            >
              <span class="item-name">{item.name}</span>
              <span class="item-price">{formatPrice(item.price)}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <button
      class="btn-primary"
      onclick={confirm}
      disabled={remainingGold < 0}
    >
      {#if remainingGold < 0}
        Over budget by {Math.abs(remainingGold).toFixed(1)} gp
      {:else}
        Confirm Equipment → Spells
      {/if}
    </button>
  {/if}
</div>

<style lang="scss">
  .equipment-selector {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .gold-section {
    text-align: center;

    .intro {
      margin: 0 0 1rem;
      color: var(--text-body);
    }
  }

  .gold-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;

    .or-divider {
      color: var(--text-muted);
      font-style: italic;
    }

    .manual-gold {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        width: 100px;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-input);
        color: var(--text-primary);
        font-size: 1rem;
      }

      .gp-label {
        color: var(--text-muted);
      }
    }
  }

  .gold-display {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
    background: var(--bg-panel);
    border-radius: 4px;
    flex-wrap: wrap;
  }

  .gold-stat {
    display: flex;
    flex-direction: column;
    align-items: center;

    .gold-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .gold-value {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gold);

      &.spent {
        color: var(--text-muted);
      }

      &.warning {
        color: var(--red);
      }
    }
  }

  .equipment-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section {
    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.125rem;
      color: var(--text-primary);
    }

    .section-hint {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  }

  .restriction-note {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.5rem;

    &.small {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }

  .item-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.6rem 0.8rem;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;

    &.small {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;

      .item-name {
        font-size: 0.875rem;
      }

      .item-price {
        font-size: 0.8rem;
      }
    }

    .item-name {
      font-weight: 500;
      color: var(--text-body);
      font-size: 1rem;
    }

    .item-meta {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.25rem;
      font-size: 0.875rem;
    }

    .item-ac,
    .item-damage {
      color: var(--text-primary);
      font-weight: 600;
    }

    .item-price {
      color: var(--gold-dark);
      font-size: 0.875rem;
    }

    &:hover:not(.disabled) {
      border-color: var(--border-strong);
    }

    &.selected {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.15);

      .item-name {
        color: var(--text-primary);
      }
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    align-self: center;

    &:disabled {
      background: var(--red);
      opacity: 0.8;
    }
  }
</style>
