<script>
  let {
    newTHAC0,
    oldTHAC0,
    newAttacks,
    oldAttacks,
    savesImproved,
    newSaves,
    oldSaves,
    newFeatures = [],
    onNext,
    onPrev
  } = $props();
</script>

<div class="levelup-step">
  <h3>Updated Stats & Features</h3>

  <div class="features-list">
    {#if newTHAC0 < oldTHAC0}
      <div class="feature-item">
        <span class="feature-label">THAC0</span>
        <span class="feature-change">{oldTHAC0} → {newTHAC0}</span>
      </div>
    {/if}

    {#if savesImproved}
      <div class="feature-item">
        <span class="feature-label">Saving Throws</span>
        <div class="save-details">
          {#each Object.entries(newSaves) as [key, val]}
            {#if val < oldSaves[key]}
              <span class="save-improved">{key}: {oldSaves[key]} → {val}</span>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    {#if newAttacks !== oldAttacks}
      <div class="feature-item">
        <span class="feature-label">Attacks/Round</span>
        <span class="feature-change">{oldAttacks} → {newAttacks}</span>
      </div>
    {/if}

    {#each newFeatures as feature}
      <div class="feature-item new-ability">
        <span>◆ {feature}</span>
      </div>
    {/each}
  </div>

  <div class="step-nav">
    <button class="btn-secondary" onclick={onPrev}>Back</button>
    <button class="btn-primary" onclick={onNext}>Continue</button>
  </div>
</div>
