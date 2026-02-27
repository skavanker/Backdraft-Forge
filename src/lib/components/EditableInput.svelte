<script>
  /**
   * EditableInput - Inline editable input component
   * Click to edit, Enter/blur to save, Escape to cancel
   */
  let {
    value = 0,
    type = 'number',
    label = '',
    displayFormat = (v) => v.toLocaleString(),
    parseValue = (v) => type === 'number' ? parseFloat(v) : v,
    validate = () => true,
    min = null,
    max = null,
    step = null,
    suffix = '',
    className = '',
    buttonClass = '',
    inputClass = '',
    onUpdate = null,
    title = ''
  } = $props();

  let editing = $state(false);
  let inputValue = $state(String(value));
  let inputElement;

  // Sync inputValue when external value changes
  $effect(() => {
    if (!editing) {
      inputValue = String(value);
    }
  });

  function startEdit() {
    inputValue = String(value);
    editing = true;
    // Focus input after DOM update
    setTimeout(() => inputElement?.focus(), 0);
  }

  function handleSave() {
    const parsed = parseValue(inputValue);

    if (!validate(parsed)) {
      editing = false;
      return;
    }

    // Apply min/max constraints for numbers
    let finalValue = parsed;
    if (type === 'number') {
      if (min !== null && parsed < min) finalValue = min;
      if (max !== null && parsed > max) finalValue = max;
    }

    if (finalValue !== value && onUpdate) {
      onUpdate(finalValue);
    }

    editing = false;
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      editing = false;
    }
  }
</script>

<div class="editable-input {className}">
  {#if label}
    <span class="input-label">{label}:</span>
  {/if}

  {#if editing}
    <input
      bind:this={inputElement}
      bind:value={inputValue}
      {type}
      {min}
      {max}
      {step}
      class="inline-input {inputClass}"
      onkeydown={handleKeydown}
      onblur={handleSave}
    />
    {#if suffix}
      <span class="suffix">{suffix}</span>
    {/if}
  {:else}
    <button
      class="display-button {buttonClass}"
      onclick={startEdit}
      {title}
    >
      {displayFormat(value)}{#if suffix} {suffix}{/if}
    </button>
  {/if}
</div>

<style lang="scss">@import '../styles/sheet';</style>
