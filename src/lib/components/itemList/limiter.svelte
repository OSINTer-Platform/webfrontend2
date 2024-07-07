<script lang="ts" generics="ListEl">
  import { SvelteComponent, onDestroy, type ComponentType } from "svelte";
  import { listElementCount } from "$shared/state/state";

  import Loader from "./loader.svelte";
  import Wrapper from "./wrapper.svelte";

  export let list: ListEl[];
  export let listLenLimit = 100;
  export let emptyMessage: { title: string; description: string } | null = null;
  export let containerClass: string = "";
  export let ListWrapper: ComponentType<SvelteComponent> | null = null;
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

<Wrapper empty={list.length < 1} {emptyMessage} class={containerClass}>
  <slot name="top" />

  {#if ListWrapper}
    <ListWrapper>
      {#each limitedList as listElement}
        <slot {listElement} />
      {/each}
      {#if showLoader}
        <Loader bind:chunksVisible />
      {/if}
    </ListWrapper>
  {:else}
    {#each limitedList as listElement}
      <slot {listElement} />
    {/each}
    {#if showLoader}
      <Loader bind:chunksVisible />
    {/if}
  {/if}
  <slot name="bottom" />
</Wrapper>
