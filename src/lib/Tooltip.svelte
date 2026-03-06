<script>
  /**
   * Reusable tooltip wrapper
   * Usage (simple):  <Tooltip text="Hover text"><button>Hover me</button></Tooltip>
   * Usage (rich):    <Tooltip><button>Hover me</button>{#snippet tip()}Rich HTML here{/snippet}</Tooltip>
   * Warning prop:    <Tooltip text="Info" warning="Not available: STR too low">...</Tooltip>
   */
  let { text = '', warning = '', tip, children } = $props();

  let wrapperEl = $state(null);
  let tooltipEl = $state(null);
  let visible = $state(false);
  let mouseX = $state(0);
  let mouseY = $state(0);

  let hasContent = $derived(!!(text || tip || warning));

  function show() {
    if (!hasContent) return;
    visible = true;
  }

  function hide() {
    visible = false;
  }

  function trackMouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function getStyle() {
    if (!visible) return '';

    let x = mouseX - 175;
    // Keep within viewport horizontally
    x = Math.max(8, Math.min(x, window.innerWidth - 358));

    return `left: ${x}px; top: ${mouseY - 12}px;`;
  }
</script>

<span
  class="tooltip-wrap"
  role="group"
  bind:this={wrapperEl}
  onmouseenter={show}
  onmouseleave={hide}
  onmousemove={trackMouse}
>
  {@render children()}

  {#if visible && hasContent}
    <div
      class="tooltip tooltip-top"
      style={getStyle()}
      role="tooltip"
      bind:this={tooltipEl}
    >
      <div class="tooltip-arrow"></div>
      <div class="tooltip-content">
        {#if tip}
          {@render tip()}
        {:else}
          {text}
        {/if}
        {#if warning}
          <div class="tooltip-warning">{warning}</div>
        {/if}
      </div>
    </div>
  {/if}
</span>

<style lang="scss">@import './styles/widgets';</style>
