<script>
  import {
    getAvailableWizardSpells,
    getStartingSpellCount,
    getSpellsPerDay,
  } from '../data/spells.js';
  import { getPriestSpellsForClass, groupByLevel } from '../data/priestSpells.js';
  import { deities } from '../data/deities.js';
  import Tooltip from './Tooltip.svelte';
  import SlotCounter from './SlotCounter.svelte';
  import SelectableChip from './components/SelectableChip.svelte';
  import { onMount } from 'svelte';

  let {
    classKey,
    wizardSchool = null,
    abilities,
    existingSpells = null,
    deityKey = null,
    isCaster,
    isWizard,
    isDivine,
    onComplete
  } = $props();

  // Deity sphere override for clerics/paladins
  let deityOverride = $derived(deityKey ? deities[deityKey] : null);

  // Wizard spell selection
  let availableSpells = $derived(
    isWizard ? getAvailableWizardSpells(wizardSchool?.key).filter(s => s.level === 1) : []
  );
  let startingCount = $derived(
    isWizard ? getStartingSpellCount(abilities.INT) : 0
  );
  let selectedSpells = $state([]);
  let selectedSpellKeys = $derived(new Set(selectedSpells.map(s => s.key)));

  let readMagic = $derived(availableSpells.find(s => s.key === 'readMagic'));

  // Divine: creation mode uses sphere filtering
  let divineSpellsLevel1 = $derived(() => {
    if (!isDivine) return [];
    return getPriestSpellsForClass(classKey, deityOverride, 1);
  });
  let spellsPerDay = $derived(
    isDivine ? getSpellsPerDay(classKey, abilities.WIS) : 1
  );
  let preparedSpells = $state([]);
  let preparedSpellKeys = $derived(new Set(preparedSpells.map(s => s.key)));

  // Group wizard spells by school
  let spellsBySchool = $derived(() => {
    const schools = {};
    for (const spell of availableSpells) {
      if (spell.required) continue;
      if (!schools[spell.school]) schools[spell.school] = [];
      schools[spell.school].push(spell);
    }
    return schools;
  });

  // Toggle functions
  function toggleSpell(spell) {
    if (selectedSpellKeys.has(spell.key)) {
      selectedSpells = selectedSpells.filter(s => s.key !== spell.key);
    } else if (selectedSpells.length < startingCount - 1) {
      selectedSpells = [...selectedSpells, spell];
    }
  }

  function togglePrepared(spell) {
    if (preparedSpellKeys.has(spell.key)) {
      preparedSpells = preparedSpells.filter(s => s.key !== spell.key);
    } else if (preparedSpells.length < spellsPerDay) {
      preparedSpells = [...preparedSpells, spell];
    }
  }

  function confirm() {
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

  function canConfirm() {
    if (isWizard) return selectedSpells.length === startingCount - 1;
    if (isDivine) return preparedSpells.length === spellsPerDay;
    return true;
  }

  let remainingSlots = $derived(
    isWizard ? (startingCount - 1) - selectedSpells.length :
    isDivine ? spellsPerDay - preparedSpells.length :
    0
  );

  // Initialize from existing
  onMount(() => {
    if (existingSpells) {
      if (existingSpells.type === 'arcane' && existingSpells.spellbook) {
        selectedSpells = existingSpells.spellbook.filter(s => s.key !== 'readMagic');
      } else if (existingSpells.type === 'divine' && existingSpells.prepared) {
        preparedSpells = existingSpells.prepared;
      }
    }
  });
</script>

{#if !isCaster}
  <div class="no-spells">
    <p class="section-hint">Your class does not cast spells at 1st level.</p>
    <button class="btn-primary" onclick={confirm}>
      Continue to Backstory
    </button>
  </div>

{:else if isWizard}
  <div class="flex-column gap-lg">
    <div class="flex-column gap-md" style="align-items:center">
      <p class="section-hint">
        Your spellbook starts with <strong>Read Magic</strong> plus
        <strong>{startingCount - 1}</strong> additional spells based on your Intelligence.
      </p>
      <SlotCounter label="Spells Selected" used={selectedSpells.length} total={startingCount - 1} />
    </div>

    {#if wizardSchool}
      <p class="section-hint school-note alert alert-warning">
        As a {wizardSchool.name}, you cannot learn spells from:
        <strong>{wizardSchool.oppositionSchools.join(', ')}</strong>
      </p>
    {/if}

    <div class="auto-spell alert alert-success">
      <span class="auto-label">Automatically included:</span>
      <span class="spell-name">Read Magic</span>
      <span class="spell-school">(Divination)</span>
    </div>

    {#each Object.entries(spellsBySchool()) as [school, spells]}
      <div class="school-section">
        <h4 class="school-title">{school}</h4>
        <div class="spell-grid">
          {#each spells as spell}
            {@const selected = selectedSpellKeys.has(spell.key)}
            {@const disabled = !selected && remainingSlots === 0}
            <Tooltip text={spell.description} position="bottom">
              <SelectableChip
                label={spell.name}
                {selected}
                {disabled}
                onclick={() => toggleSpell(spell)}
              />
            </Tooltip>
          {/each}
        </div>
      </div>
    {/each}

    {#if selectedSpells.length > 0}
      <div class="selected-summary panel">
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
  <div class="flex-column gap-lg">
    <div class="flex-column gap-md" style="align-items:center">
      <p class="section-hint">
        As a {classKey === 'cleric' ? 'Cleric' : 'Druid'}, you have access to
        {deityOverride ? deityOverride.name + "'s" : 'all 1st-level ' + (classKey === 'cleric' ? 'clerical' : 'druidic')} spells.
        Prepare <strong>{spellsPerDay}</strong> spell{spellsPerDay !== 1 ? 's' : ''} for today.
      </p>
      <SlotCounter label="Spells Prepared" used={preparedSpells.length} total={spellsPerDay} />
    </div>

    <div class="spell-grid">
      {#each divineSpellsLevel1() as spell}
        {@const selected = preparedSpellKeys.has(spell.key)}
        {@const disabled = !selected && remainingSlots === 0}
        <Tooltip text={spell.description} position="bottom">
          <SelectableChip
            label={spell.name}
            {selected}
            {disabled}
            onclick={() => togglePrepared(spell)}
          />
        </Tooltip>
      {/each}
    </div>

    {#if preparedSpells.length > 0}
      <div class="selected-summary panel">
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

<style lang="scss">
  @import './styles/shared';
  @import './styles/spells';
</style>
