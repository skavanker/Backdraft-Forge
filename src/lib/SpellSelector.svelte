<script>
  import {
    getAvailableWizardSpells,
    getStartingSpellCount,
    getSpellsPerDay,
    isSpellcaster,
    wizardSpells
  } from '../data/spells.js';
  import { getPriestSpellsForClass, groupByLevel } from '../data/priestSpells.js';
  import { deities } from '../data/deities.js';
  import { getSpellSlots, getRangerWizardSlots } from '../data/levelTables.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SlotCounter from './SlotCounter.svelte';
  import SelectableChip from './components/SelectableChip.svelte';

  let {
    classKey,
    wizardSchool = null,
    abilities,
    existingSpells = null,
    onComplete,
    // New props for manage mode
    mode = 'creation',
    characterLevel = 1,
    deityKey = null,
    onCancel = null
  } = $props();

  let isCaster = $derived(isSpellcaster(classKey, characterLevel));
  let isWizard = $derived(['mage', 'specialist'].includes(classKey));
  let isBard = $derived(classKey === 'bard');
  let isDivine = $derived(['cleric', 'druid', 'paladin', 'ranger'].includes(classKey));

  // For manage mode: does this class use arcane spells?
  let usesArcane = $derived(isWizard || isBard || classKey === 'ranger');
  let usesDivine = $derived(['cleric', 'druid', 'paladin', 'ranger'].includes(classKey));

  // Deity sphere override for clerics/paladins
  let deityOverride = $derived(deityKey ? deities[deityKey] : null);

  // ─── Spell Slots ───────────────────────────────────────
  let spellSlots = $derived(getSpellSlots(classKey, characterLevel));
  let rangerWizardSlots = $derived(classKey === 'ranger' ? getRangerWizardSlots(characterLevel) : null);

  // ─── CREATION MODE (level 1) ───────────────────────────
  // Wizard spell selection
  let availableSpells = $derived(
    isWizard ? getAvailableWizardSpells(wizardSchool?.key).filter(s => s.level === 1) : []
  );
  let startingCount = $derived(
    isWizard ? getStartingSpellCount(abilities.INT) : 0
  );
  let selectedSpells = $state([]);

  let readMagic = $derived(availableSpells.find(s => s.key === 'readMagic'));

  // Divine: creation mode uses sphere filtering
  let divineSpellsLevel1 = $derived(() => {
    if (!isDivine || mode !== 'creation') return [];
    return getPriestSpellsForClass(classKey, deityOverride, 1);
  });
  let spellsPerDay = $derived(
    isDivine ? getSpellsPerDay(classKey, abilities.WIS) : 1
  );
  let preparedSpells = $state([]);

  // Group wizard spells by school (creation mode)
  let spellsBySchool = $derived(() => {
    const schools = {};
    for (const spell of availableSpells) {
      if (spell.required) continue;
      if (!schools[spell.school]) schools[spell.school] = [];
      schools[spell.school].push(spell);
    }
    return schools;
  });

  // ─── MANAGE MODE ───────────────────────────────────────
  // Wizard manage: spellbook per level + memorized per level
  let manageSpellbook = $state({});
  let manageMemorized = $state({});

  // Divine manage: prepared per level
  let managePrepared = $state({});

  // Get available spells for manage mode by level
  let arcaneSpellsByLevel = $derived(() => {
    if (!usesArcane || mode !== 'manage') return {};
    const schoolKey = wizardSchool?.key || null;
    // Bard has no school restrictions
    const filtered = isBard
      ? wizardSpells.filter(s => s.level <= maxArcaneLevel())
      : getAvailableWizardSpells(schoolKey, maxArcaneLevel());
    return groupByLevel(filtered);
  });

  let divineSpellsByLevel = $derived(() => {
    if (!usesDivine || mode !== 'manage') return {};
    const maxDiv = maxDivineLevel();
    const filtered = getPriestSpellsForClass(classKey, deityOverride, maxDiv);
    return groupByLevel(filtered);
  });

  // Max spell levels based on class
  function maxArcaneLevel() {
    if (isWizard) return 9;
    if (isBard) return 6; // Bards can cast up to 6th level
    if (classKey === 'ranger') return 3; // Rangers get wizard spells up to 3rd
    return 0;
  }

  function maxDivineLevel() {
    if (classKey === 'cleric' || classKey === 'druid') return 7;
    if (classKey === 'paladin') return 4;
    if (classKey === 'ranger') return 3;
    return 0;
  }

  // Get slot count for a spell level
  function getSlotsForLevel(level) {
    if (!spellSlots) return 0;
    return spellSlots[level - 1] || 0;
  }

  function getRangerWizSlotsForLevel(level) {
    if (!rangerWizardSlots) return 0;
    return rangerWizardSlots[level - 1] || 0;
  }

  // Manage mode toggle for spellbook (wizard only)
  function toggleManageSpellbook(level, spell) {
    const current = manageSpellbook[level] || [];
    const idx = current.findIndex(s => s.key === spell.key);
    if (idx >= 0) {
      // Remove from spellbook + memorized
      manageSpellbook[level] = current.filter(s => s.key !== spell.key);
      manageMemorized[level] = (manageMemorized[level] || []).filter(s => s.key !== spell.key);
    } else {
      manageSpellbook[level] = [...current, spell];
    }
    manageSpellbook = { ...manageSpellbook };
    manageMemorized = { ...manageMemorized };
  }

  // Toggle memorized from spellbook (wizard)
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

  // Toggle prepared for divine (manage mode)
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

  // ─── Creation mode toggle functions ────────────────────
  function toggleSpell(spell) {
    if (selectedSpells.find(s => s.key === spell.key)) {
      selectedSpells = selectedSpells.filter(s => s.key !== spell.key);
    } else if (selectedSpells.length < startingCount - 1) {
      selectedSpells = [...selectedSpells, spell];
    }
  }

  function togglePrepared(spell) {
    if (preparedSpells.find(s => s.key === spell.key)) {
      preparedSpells = preparedSpells.filter(s => s.key !== spell.key);
    } else if (preparedSpells.length < spellsPerDay) {
      preparedSpells = [...preparedSpells, spell];
    }
  }

  // ─── Confirm / Complete ────────────────────────────────
  function confirm() {
    if (mode === 'manage') {
      confirmManage();
      return;
    }

    if (isWizard) {
      const spellbook = readMagic ? [readMagic, ...selectedSpells] : selectedSpells;
      onComplete({
        type: 'arcane',
        spellbook,
        memorized: spellbook.slice(0, 1),
        spellsPerDay: 1
      });
    } else if (isDivine) {
      onComplete({
        type: 'divine',
        available: divineSpellsLevel1(),
        prepared: preparedSpells,
        spellsPerDay
      });
    } else {
      onComplete({ type: 'none' });
    }
  }

  function confirmManage() {
    if (usesArcane && !usesDivine) {
      // Wizard / Bard — flatten spellbook & memorized
      const spellbook = Object.values(manageSpellbook).flat();
      const memorized = Object.values(manageMemorized).flat();
      // Keep Read Magic in spellbook if wizard
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
      // Cleric / Druid / Paladin
      const prepared = Object.values(managePrepared).flat();
      onComplete({
        type: 'divine',
        prepared,
        spellsPerDay: spellSlots ? spellSlots.reduce((a, b) => a + b, 0) : 0
      });
    } else if (classKey === 'ranger') {
      // Ranger: divine + wizard
      const prepared = Object.values(managePrepared).flat();
      const spellbook = Object.values(manageSpellbook).flat();
      const memorized = Object.values(manageMemorized).flat();
      onComplete({
        type: 'dual',
        prepared,
        spellbook,
        memorized,
        spellsPerDay: (spellSlots ? spellSlots.reduce((a, b) => a + b, 0) : 0) +
                       (rangerWizardSlots ? rangerWizardSlots.reduce((a, b) => a + b, 0) : 0)
      });
    }
  }

  // ─── Initialize ────────────────────────────────────────
  onMount(() => {
    if (existingSpells) {
      if (mode === 'creation') {
        if (existingSpells.type === 'arcane' && existingSpells.spellbook) {
          selectedSpells = existingSpells.spellbook.filter(s => s.key !== 'readMagic');
        } else if (existingSpells.type === 'divine' && existingSpells.prepared) {
          preparedSpells = existingSpells.prepared;
        }
      } else {
        // Manage mode: populate from existing
        if (existingSpells.type === 'arcane' && existingSpells.spellbook) {
          const byLevel = groupByLevel(existingSpells.spellbook);
          manageSpellbook = byLevel;
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
    }
  });

  function canConfirm() {
    if (mode === 'manage') return true; // manage mode is always confirmable
    if (isWizard) return selectedSpells.length === startingCount - 1;
    if (isDivine) return preparedSpells.length === spellsPerDay;
    return true;
  }

  let remainingSlots = $derived(
    isWizard ? (startingCount - 1) - selectedSpells.length :
    isDivine ? spellsPerDay - preparedSpells.length :
    0
  );

  // Ordinal suffix helper
  function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
</script>

<div class="spell-selector" class:manage-mode={mode === 'manage'}>
  {#if mode === 'manage'}
    <!-- ═══ MANAGE MODE ═══════════════════════════════════ -->
    {#if usesArcane && classKey !== 'ranger'}
      <div class="manage-section">
        <h3>Spellbook & Memorization</h3>
        <p class="section-hint">Add spells to your spellbook, then select which to memorize.</p>

        {#each Object.entries(arcaneSpellsByLevel()) as [level, spells]}
          {@const slots = getSlotsForLevel(Number(level))}
          {@const bookSpells = manageSpellbook[level] || []}
          {@const memSpells = manageMemorized[level] || []}
          {#if slots > 0}
            <div class="level-section">
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
            <div class="level-section">
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
            <div class="level-section">
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
            <div class="level-section">
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
      <button class="btn-primary" onclick={confirm}>Save Spells</button>
      {#if onCancel}
        <button class="btn-ghost" onclick={onCancel}>Cancel</button>
      {/if}
    </div>

  {:else}
    <!-- ═══ CREATION MODE ═════════════════════════════════ -->
    {#if !isCaster}
      <div class="no-spells">
        <p class="section-hint">Your class does not cast spells at 1st level.</p>
        <button class="btn-primary" onclick={confirm}>
          Continue to Backstory
        </button>
      </div>

    {:else if isWizard}
      <div class="wizard-spells">
        <div class="spell-header">
          <p class="section-hint">
            Your spellbook starts with <strong>Read Magic</strong> plus
            <strong>{startingCount - 1}</strong> additional spells based on your Intelligence.
          </p>
          <SlotCounter label="Spells Selected" used={selectedSpells.length} total={startingCount - 1} />
        </div>

        {#if wizardSchool}
          <p class="section-hint school-note">
            As a {wizardSchool.name}, you cannot learn spells from:
            <strong>{wizardSchool.oppositionSchools.join(', ')}</strong>
          </p>
        {/if}

        <div class="auto-spell">
          <span class="auto-label">Automatically included:</span>
          <span class="spell-name">Read Magic</span>
          <span class="spell-school">(Divination)</span>
        </div>

        {#each Object.entries(spellsBySchool()) as [school, spells]}
          <div class="school-section">
            <h4 class="school-title">{school}</h4>
            <div class="spell-grid">
              {#each spells as spell}
                {@const selected = selectedSpells.find(s => s.key === spell.key)}
                {@const disabled = !selected && remainingSlots === 0}
                <Tooltip text={spell.description} position="bottom">
                  <SelectableChip
                    label={spell.name}
                    selected={!!selected}
                    {disabled}
                    onclick={() => toggleSpell(spell)}
                  />
                </Tooltip>
              {/each}
            </div>
          </div>
        {/each}

        {#if selectedSpells.length > 0}
          <div class="selected-summary">
            <h4>Your Spellbook</h4>
            <ul>
              <li><strong>Read Magic</strong> (required)</li>
              {#each selectedSpells as spell}
                <li>{spell.name}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <button
          class="btn-primary"
          onclick={confirm}
          disabled={!canConfirm()}
        >
          {#if remainingSlots > 0}
            Select {remainingSlots} more spell{remainingSlots !== 1 ? 's' : ''}
          {:else}
            Confirm Spellbook → Backstory
          {/if}
        </button>
      </div>

    {:else if isDivine}
      <div class="divine-spells">
        <div class="spell-header">
          <p class="section-hint">
            As a {classKey === 'cleric' ? 'Cleric' : 'Druid'}, you have access to
            {deityOverride ? deityOverride.name + "'s" : 'all 1st-level ' + (classKey === 'cleric' ? 'clerical' : 'druidic')} spells.
            Prepare <strong>{spellsPerDay}</strong> spell{spellsPerDay !== 1 ? 's' : ''} for today.
          </p>
          <SlotCounter label="Spells Prepared" used={preparedSpells.length} total={spellsPerDay} />
        </div>

        <div class="spell-grid">
          {#each divineSpellsLevel1() as spell}
            {@const selected = preparedSpells.find(s => s.key === spell.key)}
            {@const disabled = !selected && remainingSlots === 0}
            <Tooltip text={spell.description} position="bottom">
              <SelectableChip
                label={spell.name}
                selected={!!selected}
                {disabled}
                onclick={() => togglePrepared(spell)}
              />
            </Tooltip>
          {/each}
        </div>

        {#if preparedSpells.length > 0}
          <div class="selected-summary">
            <h4>Prepared Spells</h4>
            <ul>
              {#each preparedSpells as spell}
                <li>{spell.name}</li>
              {/each}
            </ul>
          </div>
        {/if}

        <button
          class="btn-primary"
          onclick={confirm}
          disabled={!canConfirm()}
        >
          {#if remainingSlots > 0}
            Prepare {remainingSlots} more spell{remainingSlots !== 1 ? 's' : ''}
          {:else}
            Confirm Spells → Backstory
          {/if}
        </button>
      </div>
    {/if}
  {/if}
</div>


<style lang="scss">
  @import './SpellSelector.module.scss';

</style>

