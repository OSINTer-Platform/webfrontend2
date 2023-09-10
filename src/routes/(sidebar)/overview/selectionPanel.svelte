<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import Search from "$com/utils/search.svelte";
  import Switch from "$com/utils/switch.svelte";

  import type { Readable } from "svelte/store";
  import type { MLArticle } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Updatable } from "$lib/common/customStores";

  import { onDestroy } from "svelte";
  import { derived } from "svelte/store";
  import { page } from "$app/stores";
  import { searchInArticle } from "$lib/common/filter";
  import { selectedArticles, controlParams } from "./state";

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
    bg-surface-100/90 dark:bg-surface-800/90
    backdrop-blur
  "
  >
    <div class="flex justify-between items-end mb-4">
      <h1
        class="
        dark:text-white text-3xl font-semibold
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
      containerClass={"mb-4"}
    >
      <Switch
        bind:checked={$showAllSelected}
        size={"sm"}
        containerClass={"mr-2"}
        title={"Show all selected articles (slow)"}
      />
    </Search>

    <ul class="overflow-auto">
      {#each $showAllSelected ? $searchedSelectedArticles : $searchedSelectedArticles.slice(0, 500) as article (article.id)}
        <li
          class="
            border-surface-400 border-y
            hover:border-primary-400 hover:dark:border-primary-900
            transition-colors duration-75"
          class:opacity-70={$alreadyRead
            ? $alreadyRead.ids.includes(article.id)
            : false}
          title={article.description}
        >
          <ModalLink
            articleId={article.id}
            class="
              block py-2 truncate
              dark:text-white
              hover:text-primary-500
              transition-colors duration-75">{article.title}</ModalLink
          >
        </li>
      {/each}
    </ul>
  </aside>
{/if}
