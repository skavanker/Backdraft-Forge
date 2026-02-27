<script>
  let { label, used, total } = $props();
</script>

<div class="slot-counter">
  <span class="meta-text">{label}</span>
  <span class="slot-value text-xl" class:complete={used === total}>
    {used} / {total}
  </span>
</div>

<style lang="scss">@import './styles/widgets';</style>
