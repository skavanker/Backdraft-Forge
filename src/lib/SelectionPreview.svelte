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
  @import './SelectionPreview.module.scss';

</style>

