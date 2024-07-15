<script lang="ts">
  import { slide } from "svelte/transition";
  export let title: string;
  export let selected: boolean;
</script>

<button
  transition:slide={{ axis: "x" }}
  {title}
  on:click
  class="
    btn py-1 px-2
    border border-primary-500 border-r-0
    first:rounded-l-full last:rounded-r-full last:border-r
    text-sm uppercase font-bold whitespace-nowrap
    {selected ? 'bg-primary-900/50' : '!text-primary-500 bg-primary-500/10'}
  "
>
  <slot />
</button>
