<script>
  let { toast = null, children } = $props();
</script>

<div class="generator-page">
  {#if toast?.visible}
    <div class="save-toast alert alert-info">{toast.message}</div>
  {/if}

  {@render children()}
</div>
