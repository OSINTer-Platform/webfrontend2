<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import { page } from "$app/stores";

  import Modal from "./modal.svelte";
  import CollectionList from "$com/collections/list.svelte";
  import Search from "$com/utils/inputs/search.svelte";

  export let article: ArticleBase;
  let collectionSearch = "";

  $: userCollections = $page.data.userCollections;
</script>

<Modal
  class="
    p-6
    w-[40rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  <h1 class="font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl">
    Add to collections:
  </h1>
  <h2 class="font-light text-xs sm:text-base xl:text-lg">
    {article.title}
  </h2>

  <hr class="border-surface-400 my-4" />

  <CollectionList
    showStats={true}
    userCollections={$page.data.userCollections}
    articleId={article.id}
    containerClass="overflow-y-auto"
    {collectionSearch}
  />

  {#if Object.keys($userCollections).length > 6}
    <hr class="border-surface-400 my-4" />

    <Search
      bind:value={collectionSearch}
      placeholder={"Search in collections"}
      containerClass={""}
    />
  {/if}
</Modal>
