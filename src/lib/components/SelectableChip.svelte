<script>
  // Deprecated: use BtnSelect.svelte instead
  import BtnSelect from './BtnSelect.svelte';
  let { variant, children, ...rest } = $props();
</script>

<BtnSelect {...rest}>
  {#if children}
    {@render children()}
  {/if}
</BtnSelect>
