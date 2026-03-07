<script>
  /**
   * StepModal - Reusable modal infrastructure with dual navigation modes
   *
   * @prop {string} title - Modal title
   * @prop {string} [subtitle] - Optional subtitle
   * @prop {'linear'|'menu'} mode - Navigation mode ('linear' for wizards, 'menu' for panel selection)
   * @prop {Array} steps - Step configuration objects
   * @prop {number} [initialStep=0] - Starting step index
   * @prop {boolean} isOpen - Modal visibility (bindable)
   * @prop {number} currentStepIndex - Current step index (bindable)
   * @prop {Function} [onClose] - Close callback
   * @prop {Function} [onComplete] - Completion callback
   * @prop {string} [maxWidth='520px'] - Container max-width
   * @prop {boolean} [showProgress=true] - Show step indicators
   */

  let {
    title,
    subtitle = '',
    mode = 'linear',
    steps = [],
    initialStep = 0,
    isOpen = $bindable(false),
    currentStepIndex = $bindable(0),
    onClose = () => {},
    onComplete = () => {},
    maxWidth = '520px',
    showProgress = true,
  } = $props();

  // Filter steps based on condition property
  let visibleSteps = $derived(steps.filter(step => step.condition !== false));

  // Current step object
  let currentStep = $derived(visibleSteps[currentStepIndex]);

  // Navigation functions
  function nextStep() {
    if (mode === 'linear' && currentStepIndex < visibleSteps.length - 1) {
      currentStepIndex++;
    }
  }

  function prevStep() {
    if (mode === 'linear' && currentStepIndex > 0) {
      currentStepIndex--;
    }
  }

  function goToStep(index) {
    if (index >= 0 && index < visibleSteps.length) {
      currentStepIndex = index;
    }
  }

  // Keyboard handling
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      handleClose();
    } else if (mode === 'linear') {
      if (e.key === 'ArrowRight' && currentStepIndex < visibleSteps.length - 1) {
        nextStep();
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        prevStep();
      }
    }
  }

  // Close handling with dirty state check (can be enhanced later)
  function handleClose() {
    onClose();
    isOpen = false;
  }

  // Click outside to close
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Initialize step index on mount
  $effect(() => {
    if (isOpen && currentStepIndex === undefined) {
      currentStepIndex = initialStep;
    }
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-overlay" onkeydown={handleKeydown} onclick={handleOverlayClick}>
    <div
      class="modal-container"
      class:modal-linear={mode === 'linear'}
      class:modal-menu={mode === 'menu'}
      style="--modal-max-width: {maxWidth}"
      role="dialog"
      aria-label={title}
    >
      <!-- Close button -->
      <button class="modal-close-btn" onclick={handleClose} aria-label="Close modal">
        &times;
      </button>

      <!-- Header -->
      <div class="modal-header">
        <h2>{title}</h2>
        {#if subtitle}
          <div class="modal-subtitle">{subtitle}</div>
        {/if}
      </div>

      <!-- Step content -->
      <div class="modal-step">
        {#if currentStep}
          {@const Component = currentStep.component}
          <!-- Render current step component -->
          <Component
            {...currentStep.props}
            onNext={nextStep}
            onPrev={prevStep}
            goToStep={goToStep}
            onClose={handleClose}
            {onComplete}
          />
        {/if}
      </div>

      <!-- Progress indicators -->
      {#if showProgress && visibleSteps.length > 1 && mode === 'linear'}
        <!-- Dots for linear wizard mode -->
        <div class="step-dots">
          {#each visibleSteps as step, i}
            <div
              class="dot"
              class:active={i === currentStepIndex}
              class:completed={i < currentStepIndex}
              role="button"
              tabindex="0"
              aria-label="Step {i + 1}"
            ></div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}