<script>
  let { title, confirmLabel, onConfirm, disabled = false, children } = $props();
</script>

<div class="selection-preview">
  <div class="divider"><span class="ornament">◆</span></div>

  <h3>{title}</h3>

  <div class="preview-content">
    {@render children()}
  </div>

  <button class="btn-primary" onclick={onConfirm} {disabled}>
    {confirmLabel}
  </button>
</div>

<style lang="scss">
  .selection-preview {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h3 {
      text-align: center;
      margin: 0;
      font-size: 1.5rem;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border-strong), transparent);
      }

      .ornament {
        color: var(--gold-dark);
      }
    }
  }

  .preview-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .btn-primary {
    align-self: center;
  }
</style>
