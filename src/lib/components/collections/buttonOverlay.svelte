<script lang="ts">
  import CollectionButton from "./button.svelte";
  import { page } from "$app/stores";
  import type { ArticleBase } from "$shared/types/api";

  $: userCollections = $page.data.userCollections;
  export let article: ArticleBase;

  export let overlayClass: string = "top-10";
  export let btnClass: string = "pb-2";
  export let iconClass: string = "text-4xl";
</script>

{#if Object.values($userCollections).length > 0}
  <div
    class="
    flex justify-center items-center
    h-full w-full
    bg-black/75 opacity-0
    rounded-md

    transition-opacity

    [&:focus-within>button>svg]:text-primary-500
  "
  >
    <CollectionButton
      {userCollections}
      {article}
      {overlayClass}
      {btnClass}
      {iconClass}
    />
  </div>
{/if}
