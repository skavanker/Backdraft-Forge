<script>
  /**
   * EditableInput - Inline editable input component
   * Click to edit, Enter/blur to save, Escape to cancel
   */
  import { untrack } from 'svelte';

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
    title = '',
    ariaLabel = ''
  } = $props();

  let editing = $state(false);
  let inputValue = $state(untrack(() => String(value)));
  let inputElement = $state(null);

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
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
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
      aria-label={ariaLabel || title || undefined}
    >
      {displayFormat(value)}{#if suffix} {suffix}{/if}
    </button>
  {/if}
</div>

