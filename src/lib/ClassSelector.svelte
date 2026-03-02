<script>
  import { getAvailableClasses, getAvailableSchools } from '../data/classes.js';
  import { deities, getDeityList } from '../data/deities.js';
  import { getAvailableKits, classHasKits } from '../data/kits.js';
  import { getSpeciesEnemyList } from '../data/speciesEnemies.js';
  import { ALIGNMENTS, getAlignmentName, filterDeitiesForClass } from '../data/alignment.js';
  import Tooltip from './Tooltip.svelte';
  import SelectionPreview from './SelectionPreview.svelte';
  import { isTyping, useGlobalKeydown } from './utils/keyboard.js';
  import { settings } from './settings.svelte.js';

  let { abilities, race, raceKey, existingClassKey = null, existingWizardSchool = null, existingDeityKey = null, existingKitKey = null, existingSpeciesEnemy = null, onComplete } = $props();

  let selectedClassKey = $state(existingClassKey);
  let selectedSchool = $state(existingWizardSchool);
  let selectedDeityKey = $state(existingDeityKey ?? null); // null = skipped deity (default), string = deity key
  let selectedKit = $state(existingKitKey ?? null); // null = skipped kit (default), string = kit key
  let selectedSpeciesEnemy = $state(existingSpeciesEnemy ?? null);

  let classOptions = $derived(getAvailableClasses(abilities, race, raceKey, { lenient: settings.lenientMode }));
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

  let isRanger = $derived(selectedClassKey === 'ranger');

  let speciesEnemyList = $derived(isRanger ? getSpeciesEnemyList() : []);

  let needsDeity = $derived(
    selectedClassKey === 'cleric' || selectedClassKey === 'paladin'
  );

  let deityList = $derived(
    filterDeitiesForClass(getDeityList(), selectedClassKey)
  );

  let canConfirm = $derived(
    selectedClass &&
    (selectedClassKey !== 'specialist' || selectedSchool) &&
    (!isRanger || selectedSpeciesEnemy)
    // Deity and kit are auto-defaulted to "skipped" (null) so always valid
  );

  function selectClass(key) {
    selectedClassKey = key;
    selectedSchool = null;
    selectedKit = null; // Default to skipped
    selectedDeityKey = null; // Default to skipped
    selectedSpeciesEnemy = null;
  }

  function confirm() {
    if (!canConfirm) return;
    completeClassSelection();
  }

  function completeClassSelection() {
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
      kit: kitData,
      speciesEnemy: selectedSpeciesEnemy || null
    };

    // AD&D 2E Rule: Paladins must be Lawful Good (unless house rules enabled)
    // PHB p.27: "Paladins must be lawful good"
    // This enforces the alignment restriction after class selection
    if (selectedClassKey === 'paladin' && !settings.lenientMode) {
      result.alignment = ALIGNMENTS.LG;
    }

    onComplete(result);
  }

  useGlobalKeydown((e) => {
    if (isTyping() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Enter' && canConfirm) {
      e.preventDefault();
      confirm();
    }
  });

  // Group classes by type
  let groupedClasses = $derived.by(() => {
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

<div class="flex-column gap-lg">
  <p class="intro">
    As a <strong>{race.name}</strong>, you qualify for <strong>{qualifiedCount}</strong> of {classOptions.length} classes.
  </p>

  {#each Object.entries(groupedClasses) as [groupKey, group]}
    {#if group.classes.length > 0}
      <div class="class-group">
        <h3 class="section-title">{group.name}</h3>
        <div class="selection-grid">
          {#each group.classes as { key, cls, qualified, failedReqs, levelLimit, xpBonus }}
            {@const hasWarnings = qualified && failedReqs.length > 0}
            {@const tooltipText = !qualified ? `Not available: ${failedReqs.join(', ')}` : hasWarnings ? `House Rules: ${failedReqs.join(', ')}` : ''}
            <Tooltip text={tooltipText} position="bottom">
              <button
                class="selection-card class-card"
                class:selected={selectedClassKey === key}
                class:disabled={!qualified}
                class:lenient-warning={hasWarnings}
                onclick={() => qualified && selectClass(key)}
                disabled={!qualified}
              >
                <img src="/icons/{key}.svg" alt="" class="class-icon" />
                <div class="card-header">
                  <h4 class="card-name">{cls.name}</h4>
                  <span class="badge-small">{cls.hitDie}</span>
                </div>
                <p class="card-desc">{cls.description}</p>

                {#if qualified}
                  <div class="card-meta">
                    {#if xpBonus > 0}
                      <span class="xp-bonus">+{xpBonus}% XP</span>
                    {/if}
                    {#if levelLimit !== null}
                      <span class="level-limit">Max level {levelLimit}</span>
                    {/if}
                  </div>
                {:else}
                  <div class="card-meta">
                    {#each failedReqs as req}
                      <span class="req-badge">{req}</span>
                    {/each}
                  </div>
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
    <div class="selection-section panel panel-lg">
      <div class="section-header">
        <h3>Choose Your School of Magic</h3>
        <p class="section-hint">Specialist wizards gain bonus spells but cannot cast from opposition schools.</p>
      </div>

      <div class="selection-grid">
        {#each availableSchools as school}
          {@const tooltipText = !school.qualified ? school.failedReqs.join(', ') : `Opposition: ${school.oppositionSchools.join(', ')}`}
          <Tooltip text={tooltipText} position="bottom">
            <button
              class="selection-card"
              class:selected={selectedSchool?.key === school.key}
              class:disabled={!school.qualified}
              onclick={() => school.qualified && (selectedSchool = { key: school.key, ...school })}
              disabled={!school.qualified}
            >
              <span class="card-name">{school.name}</span>
              <span class="card-desc">{school.school}</span>
              {#if !school.qualified}
                <div class="card-meta">
                  {#each school.failedReqs as req}
                    <span class="req-badge">{req}</span>
                  {/each}
                </div>
              {/if}
            </button>
          </Tooltip>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Kit Selection (appears underneath class grid) -->
  {#if selectedClass && hasKits && selectedClassKey !== 'specialist'}
    <div class="selection-section panel panel-lg">
      <div class="section-header">
        <h3>Choose a Kit (Optional)</h3>
        <p class="section-hint">Kits modify your class with special abilities and restrictions. You can play without a kit.</p>
      </div>

      <div class="selection-grid">
        <Tooltip text="Play as a standard {selectedClass.cls.name} without kit modifications" position="bottom">
          <button
            class="selection-card skip-kit"
            class:selected={selectedKit === null}
            onclick={() => selectedKit = null}
          >
            <span class="card-name">Skip Kit</span>
            <span class="card-desc">Play Vanilla {selectedClass.cls.name}</span>
          </button>
        </Tooltip>

        {#each availableKits as kit}
          {@const tooltipText = !kit.qualified
            ? `Not available: ${kit.failedReqs.join(', ')}`
            : `${kit.description}\n\nAbilities: ${kit.specialAbilities.join(' • ')}`}
          <Tooltip text={tooltipText} position="bottom">
            <button
              class="selection-card"
              class:selected={selectedKit?.key === kit.key}
              class:disabled={!kit.qualified}
              onclick={() => kit.qualified && (selectedKit = kit)}
              disabled={!kit.qualified}
            >
              <span class="card-name">{kit.name}</span>
              <span class="card-desc">{kit.description}</span>
              {#if !kit.qualified}
                <div class="card-meta">
                  {#each kit.failedReqs as req}
                    <span class="req-badge">{req}</span>
                  {/each}
                </div>
              {/if}
            </button>
          </Tooltip>
        {/each}
      </div>

      {#if selectedKit && selectedKit !== null}
        <div class="kit-details panel-subtle panel-lg fade-in">
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

  <!-- Species Enemy (for Rangers) -->
  {#if selectedClass && isRanger}
    <div class="selection-section panel panel-lg">
      <div class="section-header">
        <h3>Choose Your Species Enemy</h3>
        <p class="section-hint">Rangers gain +4 to hit against their chosen enemy but suffer -4 reaction from that species.</p>
      </div>

      <div class="selection-grid">
        {#each speciesEnemyList as enemy}
          <Tooltip text="{enemy.description} — e.g. {enemy.examples}" position="bottom">
            <button
              class="selection-card"
              class:selected={selectedSpeciesEnemy === enemy.key}
              onclick={() => selectedSpeciesEnemy = enemy.key}
            >
              <span class="card-name">{enemy.name}</span>
              <span class="card-desc">{enemy.description}</span>
            </button>
          </Tooltip>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Deity Selection (for Clerics/Paladins) - after kit selection -->
  {#if selectedClass && needsDeity}
    <div class="selection-section panel panel-lg">
      <div class="section-header">
        <h3>Choose Your Deity (Optional)</h3>
        <p class="section-hint">Your deity determines which spell spheres you can access. Skip for standard cleric access.</p>
      </div>

      <div class="selection-grid deity-grid">
        <Tooltip text="Standard cleric with access to all common spell spheres" position="bottom">
          <button
            class="selection-card deity-card skip-deity"
            class:selected={selectedDeityKey === null}
            onclick={() => selectedDeityKey = null}
          >
            <span class="card-name">Skip Deity</span>
            <span class="card-desc">Standard Cleric</span>
          </button>
        </Tooltip>

        {#each deityList as deity}
          <Tooltip text={deity.description} position="bottom">
            <button
              class="selection-card deity-card"
              class:selected={selectedDeityKey === deity.key}
              onclick={() => selectedDeityKey = deity.key}
            >
              <span class="card-name">{deity.name}</span>
              <span class="card-desc">{getAlignmentName(deity.alignment)}</span>
            </button>
          </Tooltip>
        {/each}
      </div>
    </div>
  {/if}

  {#if selectedClass}
    {@const confirmText =
      selectedClassKey === 'specialist' && !selectedSchool ? 'Select a School to Continue' :
      isRanger && !selectedSpeciesEnemy ? 'Select a Species Enemy to Continue' :
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
        <div class="flex-column gap-sm">
          <div class="data-row">
            <span class="stat-label">Hit Points</span>
            <span class="stat-value">{selectedClass.cls.hitDie}</span>
          </div>
          <div class="data-row">
            <span class="stat-label">Key Ability</span>
            <span class="stat-value">{selectedClass.cls.primeRequisite.join(', ')}</span>
          </div>
          {#if selectedClass.xpBonus > 0}
            <div class="data-row highlight">
              <span class="stat-label">XP Bonus</span>
              <span class="stat-value">+{selectedClass.xpBonus}%</span>
            </div>
          {/if}
          {#if selectedClass.levelLimit !== null}
            <div class="data-row warning">
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
  @import './styles/shared';
  @import './styles/selectors';
  .deity-grid > :global(:first-child) { grid-column: 1 / -1; }
</style>

