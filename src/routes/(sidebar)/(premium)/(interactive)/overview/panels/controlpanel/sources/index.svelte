<script lang="ts">
  import type { ArticleCategories } from "$shared/types/api";

  import GridSource from "./gridSource.svelte";
  import ListSource from "./listSource.svelte";

  import { controlParams } from "../../../state";
  import { onDestroy } from "svelte";

  const { selectedSources } = controlParams;

  export let articleCategories: ArticleCategories;

  let showAsGrid = true;
  let selected: string[] = [];
  let hovering: string = "";

  $: $selectedSources = hovering ? [hovering, ...selected] : selected;

  onDestroy(
    selectedSources.afterReset(() => {
      selected = [];
      hovering = "";
    })
  );
</script>

<div class="flex justify-between border-b-2 border-surface-400/50 mb-2 pb-2">
  <h3
    class="
        text-xl font-bold
        dark:text-white
        cursor-pointer
      "
  >
    Filter sources:
  </h3>

  <p class="text-xl font-light dark:text-white">
    <span
      on:click={() => (showAsGrid = true)}
      on:keydown={() => (showAsGrid = true)}
      class="
        {showAsGrid ? 'font-medium text-primary-500' : 'cursor-pointer'}
    ">Grid</span
    >
    /
    <span
      on:click={() => (showAsGrid = false)}
      on:keydown={() => (showAsGrid = false)}
      class="
      {!showAsGrid ? 'font-medium text-primary-500' : 'cursor-pointer'}
      ">List</span
    >
  </p>
</div>

{#if showAsGrid}
  <GridSource {articleCategories} bind:selected bind:hovering />
{:else}
  <ListSource {articleCategories} bind:selected bind:hovering />
{/if}
