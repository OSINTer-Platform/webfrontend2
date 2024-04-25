<script lang="ts">
  export let selected = false;
</script>

<button
  on:click
  class="
  py-2 px-3 sm:py-2 sm:px-5 md:py-3 md:px-6
  min-w-max
  font-sm sm:font-base md:font-lg
  border border-primary-500 btn
  {selected
    ? 'bg-primary-500/50 hover:bg-primary-500/40 dark:bg-primary-800 dark:hover:bg-primary-800/75'
    : ' bg-primary-500/10'}
"
>
  <slot />
</button>
