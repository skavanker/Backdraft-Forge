<script>
  import {
    equipment,
    formatPrice,
    calculateTotalWeight,
    priceToGp,
    getWeaponsForProficiencies,
    getAllowedArmorWithKit,
    getAllowedShieldsWithKit,
    rollStartingGoldWithKit
  } from '../data/equipment.js';
  import { formatWeaponTooltip } from '../data/weapons.js';
  import { getStrengthModifiers } from '../data/mechanics.js';
  import Tooltip from './Tooltip.svelte';
  import { formatEncumbranceValue, formatWeightUnit } from './settings.svelte.js';
  import SelectableChip from './components/SelectableChip.svelte';
  import GearSection from './components/GearSection.svelte';
  import GoldLedger from './components/GoldLedger.svelte';
  import CustomItemForm from './components/CustomItemForm.svelte';
  import { useGoldLedger } from './utils/useGoldLedger.svelte.js';

  let { cls, kit = null, weaponProficiencies, existingEquipment = null, str = 10, exceptionalStr = null, onComplete } = $props();

  let weightAllowance = $derived(getStrengthModifiers(str, exceptionalStr).weightAllow);

  // Gold ledger
  const ledger = useGoldLedger();
  let manualGoldInput = $state('');

  function resetGold() {
    ledger.reset();
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
    getWeaponsForProficiencies(proficientWeaponKeys)
  );

  // Weight tracking
  let totalWeight = $derived(() => {
    const items = [];
    if (selectedArmor) items.push(selectedArmor);
    if (selectedShield) items.push(selectedShield);
    items.push(...selectedWeapons);
    for (const g of selectedGear) {
      for (let i = 0; i < (g.qty || 1); i++) items.push(g);
    }
    return Math.round(calculateTotalWeight(items) * 10) / 10;
  });
  let isEncumbered = $derived(totalWeight() > weightAllowance);

  function rollGold() {
    const result = rollStartingGoldWithKit(cls.group, kit);
    ledger.setFromRoll(result);
  }

  function setManualGold() {
    const value = parseInt(manualGoldInput);
    if (!isNaN(value) && value >= 0) {
      ledger.gold = value;
      ledger.goldRolled = true;
      ledger.goldDice = [];
      ledger.goldDiceFormula = '';
    }
  }

  /**
   * Create a single-select handler for exclusive items (armor, shield).
   * Handles selection toggle with automatic refunds.
   */
  function createSingleSelectHandler(getCurrentItem, setCurrentItem) {
    return (item) => {
      const current = getCurrentItem();

      if (current?.key === item.key) {
        // Deselect
        ledger.refundPrice(current.price);
        setCurrentItem(null);
      } else {
        // Select new (refund old if exists)
        if (current) ledger.refundPrice(current.price);
        ledger.deductPrice(item.price);
        setCurrentItem(item);
      }
    };
  }

  const selectArmor = createSingleSelectHandler(
    () => selectedArmor,
    (v) => selectedArmor = v
  );

  const selectShield = createSingleSelectHandler(
    () => selectedShield,
    (v) => selectedShield = v
  );

  function toggleWeapon(weapon) {
    if (selectedWeapons.find(w => w.key === weapon.key)) {
      ledger.refundPrice(weapon.price);
      selectedWeapons = selectedWeapons.filter(w => w.key !== weapon.key);
    } else {
      ledger.deductPrice(weapon.price);
      selectedWeapons = [...selectedWeapons, weapon];
    }
  }

  function addGear(item, count = 1) {
    const unitCost = priceToGp(item.price);
    const affordable = Math.min(count, Math.floor(ledger.gold / unitCost));
    if (affordable <= 0) return;
    ledger.deduct(unitCost * affordable);
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
    ledger.refund(priceToGp(item.price) * toRemove);
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
    if (!ledger.canAfford(price)) return;
    ledger.deductPrice(price);
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
    return ledger.canAfford(price);
  }

  function confirm() {
    onComplete({
      remaining: Math.round(ledger.gold * 100) / 100,
      armor: selectedArmor,
      shield: selectedShield,
      weapons: selectedWeapons,
      gear: selectedGear,
      totalWeight: totalWeight(),
      goldDice: ledger.goldDice,
      goldDiceFormula: ledger.goldDiceFormula,
      goldDieSize: ledger.goldDieSize
    });
  }

  // Initialize from existing data (runs once on mount)
  // Prevents race condition by using $effect with initialization guard
  let equipmentInitialized = $state(false);
  $effect(() => {
    if (equipmentInitialized || !existingEquipment) return;

    ledger.restore(existingEquipment);

    // Check if armor is still allowed, otherwise clear and refund
    if (existingEquipment.armor) {
      const armorAllowed = allowedArmor.some(a => a.key === existingEquipment.armor.key);
      if (armorAllowed) {
        selectedArmor = existingEquipment.armor;
      } else {
        ledger.refundPrice(existingEquipment.armor.price);
        selectedArmor = null;
      }
    }

    // Check if shield is still allowed, otherwise clear and refund
    if (existingEquipment.shield) {
      const shieldAllowed = allowedShields.some(s => s.key === existingEquipment.shield.key);
      if (shieldAllowed) {
        selectedShield = existingEquipment.shield;
      } else {
        ledger.refundPrice(existingEquipment.shield.price);
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
      ledger.refundPrice(weapon.price);
    }

    selectedGear = (existingEquipment.gear || []).map(g => ({ ...g, qty: g.qty || 1 }));
    const customKeys = selectedGear.filter(g => g.key.startsWith('custom_')).map(g => parseInt(g.key.split('_')[1]) + 1);
    if (customKeys.length) customIdCounter = Math.max(...customKeys);

    equipmentInitialized = true;
  });
</script>

<div class="flex-column gap-lg">
  <GoldLedger
    {ledger}
    totalWeight={totalWeight()}
    {weightAllowance}
    {isEncumbered}
    {rollGold}
    {setManualGold}
    {resetGold}
    bind:manualGoldInput
  />

  {#if ledger.goldRolled}
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
                  oncontextmenu={selected ? () => selectArmor(armor) : null}
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
                  oncontextmenu={selected ? () => selectShield(shield) : null}
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
            <Tooltip text={formatWeaponTooltip(weapon)} position="bottom">
              <SelectableChip
                selected={!!selected}
                disabled={!affordable}
                onclick={() => toggleWeapon(weapon)}
                oncontextmenu={selected ? () => toggleWeapon(weapon) : null}
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

      <CustomItemForm
        bind:customName
        bind:customPrice
        bind:customWeight
        {selectedGear}
        {addCustomItem}
        {addGear}
        {removeGear}
      />
    </div>

    <button
      class="btn-primary"
      onclick={confirm}
      disabled={ledger.gold < 0}
    >
      {#if ledger.gold < 0}
        Over budget by {Math.abs(ledger.gold).toFixed(1)} gp
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

