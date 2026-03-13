<script>
  /**
   * Generic stat block card — shared skeleton for NPCStatBlock and MonsterStatBlock.
   *
   * Props:
   *   panel      — panel CSS class ('panel', 'panel-secondary', etc.)
   *   extraClass — additional classes on the root element (e.g. 'monster-stat-block')
   *   name       — h4 heading
   *   badges     — [{ label, cls }] shown next to name
   *   subtitle   — small text below name (optional)
   *   stats      — [{ label, value }] for the combat stats row
   *   children   — snippet: body content
   *   actions    — snippet: buttons in the action bar (omit to hide bar)
   */
  let {
    panel      = 'panel',
    extraClass = '',
    name,
    badges     = [],
    subtitle   = '',
    stats      = [],
    children,
    actions,
  } = $props();
</script>

<div class="stat-block {panel} flex-column gap-sm {extraClass}">
  <header class="stat-block-header">
    <div class="stat-block-title">
      <h4>{name}</h4>
      {#each badges as b}
        <span class="badge {b.cls}">{b.label}</span>
      {/each}
    </div>
    {#if subtitle}
      <p class="stat-block-subtitle">{subtitle}</p>
    {/if}
  </header>

  {#if stats.length}
    <div class="stat-block-combat">
      {#each stats as s}
        <div class="stat">
          <span class="label">{s.label}</span>
          <span class="value">{s.value}</span>
        </div>
      {/each}
    </div>
  {/if}

  {@render children?.()}

  {#if actions}
    <div class="action-bar end">
      {@render actions()}
    </div>
  {/if}
</div>
