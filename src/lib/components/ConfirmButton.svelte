<script>
  let { label = 'Clear', onconfirm } = $props();
  let confirming = $state(false);
</script>

{#if confirming}
  <span class="text-muted confirm-prompt">Sure?</span>
  <button class="btn-danger btn-sm" onclick={() => { confirming = false; onconfirm(); }}>Yes</button>
  <button class="btn-secondary btn-sm" onclick={() => confirming = false}>No</button>
{:else}
  <button class="btn-danger btn-sm" onclick={() => confirming = true}>{label}</button>
{/if}
