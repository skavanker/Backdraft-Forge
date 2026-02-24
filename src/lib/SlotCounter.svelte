<script>
  let { label, used, total } = $props();
</script>

<div class="slot-counter">
  <span class="slot-label">{label}</span>
  <span class="slot-value" class:complete={used === total}>
    {used} / {total}
  </span>
</div>

<style lang="scss">
  .slot-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    .slot-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .slot-value {
      font-family: 'Cinzel', serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);

      &.complete {
        color: #228b22;
      }
    }
  }
</style>
