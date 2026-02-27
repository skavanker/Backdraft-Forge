<script>
  import {
    equipment,
    rollStartingGold,
    getAllowedArmor,
    getAllowedShields,
    formatPrice,
    calculateTotalWeight,
    getAllowedArmorWithKit,
    getAllowedShieldsWithKit,
    rollStartingGoldWithKit
  } from '../data/equipment.js';
  import { getStrengthModifiers } from '../data/mechanics.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SelectableChip from './components/SelectableChip.svelte';
  import GearSection from './components/GearSection.svelte';

  let { cls, kit = null, weaponProficiencies, existingEquipment = null, str = 10, exceptionalStr = null, onComplete } = $props();

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

  // Get class restrictions (kit-aware)
  let allowedArmor = $derived(getAllowedArmorWithKit(cls.key, kit));
  let allowedShields = $derived(getAllowedShieldsWithKit(cls.key, kit));

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
    const result = rollStartingGoldWithKit(cls.group, kit);
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

  function addGear(item, count = 1) {
    // Buy as many as we can afford up to count
    const unitCost = priceGp(item.price);
    const affordable = Math.min(count, Math.floor(gold / unitCost));
    if (affordable <= 0) return;
    gold -= unitCost * affordable;
    const existing = selectedGear.find(g => g.key === item.key);
    if (existing) {
      selectedGear = selectedGear.map(g =>
        g.key === item.key ? { ...g, qty: (g.qty || 1) + affordable } : g
      );
    } else {
      selectedGear = [...selectedGear, { ...item, qty: affordable }];
    }
  }

  function removeGear(item, count = 1) {
    const existing = selectedGear.find(g => g.key === item.key);
    if (!existing) return;
    const qty = existing.qty || 1;
    const toRemove = Math.min(count, qty);
    gold += priceGp(item.price) * toRemove;
    if (qty - toRemove <= 0) {
      selectedGear = selectedGear.filter(g => g.key !== item.key);
    } else {
      selectedGear = selectedGear.map(g =>
        g.key === item.key ? { ...g, qty: g.qty - toRemove } : g
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

<div class="flex-column gap-lg">
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
      <div class="gold-display panel">
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
        <div class="encumbrance-warning alert alert-danger">
          ⚠ Encumbered! Carrying {totalWeight() - weightAllowance} lbs over your weight allowance. Movement and combat will be penalized.
        </div>
      {/if}
    {/if}
  </div>

  {#if goldRolled}
    <div class="flex-column gap-lg">
      <!-- Armor -->
      {#if allowedArmor.length > 0}
        <div class="section">
          <h3>Armor</h3>
          <div class="item-grid">
            {#each allowedArmor as armor}
              {@const selected = selectedArmor?.key === armor.key}
              {@const affordable = canAfford(armor.price) || selected}
              <Tooltip text="AC {armor.ac}, {armor.weight} lbs" position="bottom">
                <SelectableChip
                  {selected}
                  disabled={!affordable}
                  onclick={() => selectArmor(armor)}
                >
                  {#snippet children()}
                    <span class="item-name">{armor.name}</span>
                    <span class="item-meta">
                      <span class="item-ac">AC {armor.ac}</span>
                      <span class="item-price">{formatPrice(armor.price)}</span>
                    </span>
                  {/snippet}
                </SelectableChip>
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
                <SelectableChip
                  {selected}
                  disabled={!affordable}
                  onclick={() => selectShield(shield)}
                >
                  {#snippet children()}
                    <span class="item-name">{shield.name}</span>
                    <span class="item-meta">
                      <span class="item-price">{formatPrice(shield.price)}</span>
                    </span>
                  {/snippet}
                </SelectableChip>
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
              <SelectableChip
                selected={!!selected}
                disabled={!affordable}
                onclick={() => toggleWeapon(weapon)}
              >
                {#snippet children()}
                  <span class="item-name">{weapon.name}</span>
                  <span class="item-meta">
                    <span class="item-damage">{weapon.damage}</span>
                    <span class="item-price">{formatPrice(weapon.price)}</span>
                  </span>
                {/snippet}
              </SelectableChip>
            </Tooltip>
          {/each}
        </div>
      </div>

      <p class="alert alert-info">Left-click to add, right-click to remove. Hold Shift for ×5.</p>

      <GearSection
        title="Ammunition"
        items={equipment.ammunition}
        {selectedGear}
        {canAfford}
        {addGear}
        {removeGear}
        small={true}
      />

      <GearSection
        title="Adventuring Gear"
        items={equipment.adventuringGear}
        {selectedGear}
        {canAfford}
        {addGear}
        {removeGear}
        small={true}
      />

      <GearSection
        title="Clothing"
        items={equipment.clothing}
        {selectedGear}
        {canAfford}
        {addGear}
        {removeGear}
        small={true}
      />

      <GearSection
        title="Tools & Kits"
        items={equipment.toolsAndKits}
        {selectedGear}
        {canAfford}
        {addGear}
        {removeGear}
        small={true}
      />

      <GearSection
        title="Provisions"
        items={equipment.provisions}
        {selectedGear}
        {canAfford}
        {addGear}
        {removeGear}
        small={true}
      />

      <GearSection
        title="Transport & Animals"
        items={equipment.transport}
        {selectedGear}
        {canAfford}
        {addGear}
        {removeGear}
        small={true}
      />

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
  @import './styles/shared';
  @import './styles/equipment';
</style>

