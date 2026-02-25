<script>
  /**
   * Reusable tooltip wrapper
   * Usage: <Tooltip text="Hover text"><button>Hover me</button></Tooltip>
   */
  let { text = '', position = 'bottom', children } = $props();

  let wrapperEl = $state(null);
  let tooltipEl = $state(null);
  let visible = $state(false);

  function show() {
    if (!text) return;
    visible = true;
  }

  function hide() {
    visible = false;
  }

  function getStyle() {
    if (!wrapperEl || !visible) return '';

    // Get the first actual element child for positioning
    const target = wrapperEl.firstElementChild || wrapperEl;
    const rect = target.getBoundingClientRect();

    let x = rect.left + rect.width / 2;
    let y = position === 'top' ? rect.top - 8 : rect.bottom + 8;

    return `left: ${x}px; top: ${y}px;`;
  }
</script>

<span
  class="tooltip-wrap"
  role="group"
  bind:this={wrapperEl}
  onmouseenter={show}
  onmouseleave={hide}
>
  {@render children()}

  {#if visible && text}
    <span
      class="tooltip tooltip-{position}"
      style={getStyle()}
      role="tooltip"
      bind:this={tooltipEl}
    >
      {text}
    </span>
  {/if}
</span>

<style lang="scss">
  @import '../styles/mixins.scss';

  .tooltip-wrap {
    display: inline-block;
  }

  .tooltip {
    position: fixed;
    z-index: 1000;
    padding: $space-sm $space-md;
    background: var(--text-primary);
    color: var(--bg-base);
    border-radius: 4px;
    max-width: 280px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    white-space: normal;
    animation: fadeIn 0.1s ease forwards;
  }

  .tooltip-top {
    transform: translateX(-50%) translateY(-100%);
  }

  .tooltip-bottom {
    transform: translateX(-50%);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
