<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import Search from "$com/utils/search.svelte";
  import Switch from "$com/utils/switch.svelte";

  import { searchInArticle } from "$lib/common/filter";
  import { onDestroy } from "svelte";
  import { selectedArticles, controlParams } from "./state";
  import { derived, type Readable } from "svelte/store";
  import type { MLArticle } from "$shared/types/api";
  import { page } from "$app/stores";
  import type { Updatable } from "$lib/common/customStores";
  import type { Collection } from "$shared/types/userItems";

  const { deepSearch, selectedSearch, showAllSelected } = controlParams;

  onDestroy(
    selectedArticles.subscribe((articleList) => {
      if (articleList.length == 0) selectedSearch.set("");
    })
  );

  const searchedSelectedArticles: Readable<MLArticle[]> = derived(
    [selectedSearch, deepSearch, selectedArticles],
    ([$selectedSearch, $deepSearch, $selectedArticles]) => {
      if ($selectedSearch.length === 0) return $selectedArticles;
      const filteredArticles: MLArticle[] = [];

      $selectedArticles.forEach((article) => {
        if (searchInArticle(article, $selectedSearch, $deepSearch)) {
          filteredArticles.push(article);
        }
      });

      return filteredArticles;
    }
  );

  let alreadyRead: Updatable<null | Collection>;
  $: alreadyRead = $page.data?.alreadyRead;
</script>

{#if $selectedArticles.length > 0}
  <aside
    class="
    absolute z-20
    top-10 right-10 bottom-10

    flex flex-col
    w-96 p-4

    border-surface-400 border
    bg-surface-500/30
  "
  >
    <div class="flex justify-between items-end mb-4">
      <h1
        class="
        dark:text-white text-3xl font-bold
      "
      >
        Selected:
      </h1>
      <p
        class="
          dark:text-white
          font-light text-2xl italic
        "
      >
        {$selectedArticles.length} articles
      </p>
    </div>

    <Search
      placeholder={"Search in articles"}
      bind:value={$selectedSearch}
      containerClass={"mb-2"}
    >
      <Switch
        bind:checked={$showAllSelected}
        size={"sm"}
        containerClass={"mr-2"}
        title={"Show all selected articles"}
      />
    </Search>

    <ul class="overflow-auto">
      {#each $showAllSelected ? $searchedSelectedArticles : $searchedSelectedArticles.slice(0, 500) as article (article.id)}
        <li
          class="dark:text-white truncate"
          class:opacity-70={$alreadyRead
            ? $alreadyRead.ids.includes(article.id)
            : false}
          title={article.description}
        >
          <ModalLink articleId={article.id}>{article.title}</ModalLink>
        </li>
      {/each}
    </ul>
  </aside>
{/if}
