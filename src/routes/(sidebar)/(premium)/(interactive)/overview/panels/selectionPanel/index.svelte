<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import Search from "$inputs/search.svelte";
  import Switch from "$inputs/switch.svelte";

  import type { Collection } from "$shared/types/userItems";
  import type { Updatable } from "$lib/common/customStores";

  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import {
    selectedArticles,
    searchedSelectedArticles,
    controlParams,
  } from "../../state";
  import PanelShell from "../panelShell.svelte";

  const { selectedSearch, showAllSelected } = controlParams;

  onDestroy(
    selectedArticles.subscribe((articleList) => {
      if (articleList.length == 0) selectedSearch.set("");
    })
  );

  let alreadyRead: Updatable<null | Collection>;
  $: alreadyRead = $page.data?.alreadyRead;
</script>

<PanelShell class="h-full">
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
          articleList={$searchedSelectedArticles}
          class="
              block py-2 truncate
              dark:text-white
              dark:hover:text-primary-500 hover:text-primary-500
              transition-colors duration-75">{article.title}</ModalLink
        >
      </li>
    {/each}
  </ul>
</PanelShell>
