<script>
  // Character creation steps
  const steps = [
    'Roll Abilities',
    'Choose Race',
    'Choose Class',
    'Review Stats',
    'Proficiencies',
    'Equipment',
    'Spells',
    'Backstory',
    'Character Sheet'
  ];

  let currentStep = 0;
</script>

<main>
  <h1>Backdraft Forge</h1>
  <p class="subtitle">AD&D 2nd Edition Character Creator</p>

  <nav class="steps">
    {#each steps as step, i}
      <span class="step" class:active={i === currentStep} class:completed={i < currentStep}>
        {i + 1}. {step}
      </span>
    {/each}
  </nav>

  <section class="content">
    {#if currentStep === 0}
      <h2>Roll Your Abilities</h2>
      <p>Coming soon: 3d6 or 4d6 drop lowest</p>
    {/if}
  </section>
</main>

<style lang="scss">
  .subtitle {
    text-align: center;
    font-style: italic;
    margin-top: -0.5rem;
    margin-bottom: 2rem;
  }

  .steps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  .step {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    opacity: 0.5;

    &.active {
      opacity: 1;
      font-weight: bold;
      background: rgba(201, 162, 39, 0.3);
    }

    &.completed {
      opacity: 0.7;
      text-decoration: line-through;
    }
  }

  .content {
    background: rgba(255, 255, 255, 0.3);
    padding: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>
