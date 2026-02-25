<script>
  let { label, used, total } = $props();
</script>

<div class="slot-counter">
  <span class="meta-text">{label}</span>
  <span class="slot-value text-xl" class:complete={used === total}>
    {used} / {total}
  </span>
</div>

<style lang="scss">
  @import '../styles/mixins.scss';

  .slot-counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-xs;

    .slot-value {
      &.complete {
        color: var(--green);
      }
    }
  }
</style>
