<script>
  /**
   * BtnSelect - Unified selectable button component
   * Single look for all selection contexts: race/class/proficiency/spell/equipment/generators
   */
  let {
    label,
    selected = false,
    disabled = false,
    locked = false,
    auto = false,
    metadata = null,
    cost = null,
    lenient = false,
    class: classNames = '',
    onclick = null,
    oncontextmenu = null,
    children
  } = $props();

  function handleClick() {
    if (!disabled && !locked && !auto && onclick) {
      onclick();
    }
  }

  function handleContext(e) {
    if (oncontextmenu && !disabled && !locked && !auto) {
      e.preventDefault();
      oncontextmenu();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Backspace' && selected && oncontextmenu && !disabled && !locked && !auto) {
      e.preventDefault();
      oncontextmenu();
    }
  }
</script>

<button
  class="btn-select {classNames}"
  class:selected
  class:disabled
  class:locked
  class:auto
  class:lenient-warning={lenient}
  disabled={disabled || locked || auto}
  aria-pressed={selected}
  onclick={handleClick}
  oncontextmenu={handleContext}
  onkeydown={handleKeydown}
>
  {#if children}
    {@render children()}
  {:else}
    <span>{label}</span>
    {#if metadata}
      <p>{metadata}</p>
    {/if}
    {#if cost !== null && cost > 1}
      <span class="select-cost">{cost}</span>
    {/if}
  {/if}
  {#if locked}
    <span class="select-lock" aria-hidden="true">🔒</span>
  {/if}
</button>
