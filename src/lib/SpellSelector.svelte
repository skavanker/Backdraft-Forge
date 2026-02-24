<script>
  import {
    getAvailableWizardSpells,
    getStartingSpellCount,
    getSpellsPerDay,
    isSpellcaster,
    clericSpells,
    druidSpells
  } from '../data/spells.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SlotCounter from './SlotCounter.svelte';

  let { classKey, wizardSchool, abilities, existingSpells = null, onComplete } = $props();

  let isCaster = $derived(isSpellcaster(classKey));
  let isWizard = $derived(['mage', 'specialist'].includes(classKey));
  let isDivine = $derived(['cleric', 'druid'].includes(classKey));

  // Wizard spell selection
  let availableSpells = $derived(
    isWizard ? getAvailableWizardSpells(wizardSchool?.key) : []
  );
  let startingCount = $derived(
    isWizard ? getStartingSpellCount(abilities.INT) : 0
  );
  let selectedSpells = $state([]);

  // Read Magic is required for wizards
  let readMagic = $derived(availableSpells.find(s => s.key === 'readMagic'));

  // Divine casters have access to all spells, just select prepared
  let divineSpells = $derived(
    classKey === 'cleric' ? clericSpells :
    classKey === 'druid' ? druidSpells :
    []
  );
  let spellsPerDay = $derived(
    isDivine ? getSpellsPerDay(classKey, abilities.WIS) : 1
  );
  let preparedSpells = $state([]);

  // Group wizard spells by school
  let spellsBySchool = $derived(() => {
    const schools = {};
    for (const spell of availableSpells) {
      if (spell.required) continue; // Skip Read Magic, it's auto-included
      if (!schools[spell.school]) {
        schools[spell.school] = [];
      }
      schools[spell.school].push(spell);
    }
    return schools;
  });

  function toggleSpell(spell) {
    if (selectedSpells.find(s => s.key === spell.key)) {
      selectedSpells = selectedSpells.filter(s => s.key !== spell.key);
    } else if (selectedSpells.length < startingCount - 1) {
      // -1 because Read Magic is auto-included
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

  function confirm() {
    if (isWizard) {
      const spellbook = readMagic ? [readMagic, ...selectedSpells] : selectedSpells;
      onComplete({
        type: 'arcane',
        spellbook,
        memorized: spellbook.slice(0, 1), // Can memorize 1 at level 1
        spellsPerDay: 1
      });
    } else if (isDivine) {
      onComplete({
        type: 'divine',
        available: divineSpells,
        prepared: preparedSpells,
        spellsPerDay
      });
    } else {
      onComplete({ type: 'none' });
    }
  }

  // Initialize from existing data
  onMount(() => {
    if (existingSpells) {
      if (existingSpells.type === 'arcane' && existingSpells.spellbook) {
        // Remove Read Magic if it's in the spellbook (it's auto-added)
        selectedSpells = existingSpells.spellbook.filter(s => s.key !== 'readMagic');
      } else if (existingSpells.type === 'divine' && existingSpells.prepared) {
        preparedSpells = existingSpells.prepared;
      }
    }
  });

  function canConfirm() {
    if (isWizard) {
      return selectedSpells.length === startingCount - 1;
    }
    if (isDivine) {
      return preparedSpells.length === spellsPerDay;
    }
    return true;
  }

  let remainingSlots = $derived(
    isWizard ? (startingCount - 1) - selectedSpells.length :
    isDivine ? spellsPerDay - preparedSpells.length :
    0
  );
</script>

<div class="spell-selector">
  {#if !isCaster}
    <div class="no-spells">
      <p>Your class does not cast spells at 1st level.</p>
      <button class="btn-primary" onclick={confirm}>
        Continue to Backstory
      </button>
    </div>

  {:else if isWizard}
    <div class="wizard-spells">
      <div class="spell-header">
        <p class="intro">
          Your spellbook starts with <strong>Read Magic</strong> plus
          <strong>{startingCount - 1}</strong> additional spells based on your Intelligence.
        </p>
        <SlotCounter label="Spells Selected" used={selectedSpells.length} total={startingCount - 1} />
      </div>

      {#if wizardSchool}
        <p class="school-note">
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
                <button
                  class="spell-card"
                  class:selected
                  class:disabled
                  onclick={() => !disabled && toggleSpell(spell)}
                >
                  {spell.name}
                </button>
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
        <p class="intro">
          As a {classKey === 'cleric' ? 'Cleric' : 'Druid'}, you have access to all 1st-level
          {classKey === 'cleric' ? 'clerical' : 'druidic'} spells.
          Prepare <strong>{spellsPerDay}</strong> spell{spellsPerDay !== 1 ? 's' : ''} for today.
        </p>
        <SlotCounter label="Spells Prepared" used={preparedSpells.length} total={spellsPerDay} />
      </div>

      <div class="spell-grid">
        {#each divineSpells as spell}
          {@const selected = preparedSpells.find(s => s.key === spell.key)}
          {@const disabled = !selected && remainingSlots === 0}
          <Tooltip text={spell.description} position="bottom">
            <button
              class="spell-card divine"
              class:selected
              class:disabled
              onclick={() => !disabled && togglePrepared(spell)}
            >
              {spell.name}
            </button>
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
</div>

<style lang="scss">
  .spell-selector {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .no-spells {
    text-align: center;

    p {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }
  }

  .spell-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;

    .intro {
      text-align: center;
      color: var(--text-body);
      margin: 0;
    }
  }

  .school-note {
    text-align: center;
    font-size: 0.9rem;
    color: var(--gold-dark);
    padding: 0.5rem 1rem;
    background: rgba(201, 162, 39, 0.1);
    border-radius: 4px;
    margin: 0;
  }

  .auto-spell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(34, 139, 34, 0.1);
    border: 1px solid rgba(34, 139, 34, 0.3);
    border-radius: 4px;

    .auto-label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .spell-name {
      font-weight: 600;
      color: #228b22;
    }

    .spell-school {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  }

  .school-section {
    .school-title {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.5rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .spell-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .spell-card {
    padding: 0.5rem 0.75rem;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 0.9rem;
    color: var(--text-body);
    cursor: pointer;
    transition: all 0.15s;

    &:hover:not(.disabled) {
      border-color: var(--border-strong);
      background: var(--bg-hover);

      .spell-name {
        color: var(--text-hover);
      }
    }

    &.selected {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.15);
      color: var(--text-primary);
      font-weight: 500;

      &:hover {
        border-color: var(--gold);
        background: rgba(201, 162, 39, 0.25);
      }
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.divine {
      // Divine spells have a slightly different style
    }
  }

  .selected-summary {
    padding: 1rem;
    background: var(--bg-panel);
    border-radius: 4px;

    h4 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      color: var(--text-body);
    }

    ul {
      margin: 0;
      padding-left: 1.25rem;
      font-size: 0.9rem;
      color: var(--text-body);

      li {
        margin-bottom: 0.25rem;
      }
    }
  }

  .btn-primary {
    align-self: center;

    &:disabled {
      opacity: 0.6;
    }
  }

  .wizard-spells,
  .divine-spells {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
</style>
