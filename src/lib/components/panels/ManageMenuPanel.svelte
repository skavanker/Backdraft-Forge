<script>
  let {
    steps,
    goToStep,
  } = $props();

  // Filter out the menu panel itself (index 0)
  let actionPanels = $derived(steps.filter((_, i) => i > 0));
</script>

<div class="panel-menu-grid">
  {#each actionPanels as panel, i}
    <button
      class="panel-card"
      onclick={() => goToStep(i + 1)}
      aria-label="Open {panel.label} panel"
    >
      {#if panel.icon}
        <span class="panel-icon">{panel.icon}</span>
      {/if}
      <span class="panel-label">{panel.label}</span>
      {#if panel.description}
        <span class="panel-description">{panel.description}</span>
      {/if}
    </button>
  {/each}
</div>
