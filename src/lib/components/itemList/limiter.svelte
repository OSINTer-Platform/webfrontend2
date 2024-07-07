<script lang="ts" generics="ListEl">
  import { onDestroy } from "svelte";
  import { listElementCount } from "$shared/state/state";

  import Loader from "./loader.svelte";

  export let list: ListEl[];
  export let listLenLimit = 100;
  export let updateCount = true;

  let chunksVisible = 1;

  $: limitedList =
    listLenLimit > 0 ? list.slice(0, listLenLimit * chunksVisible) : list;

  $: showLoader = limitedList.length < list.length;

  $: {
    if (updateCount) listElementCount.set(list.length);
  }

  onDestroy(() => {
    if (updateCount) listElementCount.set(0);
  });
</script>

{#each limitedList as listElement}
  <slot {listElement} />
{/each}
{#if showLoader}
  <Loader bind:chunksVisible />
{/if}
