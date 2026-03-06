<script>
  let {
    character,
    onClose,
    onComplete,
  } = $props();

  // Working copy of used spell slots (tracks how many slots are USED per level)
  let slotsUsed = $state({ ...(character.spellSlotsUsed || {}) });

  // Total slots available per level
  let totalSlots = character.spellSlots || [];

  // Ensure slotsUsed has entries for all spell levels
  $effect(() => {
    totalSlots.forEach((_, level) => {
      if (!(level in slotsUsed)) {
        slotsUsed[level] = 0;
      }
    });
  });

  // Use one slot at a specific level
  function useSlot(level) {
    const used = slotsUsed[level] || 0;
    const total = totalSlots[level] || 0;
    if (used < total) {
      slotsUsed[level] = used + 1;
    }
  }

  // Restore one slot at a specific level
  function restoreSlot(level) {
    const used = slotsUsed[level] || 0;
    if (used > 0) {
      slotsUsed[level] = used - 1;
    }
  }

  // Restore all slots at a specific level
  function restoreAllAtLevel(level) {
    slotsUsed[level] = 0;
  }

  // Mark all slots as used at a specific level
  function useAllAtLevel(level) {
    slotsUsed[level] = totalSlots[level] || 0;
  }

  // Restore all slots across all levels
  function restoreAll() {
    totalSlots.forEach((_, level) => {
      slotsUsed[level] = 0;
    });
  }

  // Mark all slots as used across all levels
  function useAll() {
    totalSlots.forEach((total, level) => {
      slotsUsed[level] = total;
    });
  }

  function save() {
    onComplete({ spellSlotsUsed: { ...slotsUsed } });
  }

  function cancel() {
    onClose(); // Close modal
  }
</script>

<div class="manage-panel">
  <h3>Spell Slot Tracking</h3>

  <p class="meta-text">
    Track which spell slots you've used in combat. This doesn't affect memorized spells.
  </p>

  <div class="spell-slot-list">
    {#each totalSlots as total, level}
      {#if total > 0}
        {@const used = slotsUsed[level] || 0}
        {@const available = total - used}
        <div class="spell-slot-row">
          <div class="slot-level">Level {level + 1}</div>
          <div class="slot-dots">
            {#each Array(total) as _, i}
              <span class="slot-dot" class:used={i < used} class:available={i >= used}>
                {i < used ? '●' : '○'}
              </span>
            {/each}
          </div>
          <div class="slot-count">
            {available}/{total} available
          </div>
          <div class="slot-actions">
            <button
              class="btn-secondary btn-sm"
              onclick={() => restoreSlot(level)}
              disabled={used === 0}
              aria-label="Restore one level {level + 1} slot"
            >
              ↶
            </button>
            <button
              class="btn-secondary btn-sm"
              onclick={() => useSlot(level)}
              disabled={used >= total}
              aria-label="Use one level {level + 1} slot"
            >
              ↷
            </button>
            <button
              class="btn-secondary btn-sm"
              onclick={() => restoreAllAtLevel(level)}
              disabled={used === 0}
            >
              Restore All
            </button>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <div class="action-bar center dotted gap-md">
    <button class="btn-secondary" onclick={restoreAll}>Restore All Slots</button>
    <button class="btn-secondary" onclick={useAll}>Mark All Used</button>
  </div>

  <div class="action-bar end gap-md">
    <button class="btn-secondary" onclick={cancel}>Cancel</button>
    <button class="btn-primary" onclick={save}>Save Changes</button>
  </div>
</div>
