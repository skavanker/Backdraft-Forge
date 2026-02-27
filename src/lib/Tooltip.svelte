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

    const target = wrapperEl.firstElementChild || wrapperEl;
    const rect = target.getBoundingClientRect();

    // Center the tooltip: left position is center of button minus half tooltip width
    // Use 350px as approximate tooltip width (300-400px range)
    let x = rect.left + rect.width / 2 - 175;
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

<style lang="scss">@import './styles/widgets';</style>
