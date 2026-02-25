<script>
  import {
    equipment,
    rollStartingGold,
    getAllowedArmor,
    getAllowedShields,
    formatPrice,
    calculateTotalWeight
  } from '../data/equipment.js';
  import { getStrengthModifiers } from '../data/mechanics.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';

  let { cls, weaponProficiencies, existingEquipment = null, str = 10, exceptionalStr = null, onComplete } = $props();

  let weightAllowance = $derived(getStrengthModifiers(str, exceptionalStr).weightAllow);

  // Starting gold
  let gold = $state(null);
  let goldRolled = $state(false);
  let goldDice = $state([]);
  let goldDiceFormula = $state('');
  let manualGoldInput = $state('');

  function resetGold() {
    gold = null;
    goldRolled = false;
    goldDice = [];
    goldDiceFormula = '';
    selectedArmor = null;
    selectedShield = null;
    selectedWeapons = [];
    selectedGear = [];
  }

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

  // Price helper: convert item price to gp
  function priceGp(price) {
    return ((price.gp || 0) * 100 + (price.sp || 0) * 10 + (price.cp || 0)) / 100;
  }

  // Weight tracking
  let totalWeight = $derived(() => {
    const items = [];
    if (selectedArmor) items.push(selectedArmor);
    if (selectedShield) items.push(selectedShield);
    items.push(...selectedWeapons);
    for (const g of selectedGear) {
      for (let i = 0; i < (g.qty || 1); i++) items.push(g);
    }
    return calculateTotalWeight(items);
  });
  let isEncumbered = $derived(totalWeight() > weightAllowance);

  function rollGold() {
    const result = rollStartingGold(cls.group);
    gold = result.gold;
    goldDice = result.dice;
    goldDiceFormula = result.diceFormula;
    goldRolled = true;
  }

  function setManualGold() {
    const value = parseInt(manualGoldInput);
    if (!isNaN(value) && value >= 0) {
      gold = value;
      goldRolled = true;
      goldDice = []; // Clear dice for manual entry
      goldDiceFormula = '';
    }
  }

  function selectArmor(armor) {
    if (selectedArmor?.key === armor.key) {
      gold += priceGp(selectedArmor.price);
      selectedArmor = null;
    } else {
      if (selectedArmor) gold += priceGp(selectedArmor.price);
      gold -= priceGp(armor.price);
      selectedArmor = armor;
    }
  }

  function selectShield(shield) {
    if (selectedShield?.key === shield.key) {
      gold += priceGp(selectedShield.price);
      selectedShield = null;
    } else {
      if (selectedShield) gold += priceGp(selectedShield.price);
      gold -= priceGp(shield.price);
      selectedShield = shield;
    }
  }

  function toggleWeapon(weapon) {
    if (selectedWeapons.find(w => w.key === weapon.key)) {
      gold += priceGp(weapon.price);
      selectedWeapons = selectedWeapons.filter(w => w.key !== weapon.key);
    } else {
      gold -= priceGp(weapon.price);
      selectedWeapons = [...selectedWeapons, weapon];
    }
  }

  function addGear(item) {
    if (!canAfford(item.price)) return;
    gold -= priceGp(item.price);
    const existing = selectedGear.find(g => g.key === item.key);
    if (existing) {
      selectedGear = selectedGear.map(g =>
        g.key === item.key ? { ...g, qty: (g.qty || 1) + 1 } : g
      );
    } else {
      selectedGear = [...selectedGear, { ...item, qty: 1 }];
    }
  }

  function removeGear(item) {
    const existing = selectedGear.find(g => g.key === item.key);
    if (!existing) return;
    gold += priceGp(item.price);
    const qty = existing.qty || 1;
    if (qty <= 1) {
      selectedGear = selectedGear.filter(g => g.key !== item.key);
    } else {
      selectedGear = selectedGear.map(g =>
        g.key === item.key ? { ...g, qty: g.qty - 1 } : g
      );
    }
  }

  // Custom items
  let customName = $state('');
  let customPrice = $state(null);
  let customWeight = $state(null);
  let customIdCounter = $state(0);

  function addCustomItem() {
    if (!customName.trim()) return;
    const price = { gp: customPrice || 0 };
    if (!canAfford(price)) return;
    gold -= priceGp(price);
    const key = `custom_${customIdCounter}`;
    customIdCounter++;
    selectedGear = [...selectedGear, {
      key,
      name: customName.trim(),
      price,
      weight: customWeight || 0,
      qty: 1
    }];
    customName = '';
    customPrice = null;
    customWeight = null;
  }

  function canAfford(price) {
    if (gold === null) return false;
    return gold >= priceGp(price);
  }

  function confirm() {
    onComplete({
      remaining: Math.round(gold * 100) / 100,
      armor: selectedArmor,
      shield: selectedShield,
      weapons: selectedWeapons,
      gear: selectedGear,
      totalWeight: totalWeight(),
      goldDice,
      goldDiceFormula
    });
  }

  // Initialize from existing data
  onMount(() => {
    if (existingEquipment) {
      gold = existingEquipment.remaining ?? existingEquipment.gold ?? 0;
      goldRolled = true;
      goldDice = existingEquipment.goldDice || [];
      goldDiceFormula = existingEquipment.goldDiceFormula || '';

      // Check if armor is still allowed, otherwise clear and refund
      if (existingEquipment.armor) {
        const armorAllowed = allowedArmor.some(a => a.key === existingEquipment.armor.key);
        if (armorAllowed) {
          selectedArmor = existingEquipment.armor;
        } else {
          gold += priceGp(existingEquipment.armor.price);
          selectedArmor = null;
        }
      }

      // Check if shield is still allowed, otherwise clear and refund
      if (existingEquipment.shield) {
        const shieldAllowed = allowedShields.some(s => s.key === existingEquipment.shield.key);
        if (shieldAllowed) {
          selectedShield = existingEquipment.shield;
        } else {
          gold += priceGp(existingEquipment.shield.price);
          selectedShield = null;
        }
      }

      // Filter weapons: only keep ones that are still available (proficient)
      const existingWeapons = existingEquipment.weapons || [];
      selectedWeapons = existingWeapons.filter(weapon =>
        availableWeapons.some(aw => aw.key === weapon.key)
      );

      // Refund gold for removed weapons
      const removedWeapons = existingWeapons.filter(weapon =>
        !availableWeapons.some(aw => aw.key === weapon.key)
      );
      for (const weapon of removedWeapons) {
        gold += priceGp(weapon.price);
      }

      selectedGear = (existingEquipment.gear || []).map(g => ({ ...g, qty: g.qty || 1 }));
      // Restore custom ID counter past any existing custom items
      const customKeys = selectedGear.filter(g => g.key.startsWith('custom_')).map(g => parseInt(g.key.split('_')[1]) + 1);
      if (customKeys.length) customIdCounter = Math.max(...customKeys);
    }
  });
</script>

<div class="equipment-selector">
  <!-- Gold Section -->
  <div class="gold-section">
    {#if !goldRolled}
      <div class="intro-with-info">
        <p class="section-hint">Roll for starting gold or enter a custom amount.</p>
        <Tooltip text="Starting gold per AD&D 2E: Warriors 5d4×10 (50-200 gp), Wizards 1d4+1×10 (20-50 gp), Priests 3d6×10 (30-180 gp), Rogues 2d6×10 (20-120 gp)" position="bottom">
          <span class="info-icon">ⓘ</span>
        </Tooltip>
      </div>
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
            bind:value={manualGoldInput}
            onkeydown={(e) => e.key === 'Enter' && setManualGold()}
          />
          <span class="gp-label">gp</span>
          <button class="btn-primary btn-sm" onclick={setManualGold} disabled={!manualGoldInput || parseInt(manualGoldInput) < 0}>
            Set
          </button>
        </div>
      </div>
    {:else}
      <div class="gold-display">
        <button class="reroll-btn" onclick={resetGold} title="Reset gold">×</button>
        <div class="gold-stat">
          <span class="gold-label">Gold</span>
          <span class="gold-value" class:warning={gold < 0}>
            {gold.toFixed(1)} gp
          </span>
          {#if goldDice.length > 0}
            <div class="gold-dice">
              <span class="dice-formula">{goldDiceFormula} × 10</span>
              <div class="dice-rolls">
                {#each goldDice as die}
                  <span class="die">
                    <img src="/dice/dice0{die}.svg" alt="{die}" />
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        <div class="gold-stat">
          <span class="gold-label">Weight</span>
          <span class="gold-value" class:warning={isEncumbered}>{totalWeight()} / {weightAllowance} lbs</span>
        </div>
      </div>
      {#if isEncumbered}
        <div class="encumbrance-warning">
          ⚠ Encumbered! Carrying {totalWeight() - weightAllowance} lbs over your weight allowance. Movement and combat will be penalized.
        </div>
      {/if}
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
        <p class="section-hint">Left-click to add, right-click to remove</p>
        <div class="item-grid small">
          {#each equipment.ammunition as ammo}
            {@const selected = selectedGear.find(g => g.key === ammo.key)}
            {@const affordable = canAfford(ammo.price) || selected}
            <button
              class="item-card small"
              class:selected
              class:disabled={!affordable && !selected}
              onclick={() => addGear(ammo)}
              oncontextmenu={(e) => { e.preventDefault(); removeGear(ammo); }}
            >
              <span class="item-name">{ammo.name}</span>
              <span class="item-price">{formatPrice(ammo.price)}</span>
              {#if selected?.qty > 1}
                <span class="qty-badge">&times;{selected.qty}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Adventuring Gear -->
      <div class="section">
        <h3>Adventuring Gear</h3>
        <p class="section-hint">Left-click to add, right-click to remove</p>
        <div class="item-grid small">
          {#each equipment.adventuringGear as item}
            {@const selected = selectedGear.find(g => g.key === item.key)}
            {@const affordable = canAfford(item.price) || selected}
            <button
              class="item-card small"
              class:selected
              class:disabled={!affordable && !selected}
              onclick={() => addGear(item)}
              oncontextmenu={(e) => { e.preventDefault(); removeGear(item); }}
            >
              <span class="item-name">{item.name}</span>
              <span class="item-price">{formatPrice(item.price)}</span>
              {#if selected?.qty > 1}
                <span class="qty-badge">&times;{selected.qty}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Clothing -->
      <div class="section">
        <h3>Clothing</h3>
        <p class="section-hint">Left-click to add, right-click to remove</p>
        <div class="item-grid small">
          {#each equipment.clothing as item}
            {@const selected = selectedGear.find(g => g.key === item.key)}
            {@const affordable = canAfford(item.price) || selected}
            <button
              class="item-card small"
              class:selected
              class:disabled={!affordable && !selected}
              onclick={() => addGear(item)}
              oncontextmenu={(e) => { e.preventDefault(); removeGear(item); }}
            >
              <span class="item-name">{item.name}</span>
              <span class="item-price">{formatPrice(item.price)}</span>
              {#if selected?.qty > 1}
                <span class="qty-badge">&times;{selected.qty}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Custom Item -->
      <div class="section">
        <h3>Custom Item</h3>
        <p class="section-hint">Add items not found in the equipment lists above</p>
        <div class="custom-gear-form">
          <input placeholder="Item name" bind:value={customName} />
          <input type="number" placeholder="Price (gp)" bind:value={customPrice} min="0" />
          <input type="number" placeholder="Weight (lbs)" bind:value={customWeight} min="0" />
          <button class="btn-add" onclick={addCustomItem} disabled={!customName.trim()}>Add</button>
        </div>
      </div>

      <!-- Selected custom items -->
      {#if selectedGear.some(g => g.key.startsWith('custom_'))}
        <div class="section">
          <h3>Custom Items</h3>
          <div class="item-grid small">
            {#each selectedGear.filter(g => g.key.startsWith('custom_')) as item}
              <button
                class="item-card small selected"
                onclick={() => addGear(item)}
                oncontextmenu={(e) => { e.preventDefault(); removeGear(item); }}
              >
                <span class="item-name">{item.name}</span>
                <span class="item-price">{item.price?.gp || 0} gp</span>
                {#if item.qty > 1}
                  <span class="qty-badge">&times;{item.qty}</span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <button
      class="btn-primary"
      onclick={confirm}
      disabled={gold < 0}
    >
      {#if gold < 0}
        Over budget by {Math.abs(gold).toFixed(1)} gp
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
    gap: $space-lg;
  }

  .gold-section {
    text-align: center;

    .intro-with-info {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: $space-sm;
      margin-bottom: $space-md;
    }

    .info-icon {
      cursor: help;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .gold-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-md;
    flex-wrap: wrap;

    .or-divider {
      font-style: italic;
    }

    .manual-gold {
      display: flex;
      align-items: center;
      gap: $space-sm;

      input {
        width: 100px;
        padding: $space-sm;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-input);
        color: var(--text-primary);
      }
    }
  }

  .gold-display {
    display: flex;
    justify-content: center;
    gap: $space-xl;
    padding: $space-md;
    background: var(--bg-panel);
    border-radius: 4px;
    flex-wrap: wrap;
    position: relative;
  }

  .reroll-btn {
    position: absolute;
    top: $space-sm;
    right: $space-sm;
    background: transparent;
    border: none;
    line-height: 1;
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 0.2s;
    padding: $space-xs $space-sm;

    &:hover {
      opacity: 0.8;
    }
  }

  .encumbrance-warning {
    text-align: center;
    padding: $space-sm $space-md;
    background: rgba(180, 60, 40, 0.15);
    border: 1px solid rgba(180, 60, 40, 0.3);
    border-radius: 4px;
    color: var(--red);
    margin-top: $space-sm;
  }

  .gold-stat {
    display: flex;
    flex-direction: column;
    align-items: center;

    .gold-value {
      font-family: 'Cinzel', serif;
      color: var(--gold);

      &.warning {
        color: var(--red);
      }
    }

    .gold-dice {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-xs;
      margin-top: $space-sm;

      .dice-rolls {
        display: flex;
        gap: 2px;
      }

      .die {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        img {
          width: 20px;
          height: 20px;
          display: block;
        }
      }
    }
  }

  .equipment-sections {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .section {
    h3 {
      margin: 0 0 $space-sm;
    }
  }

  .restriction-note {
    font-style: italic;
    text-align: center;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $space-sm;

    &.small {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  .item-card {
    @include selectable-chip;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.6rem 0.8rem;
    text-align: left;
    width: 100%;

    &.small {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
    }

    .item-meta {
      display: flex;
      gap: $space-sm;
      margin-top: $space-xs;
    }

    .item-price {
      color: var(--gold-dark);
    }

    &:hover:not(.disabled) {
      .item-name {
        color: var(--text-hover);
      }
    }
  }

  .qty-badge {
    background: var(--gold);
    color: var(--bg-card);
    border-radius: 8px;
    padding: 0 0.35rem;
    margin-left: auto;
    line-height: 1.4;
  }

  .custom-gear-form {
    display: flex;
    align-items: center;
    gap: $space-sm;
    flex-wrap: wrap;

    input {
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-input);
      color: var(--text-primary);
    }

    input:not([type="number"]) {
      flex: 1;
      min-width: 120px;
    }

    input[type="number"] {
      width: 90px;
    }

    .btn-add {
      padding: 0.4rem 0.8rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-panel);
      color: var(--text-primary);
      cursor: pointer;
      transition: background 0.2s;

      &:hover:not(:disabled) {
        background: var(--gold);
        color: var(--bg-card);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
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
