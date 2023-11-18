<script lang="ts">
  import type { ArticleBase, SearchQuery } from "$shared/types/api";
  import type { PageData } from "./$types";

  import Loader from "$com/loader.svelte";
  import ArticleList from "$com/article-list/main.svelte";
  import Stats from "./stats.svelte";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { onMount } from "svelte";
  import { toUrl } from "$lib/common/searchQuery";
  import Stats from "./stats.svelte";

  export let data: PageData;

  let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  let stopDate = new Date();

  let articles: Promise<null | ArticleBase[]> = new Promise((resolve) =>
    resolve(null)
  );

  async function fetchArticles(): Promise<null | ArticleBase[]> {
    const q: SearchQuery = {
      sort_by: "publish_date",
      sort_order: "desc",
      limit: 3000,
      first_date: startDate.toISOString(),
      last_date: stopDate.toISOString(),
    };

    const r = await fetch(`${PUBLIC_API_BASE}/articles/search?${toUrl(q)}`);

    if (r.ok) {
      return await r.json();
    } else {
      return null;
    }
  }

  onMount(() => {
    articles = fetchArticles();
  });
</script>

<main
  class="
    flex w-full
    bg-surface-100 dark:bg-surface-800
"
>
  {#await articles}
    <Loader text="Loading articles for dashboard" />
  {:then articleList}
    {#if articleList}
      <div class="flex h-full w-full p-8">
        <div
          class="
          flex flex-col shrink-0
          w-3/5 h-full pr-8
          border-r border-tertiary-500 dark:border-surface-400

          overflow-y-auto
          "
        >
          <ArticleList
            tintReadArticles={false}
            articles={articleList}
            layout="large"
          />
        </div>

        <div
          class="
          flex flex-col gap-6
          w-2/5 h-full pl-8
        "
        >
          <Stats clusters={data.clusters} articles={articleList} />
        </div>
      </div>
    {/if}
  {/await}
</main>
