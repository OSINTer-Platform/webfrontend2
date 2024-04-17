<script lang="ts">
  export let primary: boolean;
  export let disabled: boolean = false;
  let classes = "";
  export { classes as class };
</script>

<button
  on:click
  class:primary
  class:secondary={!primary}
  {disabled}
  class={classes}
>
  <slot />
</button>

<style lang="postcss">
  button {
    @apply w-24 first:last:w-40 h-10
    border first:rounded-l-md last:rounded-r-md;

    &:not(:disabled) {
      @apply transition-all duration-300 active:scale-95;
    }

    &.primary:not(:disabled) {
      @apply border-primary-500 bg-primary-500/20 hover:bg-primary-500/40;
    }

    &.secondary:not(:disabled) {
      @apply border-surface-400 hover:bg-surface-400/10;
    }

    &:disabled {
      @apply border-surface-400 opacity-50 cursor-not-allowed;
    }
  }
</style>
