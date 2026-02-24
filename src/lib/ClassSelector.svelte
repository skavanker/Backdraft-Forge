<script>
  import { getAvailableClasses, getAvailableSchools } from '../data/classes.js';
  import { onMount } from 'svelte';
  import Tooltip from './Tooltip.svelte';
  import SelectionPreview from './SelectionPreview.svelte';

  let { abilities, race, raceKey, existingClassKey = null, existingWizardSchool = null, onComplete } = $props();

  let selectedClassKey = $state(existingClassKey);
  let selectedSchool = $state(existingWizardSchool);

  let classOptions = $derived(getAvailableClasses(abilities, race, raceKey));
  let qualifiedCount = $derived(classOptions.filter(c => c.qualified).length);

  let selectedClass = $derived(
    selectedClassKey ? classOptions.find(c => c.key === selectedClassKey) : null
  );

  let availableSchools = $derived(
    selectedClassKey === 'specialist' && abilities ? getAvailableSchools(abilities, raceKey) : []
  );

  let canConfirm = $derived(
    selectedClass && (selectedClassKey !== 'specialist' || selectedSchool)
  );

  function selectClass(key) {
    selectedClassKey = key;
    selectedSchool = null;
  }

  function confirm() {
    if (!canConfirm) return;
    onComplete({
      classKey: selectedClassKey,
      cls: selectedClass.cls,
      levelLimit: selectedClass.levelLimit,
      xpBonus: selectedClass.xpBonus,
      wizardSchool: selectedSchool
    });
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

  {#if selectedClass}
    {@const confirmText = selectedClassKey === 'specialist' && !selectedSchool
      ? 'Select a School to Continue'
      : `Confirm ${selectedSchool?.name ?? selectedClass.cls.name} → Review Stats`}
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

      {#if selectedClassKey === 'specialist'}
        <div class="school-selection">
          <h4>Choose Your School of Magic</h4>
          <div class="school-grid">
            {#each availableSchools as school}
              {@const tooltipText = !school.qualified ? school.failedReqs.join(', ') : `Opposition: ${school.oppositionSchools.join(', ')}`}
              <Tooltip text={tooltipText} position="bottom">
                <button
                  class="school-card"
                  class:selected={selectedSchool?.key === school.key}
                  class:disabled={!school.qualified}
                  onclick={() => school.qualified && (selectedSchool = { key: school.key, ...school })}
                  disabled={!school.qualified}
                >
                  <span class="school-name">{school.name}</span>
                  <span class="school-desc">{school.school}</span>
                </button>
              </Tooltip>
            {/each}
          </div>
        </div>
      {/if}
    </SelectionPreview>
  {/if}
</div>

<style lang="scss">
  .class-selector {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .intro {
    text-align: center;
    color: var(--text-body);
    margin: 0;
  }

  .class-group {
    .group-title {
      font-size: 1rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 0.75rem;
      padding-bottom: 0.25rem;
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
    padding: 1rem;
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
      margin-bottom: 0.5rem;
    }

    .class-name {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-primary);
    }

    .hit-die {
      font-size: 0.8rem;
      padding: 0.15rem 0.4rem;
      background: var(--bg-panel);
      border-radius: 2px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .class-desc {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-muted);
      flex: 1;
    }

    .class-meta {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }

    .xp-bonus {
      padding: 0.15rem 0.4rem;
      background: rgba(34, 139, 34, 0.15);
      color: var(--green);
      border-radius: 2px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .level-limit {
      padding: 0.15rem 0.4rem;
      background: rgba(200, 150, 50, 0.15);
      color: var(--gold-dark);
      border-radius: 2px;
      font-size: 0.75rem;
    }

    .unavailable-badge {
      margin-top: 0.75rem;
      padding: 0.2rem 0.4rem;
      background: rgba(139, 37, 0, 0.1);
      border: 1px solid rgba(139, 37, 0, 0.3);
      border-radius: 2px;
      font-size: 0.7rem;
      color: var(--red);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  // h4 styles for slotted content (Svelte scoping won't reach into child component)
  h4 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: var(--text-body);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.25rem;
  }

  .features-list {
    margin: 0;
    padding-left: 1.25rem;
    font-size: 0.875rem;
    color: var(--text-body);

    li {
      margin-bottom: 0.25rem;
    }
  }

  .stat-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;

    .stat-label {
      color: var(--text-muted);
    }

    .stat-value {
      font-weight: 600;
      color: var(--text-primary);
    }

    &.highlight .stat-value {
      color: var(--green);
    }

    &.warning .stat-value {
      color: var(--gold-dark);
    }
  }

  .school-selection {
    width: 100%;

    h4 {
      text-align: center;
      margin: 0 0 1rem;
      font-size: 1.1rem;
      color: var(--text-body);
    }
  }

  .school-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;

    :global(.tooltip-wrap) {
      display: flex;
    }
  }

  .school-card {
    @include selectable-card($lift: -1px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    transition: all 0.15s;
    width: 100%;
    min-height: 60px;

    .school-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .school-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-align: center;
    }

    &:hover:not(.disabled) {
      .spec-name, .spec-desc {
        color: var(--text-hover);
      }
    }
  }
</style>
