<script>
  /**
   * GridSection - Reusable grid section with title and optional hint
   * Reduces duplication for rendering grids of selectable items
   */
  let {
    title,
    hint = null,
    gridClass = 'grid-items',
    sectionClass = '',
    children
  } = $props();
</script>

<div class="grid-section {sectionClass}">
  {#if title}
    <h3>{title}</h3>
  {/if}
  {#if hint}
    <p class="section-hint">{hint}</p>
  {/if}
  <div class="{gridClass}">
    {@render children()}
  </div>
</div>

<style lang="scss">@import '../styles/widgets';</style>
