<script>
  import { getAvailableClasses, getAvailableSchools } from '../data/classes.js';
  import { deities, getDeityList } from '../data/deities.js';
  import { getAvailableKits, classHasKits } from '../data/kits.js';
  import { ALIGNMENTS, getAlignmentName, getAllowedAlignments } from '../data/alignment.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SelectionPreview from './SelectionPreview.svelte';

  let { abilities, race, raceKey, existingClassKey = null, existingWizardSchool = null, existingDeityKey = null, existingKitKey = null, onComplete } = $props();

  let selectedClassKey = $state(existingClassKey);
  let selectedSchool = $state(existingWizardSchool);
  let selectedDeityKey = $state(existingDeityKey ?? null); // null = skipped deity (default), string = deity key
  let selectedKit = $state(existingKitKey ?? null); // null = skipped kit (default), string = kit key

  let classOptions = $derived(getAvailableClasses(abilities, race, raceKey));
  let qualifiedCount = $derived(classOptions.filter(c => c.qualified).length);

  let selectedClass = $derived(
    selectedClassKey ? classOptions.find(c => c.key === selectedClassKey) : null
  );

  let availableSchools = $derived(
    selectedClassKey === 'specialist' && abilities ? getAvailableSchools(abilities, raceKey) : []
  );

  let availableKits = $derived(
    selectedClassKey && abilities && !selectedClass?.cls.requiresSchool
      ? getAvailableKits(selectedClassKey, abilities, raceKey)
      : []
  );

  let hasKits = $derived(availableKits.length > 0);

  let needsDeity = $derived(
    selectedClassKey === 'cleric' || selectedClassKey === 'paladin'
  );

  let deityList = $derived(
    selectedClassKey === 'paladin'
      ? getDeityList().filter(d => d.alignment === null || getAllowedAlignments(ALIGNMENTS.LG).includes(d.alignment))
      : getDeityList()
  );

  let canConfirm = $derived(
    selectedClass &&
    (selectedClassKey !== 'specialist' || selectedSchool)
    // Deity and kit are auto-defaulted to "skipped" (null) so always valid
  );

  function selectClass(key) {
    selectedClassKey = key;
    selectedSchool = null;
    selectedKit = null; // Default to skipped
    selectedDeityKey = null; // Default to skipped
  }

  function confirm() {
    if (!canConfirm) return;

    // Get the full kit object if a kit was selected
    const kitData = selectedKit && typeof selectedKit === 'object' ? selectedKit : null;
    const kitKey = kitData ? kitData.key : null;

    // Paladins are always Lawful Good
    const result = {
      classKey: selectedClassKey,
      cls: selectedClass.cls,
      levelLimit: selectedClass.levelLimit,
      xpBonus: selectedClass.xpBonus,
      wizardSchool: selectedSchool,
      deityKey: selectedDeityKey || null,
      kitKey: kitKey,
      kit: kitData
    };

    // Auto-set paladin alignment
    if (selectedClassKey === 'paladin') {
      result.alignment = ALIGNMENTS.LG;
    }

    onComplete(result);
  }

  // Group classes by type
  let groupedClasses = $derived(() => {
    const groups = {
      warrior: { name: 'Warriors', classes: [] },
      wizard: { name: 'Wizards', classes: [] },
      priest: { name: 'Priests', classes: [] },
      rogue: { name: 'Rogues', classes: [] }
    };
    for (const c of classOptions) {
      groups[c.cls.group].classes.push(c);
    }
    return groups;
  });
</script>

<div class="class-selector">
  <p class="intro">
    As a <strong>{race.name}</strong>, you qualify for <strong>{qualifiedCount}</strong> of {classOptions.length} classes.
  </p>

  {#each Object.entries(groupedClasses()) as [groupKey, group]}
    {#if group.classes.length > 0}
      <div class="class-group">
        <h3 class="group-title">{group.name}</h3>
        <div class="class-grid">
          {#each group.classes as { key, cls, qualified, failedReqs, levelLimit, xpBonus }}
            {@const tooltipText = !qualified ? `Not available: ${failedReqs.join(', ')}` : ''}
            <Tooltip text={tooltipText} position="bottom">
              <button
                class="class-card"
                class:selected={selectedClassKey === key}
                class:disabled={!qualified}
                onclick={() => qualified && selectClass(key)}
                disabled={!qualified}
              >
                <div class="class-header">
                  <h4 class="class-name">{cls.name}</h4>
                  <span class="hit-die">{cls.hitDie}</span>
                </div>
                <p class="class-desc">{cls.description}</p>

                {#if qualified}
                  <div class="class-meta">
                    {#if xpBonus > 0}
                      <span class="xp-bonus">+{xpBonus}% XP</span>
                    {/if}
                    {#if levelLimit !== null}
                      <span class="level-limit">Max level {levelLimit}</span>
                    {/if}
                  </div>
                {:else}
                  <span class="unavailable-badge">Unavailable</span>
                {/if}
              </button>
            </Tooltip>
          {/each}
        </div>
      </div>
    {/if}
  {/each}

  <!-- School Selection (for Specialist Wizards) -->
  {#if selectedClass && selectedClassKey === 'specialist'}
    <div class="selection-section">
      <div class="section-header">
        <h3>Choose Your School of Magic</h3>
        <p class="section-hint">Specialist wizards gain bonus spells but cannot cast from opposition schools.</p>
      </div>

      <div class="option-grid">
        {#each availableSchools as school}
          {@const tooltipText = !school.qualified ? school.failedReqs.join(', ') : `Opposition: ${school.oppositionSchools.join(', ')}`}
          <Tooltip text={tooltipText} position="bottom">
            <button
              class="option-card"
              class:selected={selectedSchool?.key === school.key}
              class:disabled={!school.qualified}
              onclick={() => school.qualified && (selectedSchool = { key: school.key, ...school })}
              disabled={!school.qualified}
            >
              <span class="option-name">{school.name}</span>
              <span class="option-desc">{school.school}</span>
              {#if !school.qualified}
                <span class="unavailable-badge">Unavailable</span>
              {/if}
            </button>
          </Tooltip>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Kit Selection (appears underneath class grid) -->
  {#if selectedClass && hasKits && selectedClassKey !== 'specialist'}
    <div class="selection-section">
      <div class="section-header">
        <h3>Choose a Kit (Optional)</h3>
        <p class="section-hint">Kits modify your class with special abilities and restrictions. You can play without a kit.</p>
      </div>

      <div class="option-grid">
        <Tooltip text="Play as a standard {selectedClass.cls.name} without kit modifications" position="bottom">
          <button
            class="option-card skip-kit"
            class:selected={selectedKit === null}
            onclick={() => selectedKit = null}
          >
            <span class="option-name">Skip Kit</span>
            <span class="option-desc">Play Vanilla {selectedClass.cls.name}</span>
          </button>
        </Tooltip>

        {#each availableKits as kit}
          {@const tooltipText = !kit.qualified
            ? `Not available: ${kit.failedReqs.join(', ')}`
            : `${kit.description}\n\nAbilities: ${kit.specialAbilities.join(' • ')}`}
          <Tooltip text={tooltipText} position="bottom">
            <button
              class="option-card"
              class:selected={selectedKit?.key === kit.key}
              class:disabled={!kit.qualified}
              onclick={() => kit.qualified && (selectedKit = kit)}
              disabled={!kit.qualified}
            >
              <span class="option-name">{kit.name}</span>
              <span class="option-desc">{kit.description}</span>
              {#if !kit.qualified}
                <span class="unavailable-badge">Unavailable</span>
              {/if}
            </button>
          </Tooltip>
        {/each}
      </div>

      {#if selectedKit && selectedKit !== null}
        <div class="kit-details fade-in">
          <div class="kit-abilities">
            <h5>Special Abilities</h5>
            <ul>
              {#each selectedKit.specialAbilities as ability}
                <li>{ability}</li>
              {/each}
            </ul>
          </div>
          <div class="kit-restrictions">
            <h5>Restrictions</h5>
            <ul>
              {#each selectedKit.restrictions as restriction}
                <li>{restriction}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Deity Selection (for Clerics/Paladins) - after kit selection -->
  {#if selectedClass && needsDeity}
    <div class="selection-section">
      <div class="section-header">
        <h3>Choose Your Deity (Optional)</h3>
        <p class="section-hint">Your deity determines which spell spheres you can access. Skip for standard cleric access.</p>
      </div>

      <div class="option-grid deity-grid">
        <Tooltip text="Standard cleric with access to all common spell spheres" position="bottom">
          <button
            class="option-card deity-card skip-deity"
            class:selected={selectedDeityKey === null}
            onclick={() => selectedDeityKey = null}
          >
            <span class="option-name">Skip Deity</span>
            <span class="option-desc">Standard Cleric</span>
          </button>
        </Tooltip>

        {#each deityList as deity}
          <Tooltip text={deity.description} position="bottom">
            <button
              class="option-card deity-card"
              class:selected={selectedDeityKey === deity.key}
              onclick={() => selectedDeityKey = deity.key}
            >
              <span class="option-name">{deity.name}</span>
              <span class="option-desc">{getAlignmentName(deity.alignment)}</span>
            </button>
          </Tooltip>
        {/each}
      </div>
    </div>
  {/if}

  {#if selectedClass}
    {@const confirmText =
      selectedClassKey === 'specialist' && !selectedSchool ? 'Select a School to Continue' :
      `Confirm ${selectedKit?.name ?? selectedSchool?.name ?? selectedClass.cls.name} → Review Stats`}
    <div class="fade-in">
      <SelectionPreview
        title={selectedClass.cls.name}
        confirmLabel={confirmText}
        onConfirm={confirm}
        disabled={!canConfirm}
      >
      <div class="features-section">
        <h4>Class Features</h4>
        <ul class="features-list">
          {#each selectedClass.cls.features as feature}
            <li>{feature}</li>
          {/each}
        </ul>
      </div>

      <div class="stats-section">
        <h4>Class Stats</h4>
        <div class="stat-list">
          <div class="stat-row">
            <span class="stat-label">Hit Die</span>
            <span class="stat-value">{selectedClass.cls.hitDie}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Prime Requisite</span>
            <span class="stat-value">{selectedClass.cls.primeRequisite.join(', ')}</span>
          </div>
          {#if selectedClass.xpBonus > 0}
            <div class="stat-row highlight">
              <span class="stat-label">XP Bonus</span>
              <span class="stat-value">+{selectedClass.xpBonus}%</span>
            </div>
          {/if}
          {#if selectedClass.levelLimit !== null}
            <div class="stat-row warning">
              <span class="stat-label">Level Limit</span>
              <span class="stat-value">{selectedClass.levelLimit}</span>
            </div>
          {/if}
        </div>
      </div>
      </SelectionPreview>
    </div>
  {/if}
</div>

<style lang="scss">
  .class-selector {
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .intro {
    text-align: center;
  }

  .class-group {
    .group-title {
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding-bottom: $space-xs;
      border-bottom: 1px solid var(--border-color);
    }
  }

  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
  }

  .class-card {
    @include selectable-card;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: $space-md;
    min-height: 120px;

    &:hover:not(.disabled) {
      .class-name, .class-desc {
        color: var(--text-hover);
      }
    }

    &.selected {
      background: rgba(201, 162, 39, 0.1);

      &:hover:not(.disabled) {
        background: rgba(201, 162, 39, 0.2);
      }
    }

    &.disabled {
      opacity: 0.5;
      background: var(--bg-subtle);
    }

    .class-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: $space-sm;
    }

    .hit-die {
      padding: 0.15rem 0.4rem;
      background: var(--bg-panel);
      border-radius: 2px;
    }

    .class-desc {
      flex: 1;
    }

    .class-meta {
      display: flex;
      gap: $space-sm;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .xp-bonus {
      padding: 0.15rem 0.4rem;
      background: rgba(34, 139, 34, 0.15);
      color: var(--green);
      border-radius: 2px;
    }

    .level-limit {
      padding: 0.15rem 0.4rem;
      background: rgba(200, 150, 50, 0.15);
      color: var(--gold-dark);
      border-radius: 2px;
    }

    .unavailable-badge {
      margin-top: 0.75rem;
      padding: 0.2rem 0.4rem;
      background: rgba(139, 37, 0, 0.1);
      border: 1px solid rgba(139, 37, 0, 0.3);
      border-radius: 2px;
      color: var(--red);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  // h4 styles for slotted content (Svelte scoping won't reach into child component)
  h4 {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: $space-xs;
  }

  .features-list {
    margin: 0;
    padding-left: 1.25rem;

    li {
      margin-bottom: $space-xs;
    }
  }

  .stat-list {
    display: flex;
    flex-direction: column;
    gap: $space-sm;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;

    &.highlight .stat-value {
      color: var(--green);
    }

    &.warning .stat-value {
      color: var(--gold-dark);
    }
  }

  // Unified Selection Section (for schools, deities, kits - outside preview panel)
  .selection-section {
    width: 100%;
    margin-top: $space-lg;
    padding: $space-lg;
    background: var(--bg-panel);
    border-radius: 6px;
    border: 1px solid var(--border-color);

    .section-header {
      text-align: center;
      margin-bottom: $space-md;

      h3 {
        margin: 0 0 $space-xs;
        color: var(--text-primary);
      }

      .section-hint {
        color: var(--text-muted);
        margin: 0;
      }
    }
  }

  .option-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: $space-md;
    margin-bottom: $space-md;

    &.deity-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));

      :global(.tooltip-wrap:has(.skip-deity)) {
        grid-column: span 4;
      }
    }
  }

  .option-card {
    @include selectable-card($lift: -2px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: $space-md;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    min-height: 100px;
    text-align: left;

    // Deity cards - centered layout
    &.deity-card {
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 80px;
    }

    &.skip-deity {
      background: var(--bg-subtle);
      border: 2px dashed var(--border-color);
      grid-column: span 4;

      &.selected {
        background: rgba(201, 162, 39, 0.1);
        border-color: var(--gold);
      }

      &:hover:not(.disabled) {
        border-style: solid;
        transform: translateY(-2px);
      }
    }

    &.skip-kit {
      background: var(--bg-subtle);
      border: 2px dashed var(--border-color);

      &.selected {
        background: rgba(201, 162, 39, 0.1);
        border-color: var(--gold);
        border-style: solid;
      }

      &:hover:not(.disabled) {
        border-style: solid;
        transform: translateY(-2px);
      }
    }

    .option-name {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 0.35rem;
      color: var(--text-primary);
    }

    .option-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.4;
      flex: 1;
    }

    .unavailable-badge {
      margin-top: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: rgba(139, 37, 0, 0.1);
      border: 1px solid rgba(139, 37, 0, 0.3);
      border-radius: 3px;
      color: var(--red);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.7rem;
      font-weight: 600;
    }

    &:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      .option-name {
        color: var(--text-hover);
      }
    }

    &.selected {
      border-color: var(--gold);
      background: rgba(201, 162, 39, 0.08);
    }

    &.disabled {
      opacity: 0.5;
      background: var(--bg-subtle);
      cursor: not-allowed;

      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }

  .kit-details {
    margin-top: $space-md;
    padding: $space-lg;
    background: var(--bg-subtle);
    border-radius: 6px;
    border: 1px solid var(--border-color);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-lg;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    h5 {
      margin: 0 0 $space-sm;
      padding-bottom: $space-xs;
      border-bottom: 1px solid var(--border-color);
      font-size: 1rem;
      color: var(--text-primary);
    }

    ul {
      margin: 0;
      padding-left: 1.25rem;
      font-size: 0.9rem;
      line-height: 1.5;

      li {
        margin-bottom: $space-sm;
        color: var(--text-secondary);

        &::marker {
          color: var(--gold-dark);
        }
      }
    }

    .kit-abilities li {
      color: var(--green);

      &::marker {
        color: var(--green);
      }
    }

    .kit-restrictions li {
      color: var(--text-muted);

      &::marker {
        color: var(--gold-dark);
      }
    }
  }
</style>
