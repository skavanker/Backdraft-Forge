<script>
  import {
    getAvailableWizardSpells,
    wizardSpells
  } from '../data/spells.js';
  import { getPriestSpellsForClass, groupByLevel } from '../data/priestSpells.js';
  import { deities } from '../data/deities.js';
  import { getSpellSlots } from '../data/levelTables.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SlotCounter from './SlotCounter.svelte';
  import SelectableChip from './components/SelectableChip.svelte';
  import { ordinal } from './utils/formatUtils.js';

  let {
    classKey,
    wizardSchool = null,
    existingSpells = null,
    characterLevel = 1,
    deityKey = null,
    isWizard,
    isBard,
    usesArcane,
    usesDivine,
    onComplete,
    onCancel = null
  } = $props();

  // Deity sphere override
  let deityOverride = $derived(deityKey ? deities[deityKey] : null);

  // Spell slots
  let spellSlots = $derived(getSpellSlots(classKey, characterLevel));

  let readMagic = $derived(
    isWizard ? (getAvailableWizardSpells(wizardSchool?.key).find(s => s.key === 'readMagic')) : null
  );

  // Manage state
  let manageSpellbook = $state({});
  let manageMemorized = $state({});
  let managePrepared = $state({});

  // Max spell levels
  function maxArcaneLevel() {
    if (isWizard) return 9;
    if (isBard) return 6;
    if (classKey === 'ranger') return 3;
    return 0;
  }

  function maxDivineLevel() {
    if (classKey === 'cleric' || classKey === 'druid') return 7;
    if (classKey === 'paladin') return 4;
    if (classKey === 'ranger') return 3;
    return 0;
  }

  // Available spells by level
  let arcaneSpellsByLevel = $derived(() => {
    if (!usesArcane) return {};
    const schoolKey = wizardSchool?.key || null;
    const filtered = isBard
      ? wizardSpells.filter(s => s.level <= maxArcaneLevel())
      : getAvailableWizardSpells(schoolKey, maxArcaneLevel());
    return groupByLevel(filtered);
  });

  let divineSpellsByLevel = $derived(() => {
    if (!usesDivine) return {};
    const maxDiv = maxDivineLevel();
    const filtered = getPriestSpellsForClass(classKey, deityOverride, maxDiv);
    return groupByLevel(filtered);
  });

  // Slot helpers
  function getSlotsForLevel(level) {
    if (!spellSlots) return 0;
    return spellSlots[level - 1] || 0;
  }

  // Toggle functions
  function toggleManageSpellbook(level, spell) {
    const current = manageSpellbook[level] || [];
    const idx = current.findIndex(s => s.key === spell.key);
    if (idx >= 0) {
      manageSpellbook[level] = current.filter(s => s.key !== spell.key);
      manageMemorized[level] = (manageMemorized[level] || []).filter(s => s.key !== spell.key);
    } else {
      manageSpellbook[level] = [...current, spell];
    }
    manageSpellbook = { ...manageSpellbook };
    manageMemorized = { ...manageMemorized };
  }

  function toggleManageMemorized(level, spell) {
    const current = manageMemorized[level] || [];
    const slots = getSlotsForLevel(level);
    const idx = current.findIndex(s => s.key === spell.key);
    if (idx >= 0) {
      manageMemorized[level] = current.filter(s => s.key !== spell.key);
    } else if (current.length < slots) {
      manageMemorized[level] = [...current, spell];
    }
    manageMemorized = { ...manageMemorized };
  }

  function toggleManagePrepared(level, spell) {
    const current = managePrepared[level] || [];
    const slots = getSlotsForLevel(level);
    const idx = current.findIndex(s => s.key === spell.key);
    if (idx >= 0) {
      managePrepared[level] = current.filter(s => s.key !== spell.key);
    } else if (current.length < slots) {
      managePrepared[level] = [...current, spell];
    }
    managePrepared = { ...managePrepared };
  }

  // Confirm
  function confirmManage() {
    if (usesArcane && !usesDivine) {
      const spellbook = Object.values(manageSpellbook).flat();
      const memorized = Object.values(manageMemorized).flat();
      if (isWizard && readMagic && !spellbook.find(s => s.key === 'readMagic')) {
        spellbook.unshift(readMagic);
      }
      onComplete({
        type: 'arcane',
        spellbook,
        memorized,
        spellsPerDay: spellSlots ? spellSlots.reduce((a, b) => a + b, 0) : 0
      });
    } else if (usesDivine && !usesArcane) {
      const prepared = Object.values(managePrepared).flat();
      onComplete({
        type: 'divine',
        prepared,
        spellsPerDay: spellSlots ? spellSlots.reduce((a, b) => a + b, 0) : 0
      });
    } else if (classKey === 'ranger') {
      const prepared = Object.values(managePrepared).flat();
      const spellbook = Object.values(manageSpellbook).flat();
      const memorized = Object.values(manageMemorized).flat();
      onComplete({
        type: 'dual',
        prepared,
        spellbook,
        memorized,
        spellsPerDay: spellSlots ? spellSlots.reduce((a, b) => a + b, 0) : 0
      });
    }
  }

  // Initialize from existing
  onMount(() => {
    if (existingSpells) {
      if (existingSpells.type === 'arcane' && existingSpells.spellbook) {
        manageSpellbook = groupByLevel(existingSpells.spellbook);
        if (existingSpells.memorized) {
          manageMemorized = groupByLevel(existingSpells.memorized);
        }
      } else if (existingSpells.type === 'divine' && existingSpells.prepared) {
        managePrepared = groupByLevel(existingSpells.prepared);
      } else if (existingSpells.type === 'dual') {
        if (existingSpells.prepared) managePrepared = groupByLevel(existingSpells.prepared);
        if (existingSpells.spellbook) manageSpellbook = groupByLevel(existingSpells.spellbook);
        if (existingSpells.memorized) manageMemorized = groupByLevel(existingSpells.memorized);
      }
    }
  });
</script>

<div class="manage-mode">
  {#if usesArcane && classKey !== 'ranger'}
    <div class="manage-section">
      <h3>Spellbook & Memorization</h3>
      <p class="section-hint">Add spells to your spellbook, then select which to memorize.</p>

      {#each Object.entries(arcaneSpellsByLevel()) as [level, spells]}
        {@const slots = getSlotsForLevel(Number(level))}
        {@const bookSpells = manageSpellbook[level] || []}
        {@const memSpells = manageMemorized[level] || []}
        {#if slots > 0}
          <div class="flex-column gap-sm panel">
            <div class="level-header">
              <h4>{ordinal(Number(level))} Level</h4>
              <SlotCounter label="Memorized" used={memSpells.length} total={slots} />
            </div>

            <div class="spell-subsection">
              <h5>Spellbook</h5>
              <div class="spell-grid">
                {#each spells as spell}
                  {@const inBook = bookSpells.find(s => s.key === spell.key)}
                  <Tooltip text={spell.description} position="bottom">
                    <SelectableChip
                      label={spell.name}
                      selected={!!inBook}
                      onclick={() => toggleManageSpellbook(level, spell)}
                    />
                  </Tooltip>
                {/each}
              </div>
            </div>

            {#if bookSpells.length > 0}
              <div class="spell-subsection">
                <h5>Memorize</h5>
                <div class="spell-grid">
                  {#each bookSpells as spell}
                    {@const memorized = memSpells.find(s => s.key === spell.key)}
                    {@const disabled = !memorized && memSpells.length >= slots}
                    <SelectableChip
                      label={spell.name}
                      selected={!!memorized}
                      {disabled}
                      onclick={() => toggleManageMemorized(level, spell)}
                    />
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  {#if usesDivine && classKey !== 'ranger'}
    <div class="manage-section">
      <h3>Prepared Spells</h3>
      <p class="section-hint">Select spells to prepare from your available spheres.</p>

      {#each Object.entries(divineSpellsByLevel()) as [level, spells]}
        {@const slots = getSlotsForLevel(Number(level))}
        {@const prepSpells = managePrepared[level] || []}
        {#if slots > 0}
          <div class="flex-column gap-sm panel">
            <div class="level-header">
              <h4>{ordinal(Number(level))} Level</h4>
              <SlotCounter label="Prepared" used={prepSpells.length} total={slots} />
            </div>
            <div class="spell-grid">
              {#each spells as spell}
                {@const selected = prepSpells.find(s => s.key === spell.key)}
                {@const disabled = !selected && prepSpells.length >= slots}
                <Tooltip text={spell.description} position="bottom">
                  <SelectableChip
                    label={spell.name}
                    selected={!!selected}
                    {disabled}
                    onclick={() => toggleManagePrepared(level, spell)}
                  />
                </Tooltip>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  {#if classKey === 'ranger'}
    <!-- Ranger: priest spells -->
    <div class="manage-section">
      <h3>Priest Spells</h3>
      {#each Object.entries(divineSpellsByLevel()) as [level, spells]}
        {@const slots = getSlotsForLevel(Number(level))}
        {@const prepSpells = managePrepared[level] || []}
        {#if slots > 0}
          <div class="flex-column gap-sm panel">
            <div class="level-header">
              <h4>{ordinal(Number(level))} Level</h4>
              <SlotCounter label="Prepared" used={prepSpells.length} total={slots} />
            </div>
            <div class="spell-grid">
              {#each spells as spell}
                {@const selected = prepSpells.find(s => s.key === spell.key)}
                {@const disabled = !selected && prepSpells.length >= slots}
                <Tooltip text={spell.description} position="bottom">
                  <SelectableChip
                    label={spell.name}
                    selected={!!selected}
                    {disabled}
                    onclick={() => toggleManagePrepared(level, spell)}
                  />
                </Tooltip>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
    <!-- Ranger: wizard spells -->
    <div class="manage-section">
      <h3>Wizard Spells</h3>
      {#each Object.entries(arcaneSpellsByLevel()) as [level, spells]}
        {@const slots = getRangerWizSlotsForLevel(Number(level))}
        {@const bookSpells = manageSpellbook[level] || []}
        {@const memSpells = manageMemorized[level] || []}
        {#if slots > 0}
          <div class="flex-column gap-sm panel">
            <div class="level-header">
              <h4>{ordinal(Number(level))} Level</h4>
              <SlotCounter label="Memorized" used={memSpells.length} total={slots} />
            </div>
            <div class="spell-subsection">
              <h5>Spellbook</h5>
              <div class="spell-grid">
                {#each spells as spell}
                  {@const inBook = bookSpells.find(s => s.key === spell.key)}
                  <Tooltip text={spell.description} position="bottom">
                    <SelectableChip
                      label={spell.name}
                      selected={!!inBook}
                      onclick={() => toggleManageSpellbook(level, spell)}
                    />
                  </Tooltip>
                {/each}
              </div>
            </div>
            {#if bookSpells.length > 0}
              <div class="spell-subsection">
                <h5>Memorize</h5>
                <div class="spell-grid">
                  {#each bookSpells as spell}
                    {@const memorized = memSpells.find(s => s.key === spell.key)}
                    {@const disabled = !memorized && memSpells.length >= slots}
                    <SelectableChip
                      label={spell.name}
                      selected={!!memorized}
                      {disabled}
                      onclick={() => toggleManageMemorized(level, spell)}
                    />
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  {/if}

  <div class="manage-actions">
    <button class="btn-primary" onclick={confirmManage}>Save Spells</button>
    {#if onCancel}
      <button class="btn-secondary" onclick={onCancel}>Cancel</button>
    {/if}
  </div>
</div>

<style lang="scss">
  @import './styles/shared';
  @import './styles/spells';
</style>
