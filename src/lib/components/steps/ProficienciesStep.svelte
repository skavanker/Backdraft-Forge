<script>
  let {
    gainsWeaponProf,
    gainsNonWeaponProf,
    onNext,
    onPrev,
  } = $props();
</script>

<div class="levelup-step">
  <h3>New Proficiency Slots</h3>
  <div class="flex-column gap-sm">
    {#if gainsWeaponProf}
      <div class="prof-gain">+1 Weapon Proficiency Slot</div>
    {/if}
    {#if gainsNonWeaponProf}
      <div class="prof-gain">+1 Non-Weapon Proficiency Slot</div>
    {/if}
  </div>
  <p class="meta-text">Go to the Proficiencies tab after leveling up to pick your new proficiencies.</p>

  <div class="step-nav">
    <button class="btn-secondary" onclick={onPrev}>Back</button>
    <button class="btn-primary" onclick={onNext}>Continue</button>
  </div>
</div>
