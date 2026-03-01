<script>
  let {
    title,
    defaultOpen = false,
    children
  } = $props();

  let isOpen = $state(defaultOpen);

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<div class="collapsible">
  <button
    class="collapsible-header"
    onclick={toggle}
    aria-expanded={isOpen}
  >
    <span class="collapsible-title">{title}</span>
    <span class="collapsible-icon" aria-hidden="true">
      {isOpen ? '▼' : '▶'}
    </span>
  </button>

  {#if isOpen}
    <div class="collapsible-content">
      {@render children()}
    </div>
  {/if}
</div>

<style lang="scss">@import '../styles/widgets';</style>
